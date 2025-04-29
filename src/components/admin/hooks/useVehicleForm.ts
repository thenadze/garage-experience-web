
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { VehicleFormValues } from "../schemas/vehicleFormSchema";
import { getRLSInstructions } from "@/integrations/supabase/setup";

type Vehicle = Tables<"vehicles">;

interface UseVehicleFormProps {
  vehicle?: Vehicle;
  onSuccess: () => void;
}

export function useVehicleForm({ vehicle, onSuccess }: UseVehicleFormProps) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  const uploadImage = async () => {
    if (!imageFile) return vehicle?.image_url || null;

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `vehicle_images/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('vehicles')
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Erreur d'upload:", uploadError);
        if (uploadError.message.includes('bucket') || uploadError.message.includes('404')) {
          throw new Error("Le bucket de stockage 'vehicles' n'existe pas. Veuillez consulter les instructions pour le créer.");
        }
        throw uploadError;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('vehicles')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return vehicle?.image_url || null;
    }
  };

  const onSubmit = async (formData: VehicleFormValues) => {
    setLoading(true);
    
    try {
      const finalImageUrl = await uploadImage();
      const now = new Date().toISOString();

      if (vehicle) {
        // Update existing vehicle
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
            image_url: finalImageUrl,
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
      } else {
        // Add new vehicle
        const { error } = await supabase
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
            image_url: finalImageUrl,
            created_at: now,
            updated_at: now,
          });

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
    imageFile,
    setImageFile,
    onSubmit
  };
}
