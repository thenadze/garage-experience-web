
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Car } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AdminLoginProps {
  onSuccess: () => void;
}

const AdminLogin = ({ onSuccess }: AdminLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
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
    } finally {
      setLoading(false);
    }
  };

  const handleDebugSignUp = async () => {
    if (!email || !password) {
      setError("Remplissez les champs email et mot de passe pour créer un compte de débogage");
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            is_admin: true
          }
        }
      });
      
      if (error) throw error;
      
      console.log("Création du compte:", data);
      
      // Si l'inscription réussit, créer un profil pour l'utilisateur
      if (data.user) {
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
        }
      }
      
      toast({
        title: "Compte créé",
        description: "Un compte a été créé. Vérifiez votre email pour confirmer. Si cela ne fonctionne pas, configurez l'authentification dans la console Supabase.",
      });
    } catch (err: any) {
      console.error("Erreur création compte:", err);
      toast({
        variant: "destructive",
        title: "Erreur de création de compte",
        description: err.message || "Erreur inconnue",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-garage-red rounded-full p-3 mb-4">
            <Car className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Administration Garage</h1>
          <p className="text-gray-600">Connectez-vous pour gérer les annonces</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Entrez votre email"
              className={error ? "border-red-500" : ""}
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Mot de passe
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre mot de passe"
              className={error ? "border-red-500" : ""}
              disabled={loading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-garage-red hover:bg-garage-red/90"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                Connexion...
              </>
            ) : (
              "Connexion"
            )}
          </Button>
          
          <div className="text-center mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Problèmes de connexion?</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handleDebugSignUp}
              disabled={loading}
            >
              Créer un compte administrateur
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
