
import { Car } from "lucide-react";
import { useAdminLogin } from "./hooks/useAdminLogin";
import { useAdminSignUp } from "./hooks/useAdminSignUp";
import { useDebugInfo } from "./hooks/useDebugInfo";
import AdminLoginForm from "./AdminLoginForm";
import AdminLoginDebug from "./AdminLoginDebug";

interface AdminLoginProps {
  onSuccess: () => void;
}

const AdminLogin = ({ onSuccess }: AdminLoginProps) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin
  } = useAdminLogin(onSuccess);

  const { loading: signUpLoading, handleSignUp } = useAdminSignUp(email, password, onSuccess);
  
  const {
    debugInfo,
    showDebugInfo,
    toggleDebugInfo,
    updateDebugInfo,
    clearDebugInfo
  } = useDebugInfo();

  const handleSubmitForm = async (e: React.FormEvent) => {
    clearDebugInfo();
    const result = await handleLogin(e);
    if (result?.debugInfo) {
      updateDebugInfo(result.debugInfo);
    }
  };

  const handleDebugSignUp = async () => {
    clearDebugInfo();
    const result = await handleSignUp();
    if (result?.debugInfo) {
      updateDebugInfo(result.debugInfo);
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
        
        <AdminLoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading || signUpLoading}
          error={error}
          onSubmit={handleSubmitForm}
          onCreateAccount={handleDebugSignUp}
        />
        
        <AdminLoginDebug
          debugInfo={debugInfo}
          showDebugInfo={showDebugInfo}
          toggleDebugInfo={toggleDebugInfo}
        />
      </div>
    </div>
  );
};

export default AdminLogin;
