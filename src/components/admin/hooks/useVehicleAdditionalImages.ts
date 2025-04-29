
import { supabase } from "@/integrations/supabase/client";

export function useVehicleAdditionalImages() {
  const tryAddAdditionalImages = async (vehicleId: string, imageUrls: string[]) => {
    if (!imageUrls || imageUrls.length <= 1) return;
    
    try {
      const now = new Date().toISOString();
      // Insérer uniquement les images supplémentaires (à partir de l'index 1)
      const additionalImages = imageUrls.slice(1).map(url => ({
        vehicle_id: vehicleId, // This will be stored as is, either as a string or converted by Supabase
        image_url: url,
        created_at: now,
      }));
      
      if (additionalImages.length === 0) return;
      
      // Capture l'erreur silencieusement si la table n'existe pas encore
      try {
        // Using type assertion to bypass TypeScript validation
        const { error } = await supabase
          .from('vehicle_images' as any)
          .insert(additionalImages as any);
          
        if (error) {
          console.error("Erreur lors de l'ajout des images supplémentaires:", error);
        }
      } catch (insertError) {
        console.error("Erreur lors de l'insertion des images supplémentaires:", insertError);
        // Table might not exist yet - this is expected in some cases
      }
    } catch (error) {
      console.error("Erreur lors de la préparation des images supplémentaires:", error);
    }
  };

  return {
    tryAddAdditionalImages
  };
}
