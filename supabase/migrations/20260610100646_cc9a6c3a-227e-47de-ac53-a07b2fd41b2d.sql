-- 1) Ensure trigger fires handle_new_user on new auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2) Backfill: create missing profiles for existing auth users
INSERT INTO public.profiles (id, email, full_name, phone)
SELECT u.id, u.email,
       COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email,'@',1)),
       u.raw_user_meta_data->>'phone'
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- 3) Backfill: assign roles for existing users that have none
INSERT INTO public.user_roles (user_id, role)
SELECT u.id,
  CASE
    WHEN lower(u.email) = 'tom@gmail.com' THEN 'admin'::public.app_role
    WHEN u.raw_user_meta_data->>'role' = 'coordinator' THEN 'coordinator'::public.app_role
    WHEN u.raw_user_meta_data->>'role' = 'admin' THEN 'admin'::public.app_role
    ELSE 'volunteer'::public.app_role
  END
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = u.id);

-- 4) Ensure tom@gmail.com always has admin role if account exists
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE lower(u.email) = 'tom@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;