
import React from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import UserInviteDialog from "@/components/admin/UserInviteDialog";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminContent from "@/components/admin/AdminContent";
import AdminLoading from "@/components/admin/AdminLoading";
import { useAdmin } from "@/hooks/useAdmin";

const Admin = () => {
  const {
    activeTab,
    setActiveTab,
    selectedVehicle,
    showInviteDialog,
    setShowInviteDialog,
    isAdmin,
    authLoading,
    permissionsLoading,
    userRole,
    hasPermission,
    handleLogout,
    handleEditVehicle,
    handleAddVehicle,
    handleFormSuccess,
    handleViewWebsite,
    handleOpenInviteDialog
  } = useAdmin();

  if (authLoading || permissionsLoading) {
    return <AdminLoading />;
  }

  if (!isAdmin) {
    return <AdminLogin onSuccess={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        userRole={userRole}
        hasUsersPermission={hasPermission("users")}
        onOpenInviteDialog={handleOpenInviteDialog}
        onViewWebsite={handleViewWebsite}
        onLogout={handleLogout}
      />
      
      <AdminContent 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedVehicle={selectedVehicle}
        hasAddPermission={hasPermission("add")}
        hasEditPermission={hasPermission("edit")}
        hasSettingsPermission={hasPermission("settings")}
        hasUsersPermission={hasPermission("users")}
        onAddVehicle={handleAddVehicle}
        onEditVehicle={handleEditVehicle}
        onFormSuccess={handleFormSuccess}
        onOpenInviteDialog={handleOpenInviteDialog}
      />
      
      {showInviteDialog && (
        <UserInviteDialog 
          open={showInviteDialog} 
          onClose={() => setShowInviteDialog(false)}
        />
      )}
    </div>
  );
};

export default Admin;
