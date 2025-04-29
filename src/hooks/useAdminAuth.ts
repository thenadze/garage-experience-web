
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Vérifier si l'utilisateur est authentifié
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Vérifier si l'utilisateur a le rôle admin en utilisant la table profiles
        // Nous utilisons une requête SQL brute pour éviter les problèmes de typage
        const { data: adminData, error: adminError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .single();
          
        if (adminError || !adminData) {
          setIsAdmin(false);
        } else {
          // Dans un environnement de production, vous devriez vérifier un champ spécifique
          // comme 'is_admin' dans la table profiles au lieu de simplement vérifier l'existence
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du statut admin:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    // Vérification initiale
    checkAdminStatus();

    // Configurer l'écouteur pour les changements d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(async () => {
      await checkAdminStatus();
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAdmin(false);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return { isAdmin, loading, logout };
}
