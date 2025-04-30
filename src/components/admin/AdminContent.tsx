
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VehiclesList from "@/components/admin/VehiclesList";
import VehicleForm from "@/components/admin/VehicleForm";
import { Plus } from "lucide-react";
import PermissionGuard from "@/components/admin/PermissionGuard";
import UserManagementTable from "@/components/admin/UserManagementTable";

interface AdminContentProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  selectedVehicle: any;
  hasAddPermission: boolean;
  hasEditPermission: boolean;
  hasSettingsPermission: boolean;
  hasUsersPermission: boolean;
  onAddVehicle: () => void;
  onEditVehicle: (vehicle: any) => void;
  onFormSuccess: () => void;
  onOpenInviteDialog: () => void;
}

const AdminContent: React.FC<AdminContentProps> = ({
  activeTab,
  onTabChange,
  selectedVehicle,
  hasAddPermission,
  hasEditPermission,
  hasSettingsPermission,
  hasUsersPermission,
  onAddVehicle,
  onEditVehicle,
  onFormSuccess,
  onOpenInviteDialog
}) => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="list">Liste des véhicules</TabsTrigger>
            {hasAddPermission && (
              <TabsTrigger value="add">Ajouter un véhicule</TabsTrigger>
            )}
            {selectedVehicle && hasEditPermission && (
              <TabsTrigger value="edit">Modifier un véhicule</TabsTrigger>
            )}
            {hasSettingsPermission && (
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            )}
            {hasUsersPermission && (
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            )}
          </TabsList>
          {hasAddPermission && (
            <Button onClick={onAddVehicle} className="bg-garage-red hover:bg-garage-red/90">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle annonce
            </Button>
          )}
        </div>
        
        <TabsContent value="list" className="bg-white rounded-lg shadow p-6">
          <PermissionGuard requiredPermission="list">
            <VehiclesList onEdit={onEditVehicle} />
          </PermissionGuard>
        </TabsContent>
        
        <TabsContent value="add" className="bg-white rounded-lg shadow p-6">
          <PermissionGuard requiredPermission="add">
            <h2 className="text-2xl font-bold mb-6">Ajouter un nouveau véhicule</h2>
            <VehicleForm onSuccess={onFormSuccess} />
          </PermissionGuard>
        </TabsContent>
        
        <TabsContent value="edit" className="bg-white rounded-lg shadow p-6">
          <PermissionGuard requiredPermission="edit">
            <h2 className="text-2xl font-bold mb-6">Modifier un véhicule</h2>
            {selectedVehicle && (
              <VehicleForm vehicle={selectedVehicle} onSuccess={onFormSuccess} />
            )}
          </PermissionGuard>
        </TabsContent>
        
        <TabsContent value="settings" className="bg-white rounded-lg shadow p-6">
          <PermissionGuard requiredPermission="settings">
            <h2 className="text-2xl font-bold mb-6">Paramètres</h2>
            <p className="text-gray-500">
              Cette section vous permet de configurer les paramètres de l'application.
            </p>
          </PermissionGuard>
        </TabsContent>
        
        <TabsContent value="users" className="bg-white rounded-lg shadow p-6">
          <PermissionGuard requiredPermission="users">
            <h2 className="text-2xl font-bold mb-6">Gestion des utilisateurs</h2>
            <div className="flex justify-end mb-4">
              <Button onClick={onOpenInviteDialog} className="bg-garage-red hover:bg-garage-red/90">
                <Plus className="mr-2 h-4 w-4" />
                Inviter un utilisateur
              </Button>
            </div>
            <UserManagementTable />
          </PermissionGuard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContent;
