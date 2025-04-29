
import { useState } from "react";

export function useDebugInfo() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  const toggleDebugInfo = () => {
    setShowDebugInfo(!showDebugInfo);
  };

  const updateDebugInfo = (info: any) => {
    // Process authentication errors to provide more helpful messages
    if (info && info.isAuthError && info.code === "invalid_credentials") {
      const enhancedInfo = {
        ...info,
        possibleCauses: [
          "RLS (Row-Level Security) policies are blocking authentication",
          "Email or password may be incorrect",
          "User may not exist in the auth.users table"
        ],
        suggestedActions: [
          "Check your RLS policies in Supabase and temporarily disable them for testing",
          "Verify the email and password are correct",
          "Ensure the user exists in the Supabase Authentication dashboard"
        ]
      };
      setDebugInfo(enhancedInfo);
    } 
    // Gérer spécifiquement l'erreur de création de profil RLS
    else if (info && info.isRLSError && info.code === "rls_profile_creation") {
      const enhancedInfo = {
        ...info,
        possibleCauses: [
          "RLS policies on 'profiles' table are blocking INSERT operations",
          "The policy you configured isn't working correctly",
          "The authenticated user doesn't have permission to create their profile"
        ],
        suggestedActions: [
          "Modifier votre politique RLS pour 'profiles' avec: using(auth.uid() = id) with check(auth.uid() = id)",
          "Vérifier que la politique est activée et correctement configurée",
          "Vérifier dans l'onglet 'SQL Editor' de Supabase si la table 'profiles' contient déjà une entrée pour cet utilisateur"
        ]
      };
      setDebugInfo(enhancedInfo);
    }
    else {
      setDebugInfo(info);
    }
  };

  const clearDebugInfo = () => {
    setDebugInfo(null);
  };

  return {
    debugInfo,
    showDebugInfo,
    toggleDebugInfo,
    updateDebugInfo,
    clearDebugInfo
  };
}
