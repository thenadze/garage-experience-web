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

// Configuration EmailJS
export const SERVICE_ID = 'YOUR_SERVICE_ID'; // Remplacez par votre Service ID
export const TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Remplacez par votre Template ID
export const PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Remplacez par votre Public Key
