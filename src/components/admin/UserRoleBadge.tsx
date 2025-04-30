
import React from "react";
import { UserRole } from "@/hooks/usePermissions";
import { Shield, User, Users, Eye } from "lucide-react";

interface UserRoleBadgeProps {
  role: UserRole | null;
  className?: string;
  showLabel?: boolean;
}

const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({
  role,
  className = "",
  showLabel = true
}) => {
  if (!role) return null;
  
  const roleConfig: Record<UserRole, { icon: React.ReactNode; color: string; label: string }> = {
    admin: {
      icon: <Shield className="h-4 w-4" />,
      color: "bg-red-100 text-red-800 border-red-200",
      label: "Administrateur"
    },
    editor: {
      icon: <Users className="h-4 w-4" />,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      label: "Éditeur"
    },
    collaborator: {
      icon: <User className="h-4 w-4" />,
      color: "bg-green-100 text-green-800 border-green-200",
      label: "Collaborateur"
    },
    viewer: {
      icon: <Eye className="h-4 w-4" />,
      color: "bg-gray-100 text-gray-800 border-gray-200",
      label: "Observateur"
    }
  };
  
  const { icon, color, label } = roleConfig[role];
  
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${color} text-xs font-medium ${className}`}>
      {icon}
      {showLabel && <span>{label}</span>}
    </div>
  );
};

export default UserRoleBadge;
