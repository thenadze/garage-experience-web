
import React, { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRole, TabPermissions, usePermissions } from "@/hooks/usePermissions";
import { Checkbox } from "@/components/ui/checkbox";

interface UserInviteDialogProps {
  open: boolean;
  onClose: () => void;
}

const UserInviteDialog: React.FC<UserInviteDialogProps> = ({ 
  open, 
  onClose 
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("viewer");
  const [loading, setLoading] = useState(false);
  const [customPermissions, setCustomPermissions] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<TabPermissions>({
    list: true,
    add: false,
    edit: false,
    delete: false,
    settings: false,
    users: false
  });
  
  const { toast } = useToast();
  const { DEFAULT_PERMISSIONS } = usePermissions();
  
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (!customPermissions) {
      // Si l'utilisateur n'a pas de permissions personnalisées, on utilise celles par défaut du rôle
      setPermissions(DEFAULT_PERMISSIONS[newRole]);
    }
  };
  
  const handleCustomPermissionsToggle = (checked: boolean) => {
    setCustomPermissions(checked);
    if (checked === false) {
      // Si on désactive les permissions personnalisées, on revient aux permissions par défaut
      setPermissions(DEFAULT_PERMISSIONS[role]);
    }
  };
  
  const handlePermissionChange = (key: keyof TabPermissions, checked: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [key]: checked
    }));
  };
  
  const handleInviteUser = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email requis",
        description: "Veuillez saisir l'email de l'utilisateur à inviter.",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Générer un mot de passe temporaire aléatoire
      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).toUpperCase().slice(-4) + "!1";
      
      // Créer le compte utilisateur via Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password: tempPassword,
        options: {
          data: {
            // Stocker le rôle dans les métadonnées utilisateur
            invited_by: (await supabase.auth.getUser()).data.user?.id,
            role: role,
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Créer un profil pour l'utilisateur avec son rôle
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            first_name: "Utilisateur",
            last_name: "Invité",
            created_at: new Date().toISOString(),
            role: role,
            custom_permissions: customPermissions ? permissions : null,
            invited_by: (await supabase.auth.getUser()).data.user?.id,
          });
          
        if (profileError) {
          console.error("Erreur lors de la création du profil:", profileError);
          toast({
            variant: "destructive",
            title: "Erreur de création de profil",
            description: "L'utilisateur a été créé mais son profil n'a pas pu être configuré correctement.",
          });
        }
        
        toast({
          title: "Invitation envoyée",
          description: `Un email d'invitation a été envoyé à ${email} avec le rôle de ${role}.`,
        });
        
        onClose();
      }
    } catch (err: any) {
      console.error("Erreur lors de l'invitation:", err);
      toast({
        variant: "destructive",
        title: "Erreur d'invitation",
        description: err.message || "Impossible d'inviter cet utilisateur.",
      });
    } finally {
      setLoading(false);
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
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Rôle
            </Label>
            <Select value={role} onValueChange={(value) => handleRoleChange(value as UserRole)}>
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
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Permissions
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="perm-list" 
                    checked={permissions.list}
                    onCheckedChange={(checked) => handlePermissionChange("list", !!checked)}
                  />
                  <Label htmlFor="perm-list">Voir la liste des véhicules</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="perm-add" 
                    checked={permissions.add}
                    onCheckedChange={(checked) => handlePermissionChange("add", !!checked)}
                  />
                  <Label htmlFor="perm-add">Ajouter des véhicules</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="perm-edit" 
                    checked={permissions.edit}
                    onCheckedChange={(checked) => handlePermissionChange("edit", !!checked)}
                  />
                  <Label htmlFor="perm-edit">Modifier des véhicules</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="perm-delete" 
                    checked={permissions.delete}
                    onCheckedChange={(checked) => handlePermissionChange("delete", !!checked)}
                  />
                  <Label htmlFor="perm-delete">Supprimer des véhicules</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="perm-settings" 
                    checked={permissions.settings}
                    onCheckedChange={(checked) => handlePermissionChange("settings", !!checked)}
                  />
                  <Label htmlFor="perm-settings">Accès aux paramètres</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="perm-users" 
                    checked={permissions.users}
                    onCheckedChange={(checked) => handlePermissionChange("users", !!checked)}
                  />
                  <Label htmlFor="perm-users">Gestion des utilisateurs</Label>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleInviteUser} 
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
