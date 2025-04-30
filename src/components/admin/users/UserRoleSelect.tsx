
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/hooks/usePermissions";

interface UserRoleSelectProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const UserRoleSelect: React.FC<UserRoleSelectProps> = ({ role, onRoleChange }) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="role" className="text-right">
        Rôle
      </Label>
      <Select value={role} onValueChange={(value) => onRoleChange(value as UserRole)}>
        <SelectTrigger id="role" className="col-span-3">
          <SelectValue placeholder="Sélectionnez un rôle" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Administrateur (tous les droits)</SelectItem>
          <SelectItem value="editor">Éditeur (peut modifier les véhicules)</SelectItem>
          <SelectItem value="collaborator">Collaborateur (peut ajouter des véhicules)</SelectItem>
          <SelectItem value="viewer">Observateur (lecture seule)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
