
import React from "react";
import { useUserManagement } from "@/hooks/useUserManagement";
import { UserTable } from "./users/UserTable";

const UserManagementTable = () => {
  const { users, loading, currentUserId, handleDeleteUser } = useUserManagement();

  return (
    <div>
      <UserTable 
        users={users}
        loading={loading}
        currentUserId={currentUserId}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

export default UserManagementTable;
