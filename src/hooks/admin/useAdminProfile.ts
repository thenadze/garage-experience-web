
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/components/ui/use-toast';
import { UserRole } from '@/hooks/usePermissions';

interface AdminProfile {
  id: string;
  role?: UserRole;
  created_at?: string;
  first_name?: string;
  last_name?: string;
}

export function useAdminProfile() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const { toast } = useToast();

  const fetchOrCreateProfile = async (userId: string): Promise<{ 
    success: boolean; 
    profile?: AdminProfile | null;
    isAdmin?: boolean;
  }> => {
    try {
      // Fetch the user's profile
      const { data: adminData, error: adminError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (adminError) {
        console.error("Erreur lors de la vérification du profil:", adminError);
        setDebugInfo(prev => ({
          ...prev,
          profileError: adminError
        }));
        
        // If the profile doesn't exist, try to create one
        if (adminError.code === 'PGRST116') {
          console.log("Profil non trouvé - tentative de création");
          
          // Create a profile for this user with correct fields according to schema
          const { data: insertData, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              first_name: "Admin", // Default value
              last_name: "User",   // Default value
              created_at: new Date().toISOString(),
              role: "admin" as UserRole // By default, first user is admin
            })
            .select()
            .single();
          
          if (insertError) {
            console.error("Erreur de création du profil:", insertError);
            setDebugInfo(prev => ({
              ...prev,
              insertError: insertError
            }));
            
            toast({
              variant: "destructive",
              title: "Erreur de profil",
              description: "Impossible de créer votre profil administrateur. Vérifiez les droits RLS dans Supabase.",
            });
            
            // Check if it's an RLS error
            if (insertError.message?.includes('permission denied')) {
              toast({
                variant: "destructive",
                title: "Erreur de permissions",
                description: "Vous n'avez pas les droits suffisants pour créer un profil. Vérifiez les politiques RLS dans Supabase.",
              });
            }
            
            return { success: false };
          } else {
            console.log("Profil admin créé avec succès:", insertData);
            setDebugInfo(prev => ({
              ...prev,
              profileCreated: insertData
            }));
            return { 
              success: true,
              profile: insertData as AdminProfile,
              isAdmin: true
            };
          }
        } else {
          return { success: false };
        }
      } else {
        console.log("Profil admin trouvé:", adminData);
        setDebugInfo(prev => ({
          ...prev,
          profile: adminData
        }));
        
        // If user has a role, check if it's admin or at least has access
        const userRole = adminData?.role as UserRole | undefined;
        
        if (!userRole) {
          // If no role defined, consider as admin (for backwards compatibility)
          return { 
            success: true, 
            profile: adminData as AdminProfile,
            isAdmin: true 
          };
        } else if (userRole === 'admin') {
          return { 
            success: true, 
            profile: adminData as AdminProfile,
            isAdmin: true 
          };
        } else {
          // For other roles, allow access to admin interface
          // but permissions will be managed by PermissionGuard component
          return { 
            success: true, 
            profile: adminData as AdminProfile,
            isAdmin: true 
          };
        }
      }
    } catch (error) {
      console.error("Error checking or creating profile:", error);
      return { success: false };
    }
  };

  return {
    fetchOrCreateProfile,
    debugInfo
  };
}
