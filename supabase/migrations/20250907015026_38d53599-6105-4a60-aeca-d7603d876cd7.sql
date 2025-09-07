-- Grant admin access to the most recent users without conflict handling
INSERT INTO public.admin_roles (user_id, role) VALUES 
('63e1762b-00db-4e7a-a59d-c0656a2efbf2', 'admin'),
('be4b679c-8c64-485c-8dfb-ef70633e4dbc', 'admin'),
('30b60ed0-1104-4bec-a922-6aed810f3d9d', 'admin'),
('55bef1eb-ddcc-417b-a0c4-a1aa51f55aaa', 'admin');