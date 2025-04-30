
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TabPermissions } from "@/hooks/usePermissions";

interface CustomPermissionsFormProps {
  permissions: TabPermissions;
  onPermissionChange: (key: keyof TabPermissions, checked: boolean) => void;
}

export const CustomPermissionsForm: React.FC<CustomPermissionsFormProps> = ({
  permissions,
  onPermissionChange
}) => {
  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label className="text-right pt-2">
        Permissions
      </Label>
      <div className="col-span-3 space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="perm-list" 
            checked={permissions.list}
            onCheckedChange={(checked) => onPermissionChange("list", !!checked)}
          />
          <Label htmlFor="perm-list">Voir la liste des véhicules</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="perm-add" 
            checked={permissions.add}
            onCheckedChange={(checked) => onPermissionChange("add", !!checked)}
          />
          <Label htmlFor="perm-add">Ajouter des véhicules</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="perm-edit" 
            checked={permissions.edit}
            onCheckedChange={(checked) => onPermissionChange("edit", !!checked)}
          />
          <Label htmlFor="perm-edit">Modifier des véhicules</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="perm-delete" 
            checked={permissions.delete}
            onCheckedChange={(checked) => onPermissionChange("delete", !!checked)}
          />
          <Label htmlFor="perm-delete">Supprimer des véhicules</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="perm-settings" 
            checked={permissions.settings}
            onCheckedChange={(checked) => onPermissionChange("settings", !!checked)}
          />
          <Label htmlFor="perm-settings">Accès aux paramètres</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="perm-users" 
            checked={permissions.users}
            onCheckedChange={(checked) => onPermissionChange("users", !!checked)}
          />
          <Label htmlFor="perm-users">Gestion des utilisateurs</Label>
        </div>
      </div>
    </div>
  );
};
