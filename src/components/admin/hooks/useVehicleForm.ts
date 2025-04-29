
import { Tables } from "@/integrations/supabase/types";
import { VehicleFormValues } from "../schemas/vehicleFormSchema";
import { useVehicleImages } from "./useVehicleImages";
import { useVehicleSubmit } from "./useVehicleSubmit";

type Vehicle = Tables<"vehicles">;

interface UseVehicleFormProps {
  vehicle?: Vehicle;
  onSuccess: () => void;
}

export function useVehicleForm({ vehicle, onSuccess }: UseVehicleFormProps) {
  const { imageFiles, setImageFiles, uploadImages } = useVehicleImages({ vehicle });
  const { loading, onSubmit } = useVehicleSubmit({ 
    vehicle, 
    onSuccess, 
    uploadImages 
  });

  return {
    loading,
    imageFiles,
    setImageFiles,
    onSubmit
  };
}
