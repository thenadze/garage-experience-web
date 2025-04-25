
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { DevisFormData } from "@/schemas/devisSchema";
import { Textarea } from "@/components/ui/textarea";
import { getServicePlaceholder } from "@/utils/devisUtils";

interface DescriptionFieldProps {
  register: UseFormRegister<DevisFormData>;
  errors: FieldErrors<DevisFormData>;
  selectedService: DevisFormData["typeService"];
}

export const DescriptionField = ({
  register,
  errors,
  selectedService,
}: DescriptionFieldProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
        Description de votre demande
      </label>
      <Textarea
        id="description"
        placeholder={getServicePlaceholder(selectedService)}
        className={errors.description ? 'border-red-500' : ''}
        rows={5}
        {...register("description")}
      />
      {errors.description && (
        <p className="text-red-500 text-sm">{errors.description.message}</p>
      )}
    </div>
  );
};

