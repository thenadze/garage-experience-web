
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Types de rôles possibles dans le système
export type UserRole = "admin" | "editor" | "viewer" | "collaborator";

// Structure des permissions par onglet
export interface TabPermissions {
  list: boolean;  // Voir la liste des véhicules
  add: boolean;   // Ajouter des véhicules
  edit: boolean;  // Modifier des véhicules
  delete: boolean; // Supprimer des véhicules
  settings?: boolean; // Accès aux paramètres (futur)
  users?: boolean;   // Gestion des utilisateurs (futur)
}

// Configuration par défaut des permissions selon le rôle
const DEFAULT_PERMISSIONS: Record<UserRole, TabPermissions> = {
  admin: {
    list: true,
    add: true,
    edit: true,
    delete: true,
    settings: true,
    users: true
  },
  editor: {
    list: true,
    add: true,
    edit: true,
    delete: false,
    settings: false,
    users: false
  },
  collaborator: {
    list: true,
    add: true,
    edit: false,
    delete: false,
    settings: false,
    users: false
  },
  viewer: {
    list: true,
    add: false,
    edit: false,
    delete: false,
    settings: false,
    users: false
  }
};

export function usePermissions() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [permissions, setPermissions] = useState<TabPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer le rôle et les permissions de l'utilisateur
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setLoading(true);
        
        // Vérifier si l'utilisateur est connecté
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setUserRole(null);
          setPermissions(null);
          return;
        }
        
        // Récupérer le profil de l'utilisateur avec son rôle
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role, custom_permissions')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error("Erreur lors de la récupération du profil:", profileError);
          setError("Impossible de récupérer vos permissions");
          return;
        }
        
        // Récupérer le rôle (par défaut 'viewer' si non défini)
        const role = (profileData?.role as UserRole) || "viewer";
        setUserRole(role);
        
        // Utiliser les permissions personnalisées ou les permissions par défaut selon le rôle
        const userPermissions = profileData?.custom_permissions || DEFAULT_PERMISSIONS[role];
        setPermissions(userPermissions);
        
      } catch (err) {
        console.error("Erreur lors de la vérification des permissions:", err);
        setError("Erreur lors de la vérification des permissions");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
    
    // S'abonner aux changements d'état d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(async () => {
      await fetchUserRole();
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Vérifier si l'utilisateur a la permission pour un onglet spécifique
  const hasPermission = (tab: keyof TabPermissions): boolean => {
    if (!permissions) return false;
    return permissions[tab] || false;
  };

  // Vérifier si l'utilisateur est admin
  const isAdmin = (): boolean => {
    return userRole === "admin";
  };

  // Vérifier si l'utilisateur a un rôle spécifique ou supérieur
  const hasRole = (minimumRole: UserRole): boolean => {
    if (!userRole) return false;
    
    const roleHierarchy: Record<UserRole, number> = {
      admin: 4,
      editor: 3,
      collaborator: 2,
      viewer: 1
    };
    
    return roleHierarchy[userRole] >= roleHierarchy[minimumRole];
  };

  return {
    userRole,
    permissions,
    loading,
    error,
    hasPermission,
    isAdmin,
    hasRole,
    DEFAULT_PERMISSIONS
  };
}
