
import React from "react";
import { usePermissions, TabPermissions } from "@/hooks/usePermissions";
import { Shield, Lock, AlertCircle } from "lucide-react";

interface PermissionGuardProps {
  requiredPermission: keyof TabPermissions;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  requiredPermission,
  fallback,
  children
}) => {
  const { hasPermission, loading, error } = usePermissions();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-garage-red border-t-transparent rounded-full"></div>
        <span className="ml-2">Vérification des permissions...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-md">
        <div className="flex items-center text-red-700 mb-2">
          <AlertCircle className="h-5 w-5 mr-2" />
          <h3 className="font-medium">Erreur de permissions</h3>
        </div>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }
  
  if (!hasPermission(requiredPermission)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border border-gray-200 rounded-md">
        <Lock className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">Accès restreint</h3>
        <p className="text-gray-500 text-center mt-2">
          Vous n'avez pas les permissions nécessaires pour accéder à cette section.
        </p>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default PermissionGuard;
