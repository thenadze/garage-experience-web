
-- Cette migration doit être exécutée dans l'éditeur SQL de Supabase

-- Mise à jour de la structure de la table profiles pour ajouter la gestion des rôles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'viewer',
ADD COLUMN IF NOT EXISTS custom_permissions JSONB,
ADD COLUMN IF NOT EXISTS invited_by UUID;

COMMENT ON COLUMN public.profiles.role IS 'Le rôle de l''utilisateur: admin, editor, collaborator, ou viewer';
COMMENT ON COLUMN public.profiles.custom_permissions IS 'Permissions personnalisées pour l''utilisateur, si différentes des permissions par défaut du rôle';
COMMENT ON COLUMN public.profiles.invited_by IS 'ID de l''utilisateur qui a invité ce profil';

-- Configuration des politiques RLS pour la sécurité
-- Politique pour permettre aux utilisateurs de voir tous les profils
CREATE POLICY IF NOT EXISTS "Les utilisateurs peuvent voir tous les profils" 
ON public.profiles FOR SELECT 
USING (auth.role() = 'authenticated');

-- Politique pour permettre aux utilisateurs de modifier leur propre profil
CREATE POLICY IF NOT EXISTS "Les utilisateurs peuvent modifier leur propre profil" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Politique pour permettre aux utilisateurs de créer leur propre profil
CREATE POLICY IF NOT EXISTS "Les utilisateurs peuvent créer leur propre profil" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id OR auth.uid() IN (
  SELECT id FROM public.profiles WHERE role = 'admin'
));

-- Activer RLS sur la table profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Mise à jour des vues pour faciliter l'accès aux données
CREATE OR REPLACE VIEW public.user_permissions AS
SELECT 
  p.id,
  p.role,
  p.custom_permissions,
  CASE 
    WHEN p.custom_permissions IS NOT NULL THEN p.custom_permissions
    WHEN p.role = 'admin' THEN '{"list":true,"add":true,"edit":true,"delete":true,"settings":true,"users":true}'::jsonb
    WHEN p.role = 'editor' THEN '{"list":true,"add":true,"edit":true,"delete":false,"settings":false,"users":false}'::jsonb
    WHEN p.role = 'collaborator' THEN '{"list":true,"add":true,"edit":false,"delete":false,"settings":false,"users":false}'::jsonb
    ELSE '{"list":true,"add":false,"edit":false,"delete":false,"settings":false,"users":false}'::jsonb
  END as effective_permissions
FROM public.profiles p;

-- Donner accès à la vue
GRANT SELECT ON public.user_permissions TO authenticated;
GRANT SELECT ON public.user_permissions TO anon;
