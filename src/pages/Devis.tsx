import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import emailjs from '@emailjs/browser';
import { toast } from "sonner";

// Schema de validation pour le formulaire de devis
const devisFormSchema = z.object({
  nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Adresse email invalide." }),
  telephone: z.string().min(10, { message: "Numéro de téléphone invalide." }),
  marque: z.string().min(2, { message: "La marque du véhicule est requise." }),
  modele: z.string().min(2, { message: "Le modèle du véhicule est requis." }),
  annee: z.string().min(4, { message: "L'année du véhicule est requise." }),
  kilometrage: z.string().min(1, { message: "Le kilométrage est requis." }),
  description: z.string().min(10, { message: "Veuillez décrire les services souhaités (minimum 10 caractères)." }),
});

type DevisFormData = z.infer<typeof devisFormSchema>;

// Configuration EmailJS - REMPLACEZ PAR VOS PROPRES IDENTIFIANTS
const SERVICE_ID = 'votre_service_id'; 
const TEMPLATE_ID = 'votre_template_id'; 
const PUBLIC_KEY = 'votre_public_key';

const Devis = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<DevisFormData>({
    resolver: zodResolver(devisFormSchema),
  });

  const onSubmit = (data: DevisFormData) => {
    if (!formRef.current) return;
    setIsSubmitting(true);

    const templateParams = {
      nom_client: data.nom,
      email_client: data.email,
      telephone: data.telephone,
      marque_vehicule: data.marque,
      modele_vehicule: data.modele,
      annee_vehicule: data.annee,
      kilometrage: data.kilometrage,
      description_services: data.description,
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then((response) => {
        console.log('Devis envoyé avec succès !', response.status, response.text);
        toast.success("Votre demande de devis a été envoyée avec succès ! Nous vous contacterons bientôt.");
        reset();
      }, (err) => {
        console.error('Échec de l\'envoi du devis', err);
        toast.error("Échec de l'envoi du devis. Veuillez réessayer ou nous contacter directement.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen py-16 bg-garage-light-gray">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Demande de Devis
          </h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Informations personnelles */}
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

              {/* Informations du véhicule */}
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

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description des services souhaités
                </label>
                <Textarea
                  id="description"
                  placeholder="Décrivez les services dont vous avez besoin (réparation, entretien, etc.)"
                  className={errors.description ? 'border-red-500' : ''}
                  rows={5}
                  {...register("description")}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-garage-red hover:bg-garage-red/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Demander un devis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Devis;
