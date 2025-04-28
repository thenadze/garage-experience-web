
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Vehicle = Tables<"vehicles">;

export const useVehiclesData = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setVehicles(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les véhicules",
      });
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== id));
      toast({
        title: "Véhicule supprimé",
        description: "Le véhicule a été supprimé avec succès.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le véhicule",
      });
      console.error("Error deleting vehicle:", error);
    }
  };

  const toggleVehicleStatus = async (vehicle: Vehicle) => {
    try {
      const { error } = await supabase
        .from("vehicles")
        .update({ is_sold: !vehicle.is_sold })
        .eq("id", vehicle.id);

      if (error) {
        throw error;
      }

      setVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicle.id ? { ...v, is_sold: !v.is_sold } : v
        )
      );

      toast({
        title: "Statut mis à jour",
        description: `Le véhicule est maintenant marqué comme ${
          !vehicle.is_sold ? "vendu" : "disponible"
        }.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du véhicule",
      });
      console.error("Error updating vehicle status:", error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return {
    vehicles,
    loading,
    handleDeleteVehicle,
    toggleVehicleStatus,
  };
};
