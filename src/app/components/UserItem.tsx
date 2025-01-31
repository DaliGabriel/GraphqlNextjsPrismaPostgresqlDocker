"use client";
import React from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserItemProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
  isDeleting: boolean;
}

const UserItem: React.FC<UserItemProps> = ({
  user,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  return (
    <tr key={user.id} className="border-b hover:bg-gray-50">
      {/* Border bottom on rows, hover highlight */}
      <td className="border px-4 py-2">{user.id}</td> {/* Table data cells */}
      <td className="border px-4 py-2">{user.name}</td>
      <td className="border px-4 py-2">{user.email}</td>
      <td className="border px-4 py-2 text-center">
        {/* Centered buttons */}
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2" /* Improved button styling */
          onClick={() => onEdit(user)}
        >
          Edit
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" /* Improved button styling */
          onClick={() => onDelete(user.id)}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete User"}
        </button>
      </td>
    </tr>
  );
};

export default UserItem;
