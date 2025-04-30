
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { setupSupabaseResources } from "@/integrations/supabase/setup";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { usePermissions } from "@/hooks/usePermissions";

export const useAdmin = () => {
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

  return {
    activeTab,
    setActiveTab,
    selectedVehicle,
    showInviteDialog,
    setShowInviteDialog,
    isAdmin,
    authLoading,
    permissionsLoading,
    userRole,
    hasPermission,
    handleLogout,
    handleEditVehicle,
    handleAddVehicle,
    handleFormSuccess,
    handleViewWebsite,
    handleOpenInviteDialog
  };
};
