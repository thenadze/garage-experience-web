
import { useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { PersonalInfoFields } from "@/components/devis/PersonalInfoFields";
import { VehicleInfoFields } from "@/components/devis/VehicleInfoFields";
import { ServiceTypeField } from "@/components/devis/ServiceTypeField";
import { DescriptionField } from "@/components/devis/DescriptionField";
import { devisFormSchema, type DevisFormData } from "@/schemas/devisSchema";
import { useDevisForm } from "@/hooks/useDevisForm";

const Devis = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const getInitialServiceType = (): DevisFormData["typeService"] => {
    const type = searchParams.get("type");
    if (type && (type === "reparation" || type === "entretien" || type === "tuning" || type === "vente")) {
      return type;
    }
    return "vente";
  };

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<DevisFormData>({
    resolver: zodResolver(devisFormSchema),
    defaultValues: {
      typeService: getInitialServiceType()
    }
  });

  const { isSubmitting, emailjsError, handleSubmit: handleDevisSubmit } = useDevisForm();

  useEffect(() => {
    const type = searchParams.get("type");
    if (type && (type === "reparation" || type === "entretien" || type === "tuning" || type === "vente")) {
      setValue("typeService", type);
    }
  }, [searchParams, setValue]);

  const selectedService = watch("typeService");

  const onSubmit = async (data: DevisFormData) => {
    if (!formRef.current) return;
    const success = await handleDevisSubmit(data);
    if (success) {
      reset();
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
          
          {emailjsError && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Erreur de configuration EmailJS</AlertTitle>
              <AlertDescription>
                {emailjsError}
                <p className="mt-2">Le devis a bien été enregistré dans notre système et nous vous contacterons bientôt.</p>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <ServiceTypeField
                defaultValue={getInitialServiceType()}
                onValueChange={(value) => setValue("typeService", value)}
              />

              <PersonalInfoFields register={register} errors={errors} />
              <VehicleInfoFields register={register} errors={errors} />
              <DescriptionField 
                register={register}
                errors={errors}
                selectedService={selectedService}
              />

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

