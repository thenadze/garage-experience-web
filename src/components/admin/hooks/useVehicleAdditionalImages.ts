
import { supabase } from "@/integrations/supabase/client";
import { formatVehicleId } from "@/integrations/supabase/tempTypes";

export function useVehicleAdditionalImages() {
  const tryAddAdditionalImages = async (vehicleId: string | number, imageUrls: string[]) => {
    if (!imageUrls || imageUrls.length <= 1) return;
    
    try {
      const now = new Date().toISOString();
      // Convertir l'ID du véhicule en integer
      const formattedVehicleId = formatVehicleId(vehicleId);
      
      // Insérer uniquement les images supplémentaires (à partir de l'index 1)
      const additionalImages = imageUrls.slice(1).map(url => ({
        vehicle_id: formattedVehicleId,
        image_url: url,
        created_at: now,
      }));
      
      if (additionalImages.length === 0) return;
      
      // Essayer d'insérer dans la table vehicle_images
      try {
        const { error } = await supabase
          .from('vehicle_images')
          .insert(additionalImages);
          
        if (error) {
          console.error("Erreur lors de l'ajout des images supplémentaires:", error);
        }
      } catch (insertError) {
        console.error("Erreur lors de l'insertion des images supplémentaires:", insertError);
        // La table pourrait ne pas exister encore
      }
    } catch (error) {
      console.error("Erreur lors de la préparation des images supplémentaires:", error);
    }
  };

  return {
    tryAddAdditionalImages
  };
}
