
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useUserInvite } from "@/hooks/useUserInvite";
import { UserRoleSelect } from "./users/UserRoleSelect";
import { CustomPermissionsForm } from "./users/CustomPermissionsForm";

interface UserInviteDialogProps {
  open: boolean;
  onClose: () => void;
}

const UserInviteDialog: React.FC<UserInviteDialogProps> = ({ open, onClose }) => {
  const {
    email,
    setEmail,
    role,
    loading,
    customPermissions,
    permissions,
    handleRoleChange,
    handleCustomPermissionsToggle,
    handlePermissionChange,
    handleInviteUser
  } = useUserInvite();

  const onSubmit = async () => {
    const success = await handleInviteUser();
    if (success) {
      onClose();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Inviter un nouvel utilisateur</DialogTitle>
          <DialogDescription>
            Envoyez une invitation à un collaborateur avec des droits spécifiques.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="collaborateur@example.com"
              className="col-span-3"
            />
          </div>
          
          <UserRoleSelect 
            role={role}
            onRoleChange={handleRoleChange}
          />
          
          <div className="grid grid-cols-4 items-center gap-4">
            <div></div>
            <div className="col-span-3 flex items-center space-x-2">
              <Checkbox 
                id="custom-permissions" 
                checked={customPermissions}
                onCheckedChange={handleCustomPermissionsToggle}
              />
              <Label htmlFor="custom-permissions">
                Définir des permissions personnalisées
              </Label>
            </div>
          </div>
          
          {customPermissions && (
            <CustomPermissionsForm
              permissions={permissions}
              onPermissionChange={handlePermissionChange}
            />
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={loading}
            className="bg-garage-red hover:bg-garage-red/90"
          >
            {loading ? "Envoi en cours..." : "Inviter l'utilisateur"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserInviteDialog;
