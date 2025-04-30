
import React from "react";

export const UserTableSkeleton: React.FC = () => {
  return (
    <div className="flex justify-center py-8">
      <div className="animate-spin h-8 w-8 border-4 border-garage-red border-t-transparent rounded-full"></div>
    </div>
  );
};
