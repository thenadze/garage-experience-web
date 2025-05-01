
-- Script pour nettoyer les politiques redondantes de la table profiles
-- Exécutez cette migration dans l'éditeur SQL de Supabase

-- 1. D'abord, nous allons supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "creer_propre_profil" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Les utilisateurs peuvent modifier leur propre profil" ON public.profiles;
DROP POLICY IF EXISTS "lire_les_profils" ON public.profiles;
DROP POLICY IF EXISTS "permission" ON public.profiles;
DROP POLICY IF EXISTS "Les utilisateurs peuvent créer leur propre profil" ON public.profiles;
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir tous les profils" ON public.profiles;

-- 2. Vérifier que RLS est activé (le réactiver si nécessaire)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Créer uniquement les politiques nécessaires avec des noms clairs

-- Politique SELECT - Permettre à tous les utilisateurs authentifiés de voir tous les profils
CREATE POLICY "profiles_select_policy" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Politique INSERT - Permettre aux utilisateurs authentifiés de créer leur propre profil
CREATE POLICY "profiles_insert_policy" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Politique UPDATE - Permettre aux utilisateurs de modifier uniquement leur propre profil
CREATE POLICY "profiles_update_policy" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. Fonction RPC pour contourner RLS (réinstaller si nécessaire)
-- Cette fonction est déjà définie dans 02_add_rls_bypass_function.sql, donc nous vérifions juste qu'elle existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'create_profile_bypass_rls' 
    AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    -- La fonction n'existe pas, on la recrée (normalement déjà créée par 02_add_rls_bypass_function.sql)
    RAISE NOTICE 'La fonction create_profile_bypass_rls n''existe pas, consultez le fichier 02_add_rls_bypass_function.sql pour la créer.';
  END IF;
END
$$;

-- 5. Vérifier que les permissions sont correctement attribuées
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- Commentaire explicatif
COMMENT ON TABLE public.profiles IS 'Table des profils utilisateurs avec politiques RLS simplifiées';
