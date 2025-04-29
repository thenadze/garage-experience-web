
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { VehicleFormValues } from "../schemas/vehicleFormSchema";
import { getRLSInstructions } from "@/integrations/supabase/setup";
import { isVehicleImageArray } from "@/integrations/supabase/tempTypes";

type Vehicle = Tables<"vehicles">;

interface UseVehicleFormProps {
  vehicle?: Vehicle;
  onSuccess: () => void;
}

export function useVehicleForm({ vehicle, onSuccess }: UseVehicleFormProps) {
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { toast } = useToast();

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
      const { error } = await supabase
        .from('vehicle_images')
        .insert(additionalImages);
        
      if (error) {
        console.error("Erreur lors de l'ajout des images supplémentaires:", error);
      }
    } catch (error) {
      console.error("Erreur lors de l'insertion des images supplémentaires:", error);
    }
  };

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
    imageFiles,
    setImageFiles,
    onSubmit
  };
}
