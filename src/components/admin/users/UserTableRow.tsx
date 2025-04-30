
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TrashIcon, Edit, Shield } from "lucide-react";
import UserRoleBadge from "../UserRoleBadge";
import { ExtendedProfile, UserRole } from "@/hooks/usePermissions";

interface UserProfile extends ExtendedProfile {
  email: string;
}

interface UserTableRowProps {
  user: UserProfile;
  isCurrentUser: boolean;
  onDelete: (userId: string) => Promise<void>;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({ 
  user, 
  isCurrentUser,
  onDelete
}) => {
  return (
    <TableRow>
      <TableCell>
        {user.first_name} {user.last_name}
        {isCurrentUser && (
          <span className="ml-2 text-xs text-gray-500 italic">(vous)</span>
        )}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <UserRoleBadge role={user.role as UserRole} />
      </TableCell>
      <TableCell>
        {user.custom_permissions ? (
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Personnalisées</span>
        ) : (
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">Standard</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          {!isCurrentUser && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDelete(user.id)}
            >
              <TrashIcon className="h-4 w-4 text-red-500" />
            </Button>
          )}
          {isCurrentUser && (
            <Button variant="ghost" size="icon" disabled title="Vous ne pouvez pas supprimer votre propre compte">
              <Shield className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
