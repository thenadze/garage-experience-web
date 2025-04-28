
import { z } from "zod";

export const vehicleFormSchema = z.object({
  brand: z.string().min(1, "La marque est requise"),
  model: z.string().min(1, "Le modèle est requis"),
  year: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1),
  price: z.coerce.number().positive("Le prix doit être positif"),
  mileage: z.coerce.number().nonnegative("Le kilométrage doit être positif ou zéro"),
  fuel_type: z.string().min(1, "Le type de carburant est requis"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  is_sold: z.boolean().default(false),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;
