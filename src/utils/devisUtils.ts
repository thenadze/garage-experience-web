
export const getServicePlaceholder = (service: string) => {
  switch (service) {
    case "reparation":
      return "Ex: Réparation moteur, carrosserie, etc.";
    case "entretien":
      return "Ex: Vidange, révision, pneumatiques, etc.";
    case "tuning":
      return "Ex: Kit carrosserie, jantes, échappement sport, etc.";
    case "vente":
      return "Ex: Je souhaite acheter ce véhicule, informations supplémentaires...";
    default:
      return "Décrivez votre demande...";
  }
};

// Configuration EmailJS - REMPLACEZ PAR VOS PROPRES IDENTIFIANTS
export const SERVICE_ID = 'votre_service_id'; 
export const TEMPLATE_ID = 'votre_template_id'; 
export const PUBLIC_KEY = 'votre_public_key';
