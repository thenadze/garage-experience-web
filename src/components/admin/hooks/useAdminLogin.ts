
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
          
          toast({
            variant: "destructive",
            title: "Erreur de profil",
            description: "Impossible de créer votre profil. Vérifiez les droits RLS dans Supabase.",
          });
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
