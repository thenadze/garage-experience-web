
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface AdminLoginDebugProps {
  debugInfo: any;
  showDebugInfo: boolean;
  toggleDebugInfo: () => void;
}

const AdminLoginDebug = ({
  debugInfo,
  showDebugInfo,
  toggleDebugInfo
}: AdminLoginDebugProps) => {
  if (!debugInfo) return null;
  
  const isRLSError = debugInfo.isAuthError && debugInfo.code === "invalid_credentials";
  const isProfileRLSError = debugInfo.isRLSError && debugInfo.code === "rls_profile_creation";
  
  return (
    <div className="mt-4">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-xs text-gray-500"
        onClick={toggleDebugInfo}
      >
        {showDebugInfo ? "Masquer" : "Afficher"} les infos de débogage
      </Button>
      
      {showDebugInfo && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-left overflow-auto max-h-40">
          {(isRLSError || isProfileRLSError) && (
            <div className="mb-2 p-2 bg-amber-100 border border-amber-300 rounded">
              <div className="flex items-center mb-1 text-amber-800">
                <AlertCircle className="h-3 w-3 mr-1" />
                <span className="font-semibold">
                  {isProfileRLSError 
                    ? "Erreur RLS (Row-Level Security) sur création de profil" 
                    : "Erreur RLS (Row-Level Security) détectée"}
                </span>
              </div>
              
              <div className="mb-1">
                <span className="font-semibold">Causes possibles:</span>
                <ul className="list-disc pl-4 mt-1">
                  {debugInfo.possibleCauses?.map((cause: string, index: number) => (
                    <li key={index}>{cause}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <span className="font-semibold">Actions suggérées:</span>
                <ul className="list-disc pl-4 mt-1">
                  {debugInfo.suggestedActions?.map((action: string, index: number) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default AdminLoginDebug;
