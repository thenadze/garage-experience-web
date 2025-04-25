
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

// Configuration EmailJS mise à jour avec les bonnes valeurs
export const SERVICE_ID = 'service_lwh15op';
export const TEMPLATE_ID = 'template_hck0ocv';
export const PUBLIC_KEY = '0mST0Gd0Mt69-haxZ';

// Fonction utilitaire pour vérifier la réponse EmailJS
export const handleEmailjsResponse = (response: any) => {
  if (response.status === 200) {
    return { success: true, message: 'Email envoyé avec succès' };
  }
  
  // Analyser les erreurs spécifiques d'EmailJS
  let errorMessage = 'Échec de l\'envoi de l\'email';
  
  if (response.text && response.text.includes('service ID not found')) {
    errorMessage = 'ID de service EmailJS non trouvé. Vérifiez votre configuration.';
    console.error('Erreur EmailJS: ID de service non trouvé', { SERVICE_ID });
  } else if (response.text && response.text.includes('template ID not found')) {
    errorMessage = 'ID de template EmailJS non trouvé. Vérifiez votre configuration.';
    console.error('Erreur EmailJS: ID de template non trouvé', { TEMPLATE_ID });
  }
  
  return { success: false, message: errorMessage };
};
