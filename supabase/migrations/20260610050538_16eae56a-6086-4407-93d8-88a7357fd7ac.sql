
-- 1. Profiles: restrict broad read access
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
CREATE POLICY "profiles_select_self_or_manager" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    id = auth.uid()
    OR public.has_role(auth.uid(),'admin')
    OR public.has_role(auth.uid(),'coordinator')
  );

-- 2. event_volunteers: restrict broad read access
DROP POLICY IF EXISTS "ev_select_all" ON public.event_volunteers;
CREATE POLICY "ev_select_self_or_manager" ON public.event_volunteers
  FOR SELECT TO authenticated
  USING (
    volunteer_id = auth.uid()
    OR public.has_role(auth.uid(),'admin')
    OR public.has_role(auth.uid(),'coordinator')
  );

-- 3. certificates: restrict INSERT to managers (trigger uses SECURITY DEFINER, still works)
DROP POLICY IF EXISTS "cert_insert_auth" ON public.certificates;
CREATE POLICY "cert_insert_manager" ON public.certificates
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(),'admin')
    OR public.has_role(auth.uid(),'coordinator')
  );

-- 4. notifications: restrict INSERT to managers (triggers use SECURITY DEFINER)
DROP POLICY IF EXISTS "notif_insert_any_auth" ON public.notifications;
CREATE POLICY "notif_insert_manager" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(),'admin')
    OR public.has_role(auth.uid(),'coordinator')
  );

-- 5. Harden set_updated_at search_path
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- 6. Lock down SECURITY DEFINER functions: revoke broad EXECUTE, grant only where needed
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_my_roles() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.maybe_issue_certificate() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.event_completion_certs() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_set_role(text, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_remove_role(uuid, public.app_role) FROM PUBLIC, anon;

-- has_role is referenced inside RLS policies; policy evaluation runs as the policy owner,
-- but to be safe re-grant to authenticated (RLS uses it via the SECURITY DEFINER context).
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_roles() TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_role(text, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_remove_role(uuid, public.app_role) TO authenticated;
