
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

        // Vérifier si l'utilisateur est dans la table admin_users
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('id')
          .eq('email', session.user.email)
          .single();
          
        if (adminError || !adminData) {
          setIsAdmin(false);
        } else {
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
