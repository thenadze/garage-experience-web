
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/components/ui/use-toast';

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        console.log("Vérification du statut admin...");
        
        // Vérifier si l'utilisateur est authentifié
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Erreur lors de la récupération de la session:", sessionError);
          setDebugInfo({
            error: sessionError,
            type: "session"
          });
        }
        
        if (!session) {
          console.log("Aucune session trouvée");
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        console.log("Session trouvée pour:", session.user.email);
        setUser(session.user);
        setDebugInfo({
          user: {
            id: session.user.id,
            email: session.user.email,
            app_metadata: session.user.app_metadata,
            user_metadata: session.user.user_metadata,
          }
        });

        // Vérifier si l'utilisateur a le rôle admin en utilisant la table profiles
        const { data: adminData, error: adminError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (adminError) {
          console.error("Erreur lors de la vérification du profil:", adminError);
          setDebugInfo(prev => ({
            ...prev,
            profileError: adminError
          }));
          
          // Vérifier si l'erreur est due à l'absence de l'enregistrement
          if (adminError.code === 'PGRST116') {
            console.log("Profil non trouvé - tentative de création");
            
            // Tenter de créer un profil pour cet utilisateur avec les champs corrects selon le schéma
            const { data: insertData, error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                first_name: "Admin", // Valeur par défaut
                last_name: "User",   // Valeur par défaut
                created_at: new Date().toISOString()
              })
              .select()
              .single();
            
            if (insertError) {
              console.error("Erreur de création du profil:", insertError);
              setDebugInfo(prev => ({
                ...prev,
                insertError: insertError
              }));
              
              toast({
                variant: "destructive",
                title: "Erreur de profil",
                description: "Impossible de créer votre profil administrateur. Vérifiez les droits RLS dans Supabase.",
              });
              
              // Vérifier si c'est une erreur RLS
              if (insertError.message?.includes('permission denied')) {
                toast({
                  variant: "destructive",
                  title: "Erreur de permissions",
                  description: "Vous n'avez pas les droits suffisants pour créer un profil. Vérifiez les politiques RLS dans Supabase.",
                });
              }
              
              setIsAdmin(false);
            } else {
              console.log("Profil admin créé avec succès:", insertData);
              setDebugInfo(prev => ({
                ...prev,
                profileCreated: insertData
              }));
              setIsAdmin(true);
            }
          } else {
            setIsAdmin(false);
          }
        } else {
          console.log("Profil admin trouvé:", adminData);
          setDebugInfo(prev => ({
            ...prev,
            profile: adminData
          }));
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du statut admin:", error);
        setDebugInfo({
          error: error,
          type: "general"
        });
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    // Vérification initiale
    checkAdminStatus();

    // Configurer l'écouteur pour les changements d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Événement d'authentification:", event);
      if (session) {
        console.log("Nouvelle session utilisateur:", session.user.email);
      }
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
      setUser(null);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };
  
  // Exposer les informations de débogage pour aider à résoudre les problèmes
  const getDebugInfo = () => {
    return {
      isAdmin,
      user,
      debugInfo
    };
  };

  return { isAdmin, loading, logout, user, getDebugInfo };
}
