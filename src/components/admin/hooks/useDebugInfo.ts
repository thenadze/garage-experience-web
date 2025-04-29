
import { useState } from "react";

export function useDebugInfo() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  const toggleDebugInfo = () => {
    setShowDebugInfo(!showDebugInfo);
  };

  const updateDebugInfo = (info: any) => {
    // Process authentication errors to provide more helpful messages
    if (info && info.__isAuthError && info.code === "invalid_credentials") {
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
    } else {
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
