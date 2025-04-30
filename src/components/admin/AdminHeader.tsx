
import React from "react";
import { Button } from "@/components/ui/button";
import { Car, Eye, LogOut, Users } from "lucide-react";
import UserRoleBadge from "@/components/admin/UserRoleBadge";
import { UserRole } from "@/hooks/usePermissions";

interface AdminHeaderProps {
  userRole: UserRole | null;
  hasUsersPermission: boolean;
  onOpenInviteDialog: () => void;
  onViewWebsite: () => void;
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  userRole,
  hasUsersPermission,
  onOpenInviteDialog,
  onViewWebsite,
  onLogout
}) => {
  return (
    <div className="bg-garage-black text-white py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Car className="h-6 w-6" />
        <h1 className="text-xl font-bold">Admin Garage</h1>
        {userRole && (
          <div className="ml-3">
            <UserRoleBadge role={userRole} />
          </div>
        )}
      </div>
      <div className="flex gap-3">
        {hasUsersPermission && (
          <Button
            variant="outline"
            className="border-white text-white hover:text-garage-black"
            onClick={onOpenInviteDialog}
          >
            <Users className="mr-2 h-4 w-4" />
            Inviter un utilisateur
          </Button>
        )}
        <Button
          variant="outline"
          className="border-white text-white hover:text-garage-black"
          onClick={onViewWebsite}
        >
          <Eye className="mr-2 h-4 w-4" />
          Voir le site
        </Button>
        <Button
          variant="outline"
          className="border-white text-white hover:text-garage-black"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;
