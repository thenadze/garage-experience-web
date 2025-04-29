
import { Button } from "@/components/ui/button";

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
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default AdminLoginDebug;
