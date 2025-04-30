
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserRole, TabPermissions, usePermissions } from "@/hooks/usePermissions";

export const useUserInvite = () => {
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
        
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Erreur lors de l'invitation:", err);
      toast({
        variant: "destructive",
        title: "Erreur d'invitation",
        description: err.message || "Impossible d'inviter cet utilisateur.",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};
