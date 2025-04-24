
import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { DevisFormData } from "@/schemas/devisSchema";

interface VehicleInfoFieldsProps {
  register: UseFormRegister<DevisFormData>;
  errors: FieldErrors<DevisFormData>;
}

export const VehicleInfoFields = ({ register, errors }: VehicleInfoFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="marque" className="block text-sm font-medium text-gray-700">
            Marque du véhicule
          </label>
          <Input
            id="marque"
            type="text"
            placeholder="Ex: Renault"
            className={errors.marque ? 'border-red-500' : ''}
            {...register("marque")}
          />
          {errors.marque && <p className="text-red-500 text-sm">{errors.marque.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="modele" className="block text-sm font-medium text-gray-700">
            Modèle
          </label>
          <Input
            id="modele"
            type="text"
            placeholder="Ex: Clio"
            className={errors.modele ? 'border-red-500' : ''}
            {...register("modele")}
          />
          {errors.modele && <p className="text-red-500 text-sm">{errors.modele.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="annee" className="block text-sm font-medium text-gray-700">
            Année
          </label>
          <Input
            id="annee"
            type="text"
            placeholder="Ex: 2020"
            className={errors.annee ? 'border-red-500' : ''}
            {...register("annee")}
          />
          {errors.annee && <p className="text-red-500 text-sm">{errors.annee.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="kilometrage" className="block text-sm font-medium text-gray-700">
            Kilométrage
          </label>
          <Input
            id="kilometrage"
            type="text"
            placeholder="Ex: 50000"
            className={errors.kilometrage ? 'border-red-500' : ''}
            {...register("kilometrage")}
          />
          {errors.kilometrage && <p className="text-red-500 text-sm">{errors.kilometrage.message}</p>}
        </div>
      </div>
    </>
  );
};
