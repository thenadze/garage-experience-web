
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

interface AdminLoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  error: string;
  rslHelp?: string;
  onSubmit: (e: React.FormEvent) => void;
  onCreateAccount: () => void;
}

const AdminLoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  error,
  rslHelp,
  onSubmit,
  onCreateAccount
}: AdminLoginFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="bg-red-100">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {rslHelp && (
        <Alert className="bg-amber-50 border border-amber-200 text-amber-800">
          <Info className="h-4 w-4 text-amber-800" />
          <AlertDescription className="whitespace-pre-wrap text-xs">{rslHelp}</AlertDescription>
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
          onClick={onCreateAccount}
          disabled={loading}
        >
          Créer un compte administrateur
        </Button>
      </div>
    </form>
  );
};

export default AdminLoginForm;
