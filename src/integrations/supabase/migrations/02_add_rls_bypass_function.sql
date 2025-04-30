
-- Cette fonction permet de créer un profil en contournant les politiques RLS
-- Exécutez cette SQL dans l'éditeur SQL de Supabase

-- Fonction pour créer un profil en contournant RLS
CREATE OR REPLACE FUNCTION public.create_profile_bypass_rls(
  user_id UUID,
  first_name TEXT,
  last_name TEXT,
  created_at_time TIMESTAMPTZ
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER -- Important: s'exécute avec les privilèges du créateur
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, created_at, role)
  VALUES (user_id, first_name, last_name, created_at_time, 'admin');
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Erreur lors de la création du profil: %', SQLERRM;
END;
$$;

-- Commentaire pour expliquer la fonction
COMMENT ON FUNCTION public.create_profile_bypass_rls IS 
'Fonction pour créer un profil utilisateur en contournant les politiques RLS.
Cette fonction utilise SECURITY DEFINER pour s''exécuter avec les privilèges élevés.';

-- Accorder les permissions d'exécution aux utilisateurs authentifiés
GRANT EXECUTE ON FUNCTION public.create_profile_bypass_rls TO authenticated;

-- Vérifier que RLS est activé sur la table profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politique RLS pour permettre aux utilisateurs de créer leur propre profil
CREATE POLICY IF NOT EXISTS "Les utilisateurs peuvent créer leur propre profil" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Politique RLS pour permettre la lecture des profils
CREATE POLICY IF NOT EXISTS "Les utilisateurs peuvent lire les profils" 
ON public.profiles FOR SELECT 
USING (true);
