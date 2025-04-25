

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

// Configuration EmailJS corrigée
export const SERVICE_ID = 'service_lwh15op'; 
export const TEMPLATE_ID = 'template_qnb7zcf'; // ID du template mis à jour
export const PUBLIC_KEY = '0mST0Gd0Mt69-haxZ';

