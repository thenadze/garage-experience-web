
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useAdminSignUp(email: string, password: string, onSuccess: () => void) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignUp = async () => {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Remplissez les champs email et mot de passe pour créer un compte",
      });
      return { success: false, debugInfo: { error: "Champs manquants" } };
    }
    
    try {
      setLoading(true);
      
      // Créer le compte avec Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            is_admin: true
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      console.log("Création du compte:", data);
      
      // Si l'inscription réussit, tenter de se connecter immédiatement
      if (data.user) {
        // Créer un profil pour l'utilisateur
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            first_name: "Admin",
            last_name: "User",
            created_at: new Date().toISOString()
          });
          
        if (profileError) {
          console.error("Erreur de création du profil:", profileError);
        } else {
          console.log("Profil créé avec succès");
          
          // Tenter une connexion immédiate si possible
          if (!data.session) {
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email,
              password
            });
            
            if (!signInError) {
              toast({
                title: "Connexion automatique réussie",
                description: "Vous êtes maintenant connecté à l'interface d'administration.",
              });
              onSuccess();
              return { success: true, debugInfo: data };
            }
          } else if (data.session) {
            // Si une session a été créée directement
            toast({
              title: "Compte créé et connecté",
              description: "Vous êtes maintenant connecté à l'interface d'administration.",
            });
            onSuccess();
            return { success: true, debugInfo: data };
          }
        }
      }
      
      toast({
        title: "Compte créé",
        description: "Un compte a été créé. Vous pouvez maintenant vous connecter avec ces identifiants.",
      });
      
      return { success: true, debugInfo: data };
    } catch (err: any) {
      console.error("Erreur création compte:", err);
      let errorMsg = err.message || "Erreur inconnue";
      
      // Messages d'erreur plus spécifiques
      if (err.message?.includes("User already registered")) {
        errorMsg = "Cet email est déjà enregistré. Essayez de vous connecter directement.";
      }
      
      toast({
        variant: "destructive",
        title: "Erreur de création de compte",
        description: errorMsg,
      });
      
      return { success: false, debugInfo: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSignUp
  };
}
