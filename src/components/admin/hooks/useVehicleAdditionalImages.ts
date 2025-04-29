
import { supabase } from "@/integrations/supabase/client";

export function useVehicleAdditionalImages() {
  const tryAddAdditionalImages = async (vehicleId: string, imageUrls: string[]) => {
    if (imageUrls.length <= 1) return;
    
    try {
      const now = new Date().toISOString();
      // Insérer uniquement les images supplémentaires (à partir de l'index 1)
      const additionalImages = imageUrls.slice(1).map(url => ({
        vehicle_id: vehicleId,
        image_url: url,
        created_at: now,
      }));
      
      // Capture l'erreur silencieusement si la table n'existe pas encore
      try {
        // Use as any to bypass TypeScript validation since the vehicle_images table
        // might not be in the generated types yet
        const { error } = await supabase
          .from('vehicle_images' as any)
          .insert(additionalImages as any);
          
        if (error) {
          console.error("Erreur lors de l'ajout des images supplémentaires:", error);
        }
      } catch (insertError) {
        console.error("Erreur lors de l'insertion des images supplémentaires:", insertError);
      }
    } catch (error) {
      console.error("Erreur lors de la préparation des images supplémentaires:", error);
    }
  };

  return {
    tryAddAdditionalImages
  };
}
