-- First, add a unique constraint to admin_roles table
ALTER TABLE public.admin_roles ADD CONSTRAINT admin_roles_user_id_unique UNIQUE (user_id);

-- Now grant admin access to current user
INSERT INTO public.admin_roles (user_id, role) 
VALUES (auth.uid(), 'admin')
ON CONFLICT (user_id) DO NOTHING;