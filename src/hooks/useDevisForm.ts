
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import emailjs from '@emailjs/browser';
import { DevisFormData, serviceTypes } from "@/schemas/devisSchema";
import { 
  SERVICE_ID, 
  TEMPLATE_ID, 
  PUBLIC_KEY,
  handleEmailjsResponse 
} from "@/utils/devisUtils";

export const useDevisForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailjsError, setEmailjsError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (data: DevisFormData) => {
    setIsSubmitting(true);
    setEmailjsError(null);

    try {
      console.log("Préparation de la soumission du devis...");
      
      // 1. Sauvegarde dans Supabase
      const quoteData = {
        first_name: data.nom,
        last_name: '',
        email: data.email,
        phone: data.telephone,
        service_id: null, 
        vehicle_model: data.modele,
        message: `${data.marque} ${data.modele} (${data.annee}, ${data.kilometrage} km): ${data.description}`,
        status: 'pending'
      };
      
      const { error: quoteError } = await supabase
        .from('quotes')
        .insert(quoteData);

      if (quoteError) {
        throw new Error(`Erreur lors de la sauvegarde du devis: ${quoteError.message}`);
      }
      
      // 2. Envoi de l'email via EmailJS
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

      try {
        const emailResponse = await emailjs.send(
          SERVICE_ID, 
          TEMPLATE_ID, 
          templateParams, 
          PUBLIC_KEY
        );
        
        const { success, message } = handleEmailjsResponse(emailResponse);
        
        if (!success) {
          setEmailjsError(message);
          toast.error(message);
        } else {
          toast.success("Votre demande de devis a été envoyée avec succès ! Nous vous contacterons bientôt.");
          navigate('/');
          return true;
        }
      } catch (emailError: any) {
        setEmailjsError(emailError.text || "Erreur lors de l'envoi de l'email");
        toast.error("Le devis a été enregistré mais l'email n'a pas pu être envoyé.");
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du devis:', error);
      toast.error("Échec de l'envoi du devis. Veuillez réessayer ou nous contacter directement.");
    } finally {
      setIsSubmitting(false);
    }
    
    return false;
  };

  return {
    isSubmitting,
    emailjsError,
    handleSubmit
  };
};

