
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export function useAdminSession() {
  const [user, setUser] = useState<any>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const checkSession = async () => {
    try {
      console.log("Vérification du statut admin...");
      
      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Erreur lors de la récupération de la session:", sessionError);
        setDebugInfo({
          error: sessionError,
          type: "session"
        });
        setSessionLoading(false);
        return { session: null, user: null };
      }
      
      if (!session) {
        console.log("Aucune session trouvée");
        setSessionLoading(false);
        return { session: null, user: null };
      }
      
      console.log("Session trouvée pour:", session.user.email);
      setUser(session.user);
      setDebugInfo({
        user: {
          id: session.user.id,
          email: session.user.email,
          app_metadata: session.user.app_metadata,
          user_metadata: session.user.user_metadata,
        }
      });
      
      setSessionLoading(false);
      return { session, user: session.user };
    } catch (error) {
      console.error("Erreur lors de la vérification de session:", error);
      setDebugInfo({
        error,
        type: "general"
      });
      setSessionLoading(false);
      return { session: null, user: null };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      return true;
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      return false;
    }
  };

  useEffect(() => {
    // Setup auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async () => {
      await checkSession();
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    sessionLoading,
    logout,
    checkSession,
    debugInfo
  };
}
