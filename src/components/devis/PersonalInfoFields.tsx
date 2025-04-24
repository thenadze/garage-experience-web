
import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { DevisFormData } from "@/schemas/devisSchema";

interface PersonalInfoFieldsProps {
  register: UseFormRegister<DevisFormData>;
  errors: FieldErrors<DevisFormData>;
}

export const PersonalInfoFields = ({ register, errors }: PersonalInfoFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
            Nom complet
          </label>
          <Input
            id="nom"
            type="text"
            placeholder="Votre nom"
            className={errors.nom ? 'border-red-500' : ''}
            {...register("nom")}
          />
          {errors.nom && <p className="text-red-500 text-sm">{errors.nom.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="votre@email.com"
            className={errors.email ? 'border-red-500' : ''}
            {...register("email")}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
          Téléphone
        </label>
        <Input
          id="telephone"
          type="tel"
          placeholder="Votre numéro de téléphone"
          className={errors.telephone ? 'border-red-500' : ''}
          {...register("telephone")}
        />
        {errors.telephone && <p className="text-red-500 text-sm">{errors.telephone.message}</p>}
      </div>
    </>
  );
};
