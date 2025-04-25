
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { useRef, useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import emailjs from '@emailjs/browser';
import { toast } from "sonner";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PersonalInfoFields } from "@/components/devis/PersonalInfoFields";
import { VehicleInfoFields } from "@/components/devis/VehicleInfoFields";
import { devisFormSchema, serviceTypes, type DevisFormData } from "@/schemas/devisSchema";
import { getServicePlaceholder, SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY } from "@/utils/devisUtils";

const Devis = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const getInitialServiceType = (): DevisFormData["typeService"] => {
    const type = searchParams.get("type");
    if (type && (type === "reparation" || type === "entretien" || type === "tuning" || type === "vente")) {
      return type;
    }
    return "vente"; // Default value
  };

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<DevisFormData>({
    resolver: zodResolver(devisFormSchema),
    defaultValues: {
      typeService: getInitialServiceType()
    }
  });

  useEffect(() => {
    const type = searchParams.get("type");
    if (type && (type === "reparation" || type === "entretien" || type === "tuning" || type === "vente")) {
      setValue("typeService", type);
    }
  }, [searchParams, setValue]);

  const selectedService = watch("typeService");

  const onSubmit = async (data: DevisFormData) => {
    if (!formRef.current) return;
    setIsSubmitting(true);

    try {
      // 1. Save quote to Supabase with modified structure to match existing table schema
      const { error: quoteError } = await supabase
        .from('quotes')
        .insert({
          first_name: data.nom,
          last_name: '',
          email: data.email,
          phone: data.telephone,
          // Using service_id instead of service which doesn't exist in the schema
          service_id: null, // We don't have this ID, but the field exists in the schema
          vehicle_model: data.modele,
          message: `${data.marque} ${data.modele} (${data.annee}, ${data.kilometrage} km): ${data.description}`,
          status: 'pending'
        });

      if (quoteError) {
        console.error('Supabase error:', quoteError);
        throw new Error('Erreur lors de la sauvegarde du devis');
      }

      // 2. Send email via EmailJS with the same data structure
      const templateParams = {
        nom_client: data.nom,
        email_client: data.email,
        telephone: data.telephone,
        type_service: serviceTypes[data.typeService],
        marque_vehicule: data.marque,
        modele_vehicule: data.modele,
        annee_vehicule: data.annee,
        kilometrage: data.kilometrage,
        description_services: data.description,
      };

      const emailResponse = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      
      if (!emailResponse.status || emailResponse.status !== 200) {
        throw new Error('Erreur lors de l\'envoi de l\'email');
      }

      // 3. Show success toast and redirect
      toast.success("Votre demande de devis a été envoyée avec succès ! Nous vous contacterons bientôt.");
      reset();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du devis:', error);
      toast.error("Échec de l'envoi du devis. Veuillez réessayer ou nous contacter directement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-16 bg-garage-light-gray">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Demande de Devis
          </h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="typeService" className="block text-sm font-medium text-gray-700">
                  Type de service
                </label>
                <Select 
                  onValueChange={(value) => setValue("typeService", value as DevisFormData["typeService"])} 
                  defaultValue={getInitialServiceType()}
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
                {errors.typeService && (
                  <p className="text-red-500 text-sm">{errors.typeService.message}</p>
                )}
              </div>

              <PersonalInfoFields register={register} errors={errors} />
              
              <VehicleInfoFields register={register} errors={errors} />

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
