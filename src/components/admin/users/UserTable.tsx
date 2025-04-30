
import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserTableRow } from "./UserTableRow";
import { EmptyUsersList } from "./EmptyUsersList";
import { UserTableSkeleton } from "./UserTableSkeleton";
import { ExtendedProfile } from "@/hooks/usePermissions";

interface UserProfile extends ExtendedProfile {
  email: string;
}

interface UserTableProps {
  users: UserProfile[];
  loading: boolean;
  currentUserId: string | null;
  onDeleteUser: (userId: string) => Promise<void>;
}

export const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  loading, 
  currentUserId,
  onDeleteUser 
}) => {
  if (loading) {
    return <UserTableSkeleton />;
  }

  if (users.length === 0) {
    return <EmptyUsersList />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rôle</TableHead>
          <TableHead className="w-[150px]">Permissions</TableHead>
          <TableHead className="text-right w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <UserTableRow 
            key={user.id} 
            user={user} 
            isCurrentUser={user.id === currentUserId} 
            onDelete={onDeleteUser}
          />
        ))}
      </TableBody>
    </Table>
  );
};
