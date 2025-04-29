
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { VehicleFormValues } from "../schemas/vehicleFormSchema";
import { getRLSInstructions } from "@/integrations/supabase/setup";
import { useVehicleAdditionalImages } from "./useVehicleAdditionalImages";

type Vehicle = Tables<"vehicles">;

interface UseVehicleSubmitProps {
  vehicle?: Vehicle;
  onSuccess: () => void;
  uploadImages: () => Promise<string[]>;
}

export function useVehicleSubmit({ 
  vehicle, 
  onSuccess, 
  uploadImages 
}: UseVehicleSubmitProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { tryAddAdditionalImages } = useVehicleAdditionalImages();

  const onSubmit = async (formData: VehicleFormValues) => {
    setLoading(true);
    
    try {
      // Vérifier d'abord si l'utilisateur est authentifié
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Vous devez être connecté pour effectuer cette action");
      }
      
      // Upload des images et récupération des URLs
      const imageUrls = await uploadImages();
      const primaryImageUrl = imageUrls.length > 0 ? imageUrls[0] : null;
      const now = new Date().toISOString();

      if (vehicle) {
        // Mettre à jour le véhicule existant
        const { error } = await supabase
          .from("vehicles")
          .update({
            brand: formData.brand,
            model: formData.model,
            year: formData.year,
            price: formData.price,
            mileage: formData.mileage,
            fuel_type: formData.fuel_type,
            description: formData.description,
            is_sold: formData.is_sold,
            image_url: primaryImageUrl,
            updated_at: now,
          })
          .eq("id", vehicle.id);

        if (error) {
          console.error("Erreur de mise à jour:", error);
          if (error.message.includes('policy') || error.code === 'PGRST301') {
            const rlsInfo = getRLSInstructions();
            toast({
              variant: "destructive",
              title: rlsInfo.title,
              description: "Vous n'avez pas l'autorisation de modifier les véhicules. Vérifiez les paramètres RLS dans votre console Supabase."
            });
          }
          throw error;
        }

        // Ajouter les images supplémentaires
        await tryAddAdditionalImages(vehicle.id, imageUrls);
        
      } else {
        // Ajouter un nouveau véhicule
        const { error, data: newVehicle } = await supabase
          .from("vehicles")
          .insert({
            brand: formData.brand,
            model: formData.model,
            year: formData.year,
            price: formData.price,
            mileage: formData.mileage,
            fuel_type: formData.fuel_type,
            description: formData.description,
            is_sold: formData.is_sold,
            image_url: primaryImageUrl,
            created_at: now,
            updated_at: now,
          })
          .select();

        if (error) {
          console.error("Erreur d'ajout:", error);
          if (error.message.includes('policy') || error.code === 'PGRST301') {
            const rlsInfo = getRLSInstructions();
            toast({
              variant: "destructive",
              title: rlsInfo.title,
              description: "Vous n'avez pas l'autorisation d'ajouter des véhicules. Vérifiez les paramètres RLS dans votre console Supabase."
            });
          }
          throw error;
        }

        // Ajouter les images supplémentaires si le véhicule a été créé
        if (newVehicle && newVehicle.length > 0) {
          await tryAddAdditionalImages(newVehicle[0].id, imageUrls);
        }
      }

      toast({
        title: vehicle ? "Véhicule mis à jour" : "Véhicule ajouté",
        description: vehicle
          ? "Le véhicule a été mis à jour avec succès."
          : "Le véhicule a été ajouté avec succès.",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error saving vehicle:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du véhicule.",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    onSubmit
  };
}
