
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";

export function useAdminLogin(onSuccess: () => void) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rslHelp, setRlsHelp] = useState("");
  const { toast } = useToast();

  // Check for existing session on load
  useEffect(() => {
    const checkExistingSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("Session existante trouvée:", session.user.email);
        toast({
          title: "Session existante",
          description: `Une session est déjà active pour ${session.user.email}`,
        });
        onSuccess();
      }
    };
    
    checkExistingSession();
  }, [onSuccess, toast]);

  // Fonction spécifique pour afficher l'aide RLS
  const showRlsHelp = () => {
    setRlsHelp(
      "Pour résoudre ce problème RLS, suivez ces étapes dans votre tableau de bord Supabase:\n\n" +
      "1. Allez dans Authentication → Policies\n" +
      "2. Trouvez la table 'profiles'\n" +
      "3. Ajoutez une politique INSERT avec: (auth.uid() = id)\n" +
      "4. Activez RLS sur la table si ce n'est pas déjà fait\n\n" +
      "Note: Vérifiez aussi que l'utilisateur existe dans Authentication → Users"
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setRlsHelp("");
    
    if (!email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    
    try {
      setLoading(true);
      console.log("Tentative de connexion avec:", email);
      
      // Authentification avec Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) {
        console.error("Erreur Supabase:", signInError);
        
        // Détecter si c'est probablement une erreur RLS
        const isRLSProblem = signInError instanceof AuthError && 
                            signInError.code === "invalid_credentials";
        
        if (isRLSProblem) {
          console.log("Erreur d'authentification potentiellement liée au RLS, tentative de diagnostic...");
          showRlsHelp();
        }
        
        throw signInError;
      }
      
      console.log("Connexion réussie:", data);
      
      try {
        // Vérifier si l'utilisateur a un profil admin avec DISABLE RLS
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError) {
          console.log("Profil non trouvé, tentative de création avec DISABLE RLS");
          console.log("Erreur profil:", profileError);
          
          try {
            // Essayons avec DISABLE RLS
            const { error: disableRlsError } = await supabase.rpc('create_profile_bypass_rls', {
              user_id: data.user.id,
              first_name: "Admin",
              last_name: "User",
              created_at_time: new Date().toISOString()
            });
            
            if (disableRlsError) {
              console.error("Erreur RPC bypass RLS:", disableRlsError);
              throw disableRlsError;
            } else {
              console.log("Profil créé avec succès via RPC");
              toast({
                title: "Connexion réussie",
                description: "Bienvenue dans l'interface d'administration.",
              });
              
              onSuccess();
              return { success: true, debugInfo: data };
            }
          } catch (rpcError) {
            console.error("Erreur lors de la création via RPC:", rpcError);
            
            // Créer un profil standard avec les champs corrects
            const { error: createProfileError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                first_name: "Admin",
                last_name: "User",
                role: "admin", // Assurez-vous qu'il est admin
                created_at: new Date().toISOString()
              });
            
            if (createProfileError) {
              console.error("Erreur de création du profil:", createProfileError);
              
              // Vérifier si c'est une erreur RLS
              const isCreateRLSError = createProfileError.message && 
                                   (createProfileError.message.includes('permission denied') ||
                                    createProfileError.message.includes('policy'));
              
              if (isCreateRLSError) {
                console.log("Erreur RLS détectée lors de la création du profil");
                showRlsHelp();
                
                toast({
                  variant: "destructive",
                  title: "Erreur RLS sur le profil",
                  description: "Les politiques RLS empêchent la création du profil. Vérifiez vos politiques RLS pour la table 'profiles'.",
                });
                
                // Au lieu de retourner un succès, nous retournons une erreur
                // et nous ne faisons PAS de onSuccess()
                await supabase.auth.signOut(); // Déconnexion pour éviter une session partiellement valide
                
                return { 
                  success: false, 
                  debugInfo: {
                    ...data,
                    isAuthError: false,
                    isRLSError: true,
                    code: "rls_profile_creation",
                    message: "Erreur RLS sur création de profil",
                    originalError: createProfileError
                  }
                };
              } else {
                toast({
                  variant: "destructive",
                  title: "Erreur de profil",
                  description: "Impossible de créer votre profil. Vérifiez les droits RLS dans Supabase.",
                });
                
                // Déconnexion en cas d'erreur
                await supabase.auth.signOut();
                
                return {
                  success: false,
                  debugInfo: {
                    error: createProfileError,
                    message: "Erreur de création de profil"
                  }
                };
              }
            } else {
              console.log("Profil créé avec succès");
              toast({
                title: "Connexion réussie",
                description: "Bienvenue dans l'interface d'administration.",
              });
              
              onSuccess();
              return { success: true, debugInfo: data };
            }
          }
        } else {
          console.log("Profil trouvé:", profileData);
          toast({
            title: "Connexion réussie",
            description: "Bienvenue dans l'interface d'administration.",
          });
          
          onSuccess();
          return { success: true, debugInfo: data };
        }
      } catch (profileErr) {
        console.error("Erreur lors de la gestion du profil:", profileErr);
        throw profileErr;
      }
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      
      // Message d'erreur plus détaillé
      let errorMessage = "Identifiants incorrects";
      
      if (err.message) {
        if (err.message.includes("Invalid login credentials")) {
          errorMessage = "Email ou mot de passe incorrect. Vérifiez vos identifiants Supabase.";
          showRlsHelp();
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: `${errorMessage} (Code: ${err.code || 'inconnu'})`,
      });
      
      return { 
        success: false, 
        debugInfo: {
          ...err,
          isAuthError: err instanceof AuthError,
          code: err.code || "unknown_error"
        }
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    rslHelp,
    handleLogin
  };
}
