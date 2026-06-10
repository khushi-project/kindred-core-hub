
-- ENUMS
CREATE TYPE public.app_role AS ENUM ('admin', 'coordinator', 'volunteer');
CREATE TYPE public.event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late');
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE public.task_status AS ENUM ('todo', 'in-progress', 'done');

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  avatar_url TEXT,
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- USER ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION public.get_my_roles()
RETURNS SETOF public.app_role
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT role FROM public.user_roles WHERE user_id = auth.uid() $$;

-- EVENTS
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  banner_url TEXT,
  status public.event_status NOT NULL DEFAULT 'upcoming',
  capacity INT NOT NULL DEFAULT 50,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- EVENT COORDINATORS
CREATE TABLE public.event_coordinators (
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  coordinator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY(event_id, coordinator_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_coordinators TO authenticated;
GRANT ALL ON public.event_coordinators TO service_role;
ALTER TABLE public.event_coordinators ENABLE ROW LEVEL SECURITY;

-- EVENT VOLUNTEERS
CREATE TABLE public.event_volunteers (
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  volunteer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coordinator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY(event_id, volunteer_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_volunteers TO authenticated;
GRANT ALL ON public.event_volunteers TO service_role;
ALTER TABLE public.event_volunteers ENABLE ROW LEVEL SECURITY;

-- ATTENDANCE
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  volunteer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.attendance_status NOT NULL DEFAULT 'present',
  hours NUMERIC(5,2) NOT NULL DEFAULT 0,
  marked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  marked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(event_id, volunteer_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance TO authenticated;
GRANT ALL ON public.attendance TO service_role;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- TASKS
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date DATE,
  priority public.task_priority NOT NULL DEFAULT 'medium',
  status public.task_status NOT NULL DEFAULT 'todo',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- CERTIFICATES
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  volunteer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certificate_code TEXT NOT NULL UNIQUE DEFAULT ('VOL-' || upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  hours NUMERIC(5,2) NOT NULL DEFAULT 0,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(event_id, volunteer_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- ============ POLICIES ============
-- profiles: everyone authenticated can read profile basics; users update self; admins update any
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert_self" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_self" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "profiles_delete_admin" ON public.profiles FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- user_roles: users see own; admins see all; admins manage
CREATE POLICY "roles_select_self_or_admin" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "roles_insert_admin" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "roles_delete_admin" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- events: read all auth; admins write
CREATE POLICY "events_select_all" ON public.events FOR SELECT TO authenticated USING (true);
CREATE POLICY "events_insert_admin" ON public.events FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "events_update_admin_or_coordinator" ON public.events FOR UPDATE TO authenticated USING (
  public.has_role(auth.uid(),'admin') OR EXISTS (SELECT 1 FROM public.event_coordinators ec WHERE ec.event_id = events.id AND ec.coordinator_id = auth.uid())
);
CREATE POLICY "events_delete_admin" ON public.events FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- event_coordinators
CREATE POLICY "ec_select_all" ON public.event_coordinators FOR SELECT TO authenticated USING (true);
CREATE POLICY "ec_write_admin" ON public.event_coordinators FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- event_volunteers
CREATE POLICY "ev_select_all" ON public.event_volunteers FOR SELECT TO authenticated USING (true);
CREATE POLICY "ev_insert_self_or_manager" ON public.event_volunteers FOR INSERT TO authenticated WITH CHECK (
  volunteer_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coordinator')
);
CREATE POLICY "ev_delete_self_or_manager" ON public.event_volunteers FOR DELETE TO authenticated USING (
  volunteer_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coordinator')
);
CREATE POLICY "ev_update_manager" ON public.event_volunteers FOR UPDATE TO authenticated USING (
  public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coordinator')
);

-- attendance
CREATE POLICY "att_select_self_or_manager" ON public.attendance FOR SELECT TO authenticated USING (
  volunteer_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coordinator')
);
CREATE POLICY "att_write_manager" ON public.attendance FOR ALL TO authenticated USING (
  public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coordinator')
) WITH CHECK (
  public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coordinator')
);

-- tasks
CREATE POLICY "tasks_select_relevant" ON public.tasks FOR SELECT TO authenticated USING (
  assignee_id = auth.uid() OR created_by = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coordinator')
);
CREATE POLICY "tasks_write_manager" ON public.tasks FOR ALL TO authenticated USING (
  public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coordinator')
) WITH CHECK (
  public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coordinator')
);

-- notifications: own only; system/admin can insert for anyone
CREATE POLICY "notif_select_own" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notif_update_own" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notif_delete_own" ON public.notifications FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notif_insert_any_auth" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);

-- certificates: volunteer reads own; admin/coordinator read all; system inserts
CREATE POLICY "cert_select_own_or_manager" ON public.certificates FOR SELECT TO authenticated USING (
  volunteer_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coordinator')
);
CREATE POLICY "cert_insert_auth" ON public.certificates FOR INSERT TO authenticated WITH CHECK (true);

-- ============ TRIGGERS ============
-- on new auth user create profile + assign volunteer role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'volunteer');
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_events_updated BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- auto-issue certificate when attendance present + event completed
CREATE OR REPLACE FUNCTION public.maybe_issue_certificate()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE ev_status public.event_status;
BEGIN
  SELECT status INTO ev_status FROM public.events WHERE id = NEW.event_id;
  IF NEW.status = 'present' AND ev_status = 'completed' THEN
    INSERT INTO public.certificates (event_id, volunteer_id, hours)
    VALUES (NEW.event_id, NEW.volunteer_id, NEW.hours)
    ON CONFLICT (event_id, volunteer_id) DO NOTHING;
    INSERT INTO public.notifications (user_id, title, description, type)
    VALUES (NEW.volunteer_id, 'Certificate issued', 'Your participation certificate is ready to download.', 'success');
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_attendance_cert AFTER INSERT OR UPDATE ON public.attendance
  FOR EACH ROW EXECUTE FUNCTION public.maybe_issue_certificate();

-- when event marked completed, issue certs for all present attendees
CREATE OR REPLACE FUNCTION public.event_completion_certs()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS DISTINCT FROM 'completed') THEN
    INSERT INTO public.certificates (event_id, volunteer_id, hours)
    SELECT a.event_id, a.volunteer_id, a.hours
    FROM public.attendance a
    WHERE a.event_id = NEW.id AND a.status = 'present'
    ON CONFLICT (event_id, volunteer_id) DO NOTHING;

    INSERT INTO public.notifications (user_id, title, description, type)
    SELECT a.volunteer_id, 'Certificate issued', 'Your certificate for ' || NEW.title || ' is ready.', 'success'
    FROM public.attendance a WHERE a.event_id = NEW.id AND a.status = 'present';
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_event_completion_certs AFTER UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.event_completion_certs();

-- Claim first admin (only works if no admin exists yet)
CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN FALSE; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RETURN FALSE;
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'admin')
    ON CONFLICT DO NOTHING;
  RETURN TRUE;
END; $$;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;

-- Admin: promote user to coordinator (or any role) by email
CREATE OR REPLACE FUNCTION public.admin_set_role(_email TEXT, _role public.app_role)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE target_id UUID;
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Not authorized'; END IF;
  SELECT id INTO target_id FROM auth.users WHERE email = _email;
  IF target_id IS NULL THEN RAISE EXCEPTION 'User not found'; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (target_id, _role)
    ON CONFLICT (user_id, role) DO NOTHING;
  RETURN TRUE;
END; $$;
GRANT EXECUTE ON FUNCTION public.admin_set_role(TEXT, public.app_role) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_remove_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Not authorized'; END IF;
  DELETE FROM public.user_roles WHERE user_id = _user_id AND role = _role;
  RETURN TRUE;
END; $$;
GRANT EXECUTE ON FUNCTION public.admin_remove_role(UUID, public.app_role) TO authenticated;
