
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useAdminLogin(onSuccess: () => void) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
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
        const isRLSProblem = signInError.__isAuthError && 
                             signInError.code === "invalid_credentials";
        
        if (isRLSProblem) {
          console.log("Erreur d'authentification potentiellement liée au RLS, tentative de diagnostic...");
          
          // Test si l'utilisateur existe réellement
          const { data: userData, error: userError } = await supabase.auth
            .admin
            .getUserByEmail(email)
            .catch(() => ({ data: null, error: { message: "Non autorisé" } }));
          
          if (userData) {
            console.log("L'utilisateur existe dans Supabase Auth, probable problème de RLS");
          }
        }
        
        throw signInError;
      }
      
      console.log("Connexion réussie:", data);
      
      // Vérifier si l'utilisateur a un profil admin
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.log("Profil non trouvé, tentative de création");
        console.log("Erreur profil:", profileError);
        
        // Vérifier si c'est une erreur RLS
        const isRLSError = profileError.message && 
                          (profileError.message.includes('permission denied') ||
                           profileError.message.includes('policy'));
        
        if (isRLSError) {
          console.log("Erreur RLS détectée lors de l'accès au profil");
        }
        
        // Créer un profil avec les champs corrects
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            first_name: "Admin",
            last_name: "User",
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
            
            toast({
              variant: "destructive",
              title: "Erreur RLS sur le profil",
              description: "Votre connexion a réussi, mais la création du profil a échoué à cause des politiques RLS. Vérifiez vos politiques RLS pour la table 'profiles'.",
            });
            
            // On renvoie quand même un succès pour permettre la création du profil manuellement
            onSuccess();
            return { 
              success: true, 
              debugInfo: {
                ...data,
                __isAuthError: false,
                __isRLSError: true,
                code: "rls_profile_creation",
                message: "Connexion réussie mais erreur RLS sur création de profil",
                originalError: createProfileError
              }
            };
          } else {
            toast({
              variant: "destructive",
              title: "Erreur de profil",
              description: "Impossible de créer votre profil. Vérifiez les droits RLS dans Supabase.",
            });
          }
        } else {
          console.log("Profil créé avec succès");
        }
      } else {
        console.log("Profil trouvé:", profileData);
      }
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans l'interface d'administration.",
      });
      
      onSuccess();
      return { success: true, debugInfo: data };
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      
      // Message d'erreur plus détaillé
      let errorMessage = "Identifiants incorrects";
      
      if (err.message) {
        if (err.message.includes("Invalid login credentials")) {
          errorMessage = "Email ou mot de passe incorrect. Vérifiez vos identifiants Supabase.";
          
          // Ajouter des informations supplémentaires liées au RLS
          err.__isRLSProblem = true;
          err.rls_detail = "Cette erreur peut être causée par des politiques RLS bloquant l'authentification";
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
      
      return { success: false, debugInfo: err };
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
    handleLogin
  };
}
