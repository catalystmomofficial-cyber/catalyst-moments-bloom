-- Grant admin access to current user
INSERT INTO public.admin_roles (user_id, role) 
VALUES (auth.uid(), 'admin')
ON CONFLICT (user_id) DO NOTHING;