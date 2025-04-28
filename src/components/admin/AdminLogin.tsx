
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Car } from "lucide-react";

// Ces identifiants devraient idéalement être conservés de manière plus sécurisée,
// comme dans une base de données ou via l'authentification Supabase
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "garage2025";

interface AdminLoginProps {
  onSuccess: () => void;
}

const AdminLogin = ({ onSuccess }: AdminLoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation simple
    if (!username.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    
    // Vérification des identifiants
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("adminAuthenticated", "true");
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans l'interface d'administration.",
      });
      onSuccess();
    } else {
      setError("Identifiants incorrects");
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Nom d'utilisateur ou mot de passe incorrect.",
      });
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
            <label htmlFor="username" className="block text-sm font-medium">
              Nom d'utilisateur
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Entrez votre nom d'utilisateur"
              className={error ? "border-red-500" : ""}
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
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-garage-red hover:bg-garage-red/90"
          >
            Connexion
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
