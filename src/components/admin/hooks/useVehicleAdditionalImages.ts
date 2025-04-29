
import { formatVehicleId, addVehicleImages } from "@/integrations/supabase/tempTypes";

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
      
      // Utiliser la fonction utilitaire pour ajouter les images
      try {
        const { error } = await addVehicleImages(additionalImages);
          
        if (error) {
          console.error("Erreur lors de l'ajout des images supplémentaires:", error);
        }
      } catch (insertError) {
        console.error("Erreur lors de l'insertion des images supplémentaires:", insertError);
        // La table pourrait ne pas exister encore
        console.log("Vérifiez que vous avez créé la table vehicle_images et que vous avez ajouté une fonction RPC 'add_vehicle_images'");
      }
    } catch (error) {
      console.error("Erreur lors de la préparation des images supplémentaires:", error);
    }
  };

  return {
    tryAddAdditionalImages
  };
}
