
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLogin from "@/components/admin/AdminLogin";
import VehiclesList from "@/components/admin/VehiclesList";
import VehicleForm from "@/components/admin/VehicleForm";
import { Car, Eye, LogOut, Plus, Users, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { setupSupabaseResources } from "@/integrations/supabase/setup";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { usePermissions } from "@/hooks/usePermissions";
import PermissionGuard from "@/components/admin/PermissionGuard";
import UserRoleBadge from "@/components/admin/UserRoleBadge";
import UserInviteDialog from "@/components/admin/UserInviteDialog";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<string>("list");
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [setupComplete, setSetupComplete] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading, logout, user } = useAdminAuth();
  const { userRole, loading: permissionsLoading, hasPermission } = usePermissions();

  // Setup Supabase resources when admin is authenticated
  useEffect(() => {
    if (isAdmin && !setupComplete) {
      const initializeResources = async () => {
        const result = await setupSupabaseResources();
        if (result.success) {
          setSetupComplete(true);
        } else {
          toast({
            variant: "destructive",
            title: "Erreur de configuration",
            description: "Des problèmes de configuration empêchent l'ajout de véhicules. Vérifiez les permissions RLS dans Supabase."
          });
        }
      };
      
      initializeResources();
    }
  }, [isAdmin, toast, setupComplete]);

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté de l'interface d'administration.",
    });
  };

  const handleEditVehicle = (vehicle: any) => {
    if (!hasPermission("edit")) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires pour modifier les véhicules.",
      });
      return;
    }
    setSelectedVehicle(vehicle);
    setActiveTab("edit");
  };

  const handleAddVehicle = () => {
    if (!hasPermission("add")) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires pour ajouter des véhicules.",
      });
      return;
    }
    setSelectedVehicle(null); // Reset selected vehicle for a new one
    setActiveTab("add");
  };

  const handleFormSuccess = () => {
    toast({
      title: "Opération réussie",
      description: selectedVehicle 
        ? "Le véhicule a été mis à jour avec succès." 
        : "Le véhicule a été ajouté avec succès.",
    });
    setActiveTab("list");
    setSelectedVehicle(null);
  };

  const handleViewWebsite = () => {
    navigate("/");
  };

  const handleOpenInviteDialog = () => {
    if (!hasPermission("users")) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires pour inviter des utilisateurs.",
      });
      return;
    }
    setShowInviteDialog(true);
  };

  if (authLoading || permissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-garage-red border-t-transparent rounded-full"></div>
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminLogin onSuccess={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
          {hasPermission("users") && (
            <Button
              variant="outline"
              className="border-white text-white hover:text-garage-black"
              onClick={handleOpenInviteDialog}
            >
              <Users className="mr-2 h-4 w-4" />
              Inviter un utilisateur
            </Button>
          )}
          <Button
            variant="outline"
            className="border-white text-white hover:text-garage-black"
            onClick={handleViewWebsite}
          >
            <Eye className="mr-2 h-4 w-4" />
            Voir le site
          </Button>
          <Button
            variant="outline"
            className="border-white text-white hover:text-garage-black"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>
      
      <div className="container mx-auto py-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="list">Liste des véhicules</TabsTrigger>
              {hasPermission("add") && (
                <TabsTrigger value="add">Ajouter un véhicule</TabsTrigger>
              )}
              {selectedVehicle && hasPermission("edit") && (
                <TabsTrigger value="edit">Modifier un véhicule</TabsTrigger>
              )}
              {hasPermission("settings") && (
                <TabsTrigger value="settings">Paramètres</TabsTrigger>
              )}
              {hasPermission("users") && (
                <TabsTrigger value="users">Utilisateurs</TabsTrigger>
              )}
            </TabsList>
            {hasPermission("add") && (
              <Button onClick={handleAddVehicle} className="bg-garage-red hover:bg-garage-red/90">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle annonce
              </Button>
            )}
          </div>
          
          <TabsContent value="list" className="bg-white rounded-lg shadow p-6">
            <PermissionGuard requiredPermission="list">
              <VehiclesList onEdit={handleEditVehicle} />
            </PermissionGuard>
          </TabsContent>
          
          <TabsContent value="add" className="bg-white rounded-lg shadow p-6">
            <PermissionGuard requiredPermission="add">
              <h2 className="text-2xl font-bold mb-6">Ajouter un nouveau véhicule</h2>
              <VehicleForm onSuccess={handleFormSuccess} />
            </PermissionGuard>
          </TabsContent>
          
          <TabsContent value="edit" className="bg-white rounded-lg shadow p-6">
            <PermissionGuard requiredPermission="edit">
              <h2 className="text-2xl font-bold mb-6">Modifier un véhicule</h2>
              {selectedVehicle && (
                <VehicleForm vehicle={selectedVehicle} onSuccess={handleFormSuccess} />
              )}
            </PermissionGuard>
          </TabsContent>
          
          <TabsContent value="settings" className="bg-white rounded-lg shadow p-6">
            <PermissionGuard requiredPermission="settings">
              <h2 className="text-2xl font-bold mb-6">Paramètres</h2>
              <p className="text-gray-500">
                Cette section vous permet de configurer les paramètres de l'application.
              </p>
              {/* Contenu des paramètres à implémenter ultérieurement */}
            </PermissionGuard>
          </TabsContent>
          
          <TabsContent value="users" className="bg-white rounded-lg shadow p-6">
            <PermissionGuard requiredPermission="users">
              <h2 className="text-2xl font-bold mb-6">Gestion des utilisateurs</h2>
              <div className="flex justify-end mb-4">
                <Button onClick={handleOpenInviteDialog} className="bg-garage-red hover:bg-garage-red/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Inviter un utilisateur
                </Button>
              </div>
              <UserManagementTable />
            </PermissionGuard>
          </TabsContent>
        </Tabs>
      </div>
      
      {showInviteDialog && (
        <UserInviteDialog 
          open={showInviteDialog} 
          onClose={() => setShowInviteDialog(false)}
        />
      )}
    </div>
  );
};

export default Admin;
