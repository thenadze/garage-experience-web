
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";
import VehicleImageUpload from "./VehicleImageUpload";
import VehicleBasicFields from "./VehicleBasicFields";
import VehicleDetailsFields from "./VehicleDetailsFields";
import { useVehicleForm } from "./hooks/useVehicleForm";
import { vehicleFormSchema, VehicleFormValues } from "./schemas/vehicleFormSchema";

type Vehicle = Tables<"vehicles">;

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSuccess: () => void;
}

const VehicleForm = ({ vehicle, onSuccess }: VehicleFormProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(vehicle?.image_url || null);
  const { loading, imageFile, setImageFile, onSubmit } = useVehicleForm({ vehicle, onSuccess });

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      brand: vehicle?.brand || "",
      model: vehicle?.model || "",
      year: vehicle?.year || new Date().getFullYear(),
      price: vehicle?.price || 0,
      mileage: vehicle?.mileage || 0,
      fuel_type: vehicle?.fuel_type || "",
      description: vehicle?.description || "",
      is_sold: vehicle?.is_sold || false,
    },
  });

  const handleSubmitForm = (formData: VehicleFormValues) => {
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {/* Image upload section */}
            <VehicleImageUpload 
              initialImageUrl={imageUrl}
              onImageChange={setImageFile}
              onImageUrlChange={setImageUrl}
            />

            <VehicleBasicFields form={form} />
          </div>

          <div>
            <VehicleDetailsFields form={form} />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onSuccess()}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            className="bg-garage-red hover:bg-garage-red/90"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                Enregistrement...
              </>
            ) : (
              vehicle ? "Mettre à jour" : "Ajouter le véhicule"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VehicleForm;
