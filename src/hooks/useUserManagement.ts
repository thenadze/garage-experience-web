
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/components/ui/use-toast';
import { ExtendedProfile, UserRole } from "@/hooks/usePermissions";

interface UserProfile extends ExtendedProfile {
  email: string;
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Récupérer l'utilisateur actuel
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        setCurrentUserId(userData.user.id);
      }

      // Récupérer tous les profils utilisateurs
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        // Pour chaque profil, récupérer l'email depuis la table auth.users
        // et ajouter les champs role et custom_permissions par défaut s'ils n'existent pas
        const usersWithEmail = data.map((profile: any) => {
          // Cast the profile to our extended type
          const extendedProfile = profile as unknown as ExtendedProfile;
          
          // Dans une vraie application, vous utiliseriez une fonction serveur ou une vue pour récupérer les emails
          return {
            ...extendedProfile,
            email: `user-${profile.id.substring(0, 6)}@example.com`,
            role: extendedProfile.role || 'viewer' as UserRole,
            custom_permissions: extendedProfile.custom_permissions || null
          } as UserProfile;
        });
        
        setUsers(usersWithEmail);
      }
    } catch (error: any) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les utilisateurs: " + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [toast]);

  const handleDeleteUser = async (userId: string) => {
    try {
      // Vérifier qu'on ne supprime pas notre propre compte
      if (userId === currentUserId) {
        toast({
          variant: "destructive",
          title: "Action non autorisée",
          description: "Vous ne pouvez pas supprimer votre propre compte.",
        });
        return;
      }

      // Dans une application réelle, il faudrait utiliser une fonction edge pour supprimer l'utilisateur de auth.users
      // Pour cette démo, nous supprimons uniquement le profil
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        throw error;
      }

      setUsers(users.filter(user => user.id !== userId));
      
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès.",
      });
    } catch (error: any) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur: " + error.message,
      });
    }
  };

  return {
    users,
    loading,
    currentUserId,
    handleDeleteUser,
    refetchUsers: fetchUsers
  };
};
