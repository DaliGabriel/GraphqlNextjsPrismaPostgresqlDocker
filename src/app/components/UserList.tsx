import React from "react";
import UserItem from "./UserItem";

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
  isDeleting: boolean;
}

const UserList: React.FC<UserListProps> = ({
  users,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  return (
    <div className="container mx-auto p-4">
      {/* Centered container with padding */}
      <table className="min-w-full border border-collapse table-auto">
        {/* Full width, collapsed borders, table auto layout */}
        <thead>
          <tr className="bg-gray-100">
            {/* Light gray header row */}
            <th className="border px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            {/* Table header cells */}
            <th className="border px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="border px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="border px-4 py-2"></th>
            {/* Empty header for buttons */}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserItem
              key={user.id}
              user={user}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
