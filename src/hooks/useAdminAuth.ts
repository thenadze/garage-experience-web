
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/components/ui/use-toast';
import { useAdminSession } from './admin/useAdminSession';
import { useAdminProfile } from './admin/useAdminProfile';

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { 
    user, 
    sessionLoading, 
    logout: sessionLogout, 
    checkSession,
    debugInfo: sessionDebugInfo 
  } = useAdminSession();
  const { 
    fetchOrCreateProfile,
    debugInfo: profileDebugInfo
  } = useAdminProfile();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setLoading(true);
        const { session, user } = await checkSession();
        
        if (!session || !user) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        // Check if user has admin profile
        const profileResult = await fetchOrCreateProfile(user.id);
        
        if (profileResult.success && profileResult.isAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du statut admin:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    // Initial check
    checkAdminStatus();
  }, []);

  const logout = async () => {
    const result = await sessionLogout();
    if (result) {
      setIsAdmin(false);
    }
    return result;
  };
  
  // Expose debug info to help troubleshoot issues
  const getDebugInfo = () => {
    return {
      isAdmin,
      user,
      sessionDebugInfo,
      profileDebugInfo
    };
  };

  return { 
    isAdmin, 
    loading: loading || sessionLoading, 
    logout, 
    user, 
    getDebugInfo 
  };
}
