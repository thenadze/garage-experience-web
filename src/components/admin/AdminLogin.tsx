
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Car, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdminLoginProps {
  onSuccess: () => void;
}

const AdminLogin = ({ onSuccess }: AdminLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const { toast } = useToast();

  // Vérifier s'il existe déjà une session active
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setDebugInfo(null);
    
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
        // Sauvegarder l'erreur pour débogage
        setDebugInfo({
          error: signInError,
          type: "signIn",
          message: signInError.message,
          email: email
        });
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
        setDebugInfo({
          error: profileError,
          type: "profile",
          userId: data.user.id
        });
        
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
          setDebugInfo(prev => ({
            ...prev,
            createProfileError: createProfileError
          }));
          
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
      setError("Remplissez les champs email et mot de passe pour créer un compte");
      return;
    }
    
    try {
      setLoading(true);
      setDebugInfo(null);
      
      // Vérifier d'abord si l'email existe déjà
      const { data: existingUsers, error: checkError } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1,
        filter: {
          email: email
        }
      }).catch(() => ({ data: null, error: null }));
      
      // Si l'API admin n'est pas disponible, on continue avec la création du compte
      console.log("Vérification de l'utilisateur existant:", existingUsers);
      
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
        setDebugInfo({
          error: error,
          type: "signUp",
          message: error.message
        });
        throw error;
      }
      
      console.log("Création du compte:", data);
      setDebugInfo({
        success: true,
        user: data.user,
        type: "signUp"
      });
      
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
          setDebugInfo(prev => ({
            ...prev,
            profileError: profileError
          }));
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
              return;
            }
          } else if (data.session) {
            // Si une session a été créée directement
            toast({
              title: "Compte créé et connecté",
              description: "Vous êtes maintenant connecté à l'interface d'administration.",
            });
            onSuccess();
            return;
          }
        }
      }
      
      toast({
        title: "Compte créé",
        description: "Un compte a été créé. Vous pouvez maintenant vous connecter avec ces identifiants.",
      });
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
            <Alert variant="destructive" className="bg-red-100">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
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
              className="text-xs mb-2"
              onClick={handleDebugSignUp}
              disabled={loading}
            >
              Créer un compte administrateur
            </Button>
            
            {debugInfo && (
              <div className="mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs text-gray-500"
                  onClick={() => setShowDebugInfo(!showDebugInfo)}
                >
                  {showDebugInfo ? "Masquer" : "Afficher"} les infos de débogage
                </Button>
                
                {showDebugInfo && (
                  <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-left overflow-auto max-h-40">
                    <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
