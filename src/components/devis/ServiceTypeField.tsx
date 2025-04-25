
import { UseFormRegister } from "react-hook-form";
import { DevisFormData } from "@/schemas/devisSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ServiceTypeFieldProps {
  defaultValue: DevisFormData["typeService"];
  onValueChange: (value: DevisFormData["typeService"]) => void;
}

export const ServiceTypeField = ({ defaultValue, onValueChange }: ServiceTypeFieldProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="typeService" className="block text-sm font-medium text-gray-700">
        Type de service
      </label>
      <Select 
        onValueChange={onValueChange}
        defaultValue={defaultValue}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez un type de service" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="reparation">Réparation</SelectItem>
          <SelectItem value="entretien">Entretien</SelectItem>
          <SelectItem value="tuning">Tuning</SelectItem>
          <SelectItem value="vente">Achat/Vente véhicule</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

