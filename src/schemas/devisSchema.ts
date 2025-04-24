
import * as z from "zod";

export const serviceTypes = {
  reparation: "Réparation",
  entretien: "Entretien",
  tuning: "Tuning",
  vente: "Achat/Vente véhicule"
} as const;

export const devisFormSchema = z.object({
  nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Adresse email invalide." }),
  telephone: z.string().min(10, { message: "Numéro de téléphone invalide." }),
  typeService: z.enum(["reparation", "entretien", "tuning", "vente"], {
    required_error: "Veuillez sélectionner un type de service",
  }),
  marque: z.string().min(2, { message: "La marque du véhicule est requise." }),
  modele: z.string().min(2, { message: "Le modèle du véhicule est requis." }),
  annee: z.string().min(4, { message: "L'année du véhicule est requise." }),
  kilometrage: z.string().min(1, { message: "Le kilométrage est requis." }),
  description: z.string().min(10, { message: "Veuillez décrire les services souhaités (minimum 10 caractères)." }),
});

export type DevisFormData = z.infer<typeof devisFormSchema>;
