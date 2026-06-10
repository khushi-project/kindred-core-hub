CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  meta_role text;
  assigned public.app_role;
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone'
  );

  IF lower(NEW.email) = 'tom@gmail.com' THEN
    assigned := 'admin';
  ELSE
    meta_role := NEW.raw_user_meta_data->>'role';
    IF meta_role = 'coordinator' THEN
      assigned := 'coordinator';
    ELSE
      assigned := 'volunteer';
    END IF;
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, assigned);
  RETURN NEW;
END;
$$;