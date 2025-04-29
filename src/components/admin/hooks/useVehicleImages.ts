
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Vehicle = Tables<"vehicles">;

interface UseVehicleImagesProps {
  vehicle?: Vehicle;
}

export function useVehicleImages({ vehicle }: UseVehicleImagesProps) {
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const uploadImages = async () => {
    // Si pas de fichiers à uploader, on retourne les URLs existantes
    if (imageFiles.length === 0) {
      return vehicle?.image_url ? [vehicle.image_url] : [];
    }

    try {
      const uploadedUrls: string[] = [];

      // Traiter chaque fichier
      for (const imageFile of imageFiles) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `vehicle_images/${fileName}`;

        // Upload à Supabase Storage
        const { error: uploadError, data } = await supabase.storage
          .from('vehicles')
          .upload(filePath, imageFile);

        if (uploadError) {
          console.error("Erreur d'upload:", uploadError);
          if (uploadError.message && (
              uploadError.message.includes('bucket') || 
              uploadError.message.includes('404')
            )) {
            throw new Error("Le bucket de stockage 'vehicles' n'existe pas. Veuillez consulter les instructions pour le créer.");
          }
          throw uploadError;
        }

        // Obtenir l'URL publique
        const { data: publicUrlData } = supabase.storage
          .from('vehicles')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrlData.publicUrl);
      }

      return uploadedUrls;
    } catch (error) {
      console.error("Error uploading images:", error);
      return vehicle?.image_url ? [vehicle.image_url] : [];
    }
  };

  return {
    imageFiles,
    setImageFiles,
    uploadImages
  };
}
