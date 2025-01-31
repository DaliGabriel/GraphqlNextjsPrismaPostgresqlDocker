"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";

import { useState } from "react";
import Userform from "./components/Userform";
import UserList from "./components/UserList";

interface User {
  id: number;
  name: string;
  email: string;
}
interface GetUsersResult {
  users: User[];
}

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

//* GraphQL mutation to create a new user
const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;
//* GraphQL mutation to update a user
const UPDATE_USER = gql`
  mutation UpdateUser($id: Int!, $name: String, $email: String) {
    updateUser(id: $id, name: $name, email: $email) {
      id
      name
      email
    }
  }
`;
//* GraphQL mutation to delete a  user
const DELETE_USER = gql`
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id) {
      id
      name
      email
    }
  }
`;

export default function Home() {
  const router = useRouter(); // Get the router instance

  // State for the form
  const [showForm, setShowForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { loading, error, data, refetch } = useQuery<GetUsersResult>(
    GET_USERS,
    {
      // variables: {
      //   first: pageSize,
      //   country: selectedCountry,
      //   theme: selectedCategory,
      //   targetDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined,
      // }, // Initial fetch
      onError: (error) => {
        if (error.message === "Not authenticated!") {
          router.push("/login");
        }
      },
    }
  );

  //* Mutation hook createUser
  const [createUser, { loading: createUserLoading, error: createUserErrorr }] =
    useMutation(CREATE_USER);

  //* Mutation hook updateUser
  const [updateUser, { loading: updateUserLoading, error: updateUserError }] =
    useMutation(UPDATE_USER);

  //* Mutation hook deleteUser
  const [deleteUser, { loading: deleteUserLoading }] = useMutation(DELETE_USER);

  const handleCreateUser = async ({
    name,
    email,
  }: {
    name: string;
    email: string;
  }) => {
    try {
      await createUser({ variables: { name, email } });
      setShowForm(false);
      refetch(); // Refetch users after creating a new one
    } catch (error) {
      console.error("Failed to create user:", error);
      // Optionally display an error message to the user based on the error
    }
  };

  const handleUpdateUser = async ({
    name,
    email,
  }: {
    name: string;
    email: string;
  }) => {
    try {
      if (!editingUser) return; // Add a check to make sure editingUser is not null
      await updateUser({
        variables: { id: editingUser.id, name, email },
      });
      setShowUpdateForm(false);
      setEditingUser(null);
      refetch(); // Refetch users after updating
    } catch (error) {
      console.error("Failed to update user:", error);
      // Optionally display an error message to the user based on the error
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setShowUpdateForm(!showUpdateForm);
  };

  const handleDeleteClick = async (userId: number) => {
    try {
      const result = await deleteUser({ variables: { id: userId } });
      console.log("User deleted:", result.data?.deleteUser);
      refetch(); // Refetch users after deleting
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  if (loading)
    return (
      <>
        <div className="loop cubes">
          <div className="item cubes"></div>
          <div className="item cubes"></div>
          <div className="item cubes"></div>
          <div className="item cubes"></div>
          <div className="item cubes"></div>
          <div className="item cubes"></div>
        </div>
      </>
    );

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1>Main</h1>
        <button
          className="bg-blue-600 text-black rounded p-2"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Hide Form" : "Add User"}
        </button>
        {showForm && (
          <Userform
            onSubmit={handleCreateUser}
            submitButtonText="Create User"
            isLoading={createUserLoading}
            error={createUserErrorr}
          />
        )}

        {showUpdateForm && editingUser && (
          <Userform
            initialName={editingUser.name}
            initialEmail={editingUser.email}
            onSubmit={handleUpdateUser}
            submitButtonText="Update User"
            isLoading={updateUserLoading}
            error={updateUserError}
          />
        )}

        {data && (
          <UserList
            users={data.users}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            isDeleting={deleteUserLoading}
          />
        )}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
