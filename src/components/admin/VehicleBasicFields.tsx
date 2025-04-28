
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { VehicleFormValues } from "./schemas/vehicleFormSchema";

interface VehicleBasicFieldsProps {
  form: UseFormReturn<VehicleFormValues>;
}

const VehicleBasicFields = ({ form }: VehicleBasicFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="brand"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Marque</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Peugeot" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="model"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Modèle</FormLabel>
            <FormControl>
              <Input placeholder="Ex: 308" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="fuel_type"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Carburant</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type de carburant" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Essence">Essence</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Hybride">Hybride</SelectItem>
                <SelectItem value="Électrique">Électrique</SelectItem>
                <SelectItem value="GPL">GPL</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default VehicleBasicFields;
