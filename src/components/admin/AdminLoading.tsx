
import React from "react";

const AdminLoading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-garage-red border-t-transparent rounded-full"></div>
      <span className="ml-2">Chargement...</span>
    </div>
  );
};

export default AdminLoading;
