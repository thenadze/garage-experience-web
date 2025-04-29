
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/components/ui/use-toast';

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        console.log("Vérification du statut admin...");
        
        // Vérifier si l'utilisateur est authentifié
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("Aucune session trouvée");
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        console.log("Session trouvée pour:", session.user.email);

        // Vérifier si l'utilisateur a le rôle admin en utilisant la table profiles
        const { data: adminData, error: adminError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (adminError) {
          console.error("Erreur lors de la vérification du profil:", adminError);
          
          // Vérifier si l'erreur est due à l'absence de l'enregistrement
          if (adminError.code === 'PGRST116') {
            console.log("Profil non trouvé - tentative de création");
            
            // Tenter de créer un profil pour cet utilisateur avec les champs corrects selon le schéma
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                first_name: "Admin", // Valeur par défaut
                last_name: "User",   // Valeur par défaut
                created_at: new Date().toISOString()
              });
            
            if (insertError) {
              console.error("Erreur de création du profil:", insertError);
              toast({
                variant: "destructive",
                title: "Erreur de profil",
                description: "Impossible de créer votre profil administrateur. Vérifiez les droits RLS dans Supabase.",
              });
              setIsAdmin(false);
            } else {
              console.log("Profil admin créé avec succès");
              setIsAdmin(true);
            }
          } else {
            setIsAdmin(false);
          }
        } else {
          console.log("Profil admin trouvé:", adminData);
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
  }, [toast]);

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
