
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLogin from "@/components/admin/AdminLogin";
import VehiclesList from "@/components/admin/VehiclesList";
import VehicleForm from "@/components/admin/VehicleForm";
import { Car, Eye, LogOut, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { setupSupabaseResources } from "@/integrations/supabase/setup";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<string>("list");
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [setupComplete, setSetupComplete] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading, logout } = useAdminAuth();

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
    setSelectedVehicle(vehicle);
    setActiveTab("edit");
  };

  const handleAddVehicle = () => {
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

  if (authLoading) {
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
        </div>
        <div className="flex gap-3">
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
              <TabsTrigger value="add">Ajouter un véhicule</TabsTrigger>
              {selectedVehicle && (
                <TabsTrigger value="edit">Modifier un véhicule</TabsTrigger>
              )}
            </TabsList>
            <Button onClick={handleAddVehicle} className="bg-garage-red hover:bg-garage-red/90">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle annonce
            </Button>
          </div>
          
          <TabsContent value="list" className="bg-white rounded-lg shadow p-6">
            <VehiclesList onEdit={handleEditVehicle} />
          </TabsContent>
          
          <TabsContent value="add" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Ajouter un nouveau véhicule</h2>
            <VehicleForm onSuccess={handleFormSuccess} />
          </TabsContent>
          
          <TabsContent value="edit" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Modifier un véhicule</h2>
            {selectedVehicle && (
              <VehicleForm vehicle={selectedVehicle} onSuccess={handleFormSuccess} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
