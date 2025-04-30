
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/hooks/usePermissions";
import UserRoleBadge from "./UserRoleBadge";
import { Button } from "@/components/ui/button";
import { TrashIcon, Edit, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  created_at: string;
  custom_permissions: any | null;
}

const UserManagementTable = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
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
          const usersWithEmail = await Promise.all(
            data.map(async (profile) => {
              // Dans une vraie application, vous utiliseriez une fonction serveur ou une vue pour récupérer les emails
              return {
                ...profile,
                email: `user-${profile.id.substring(0, 6)}@example.com`,
                role: profile.role || 'viewer' as UserRole,
                custom_permissions: profile.custom_permissions || null
              } as UserProfile;
            })
          );
          
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

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-garage-red border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead className="w-[150px]">Permissions</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {user.first_name} {user.last_name}
                {user.id === currentUserId && (
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
                  {user.id !== currentUserId && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <TrashIcon className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                  {user.id === currentUserId && (
                    <Button variant="ghost" size="icon" disabled title="Vous ne pouvez pas supprimer votre propre compte">
                      <Shield className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucun utilisateur trouvé. Invitez des collaborateurs pour commencer.
        </div>
      )}
    </div>
  );
};

export default UserManagementTable;
