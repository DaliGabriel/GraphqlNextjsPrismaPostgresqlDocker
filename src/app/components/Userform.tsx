"use client";
import React, { useState } from "react";

interface UserFormProps {
  initialName?: string;
  initialEmail?: string;
  onSubmit: (user: { name: string; email: string }) => void;
  submitButtonText: string;
  isLoading: boolean;
  error?: Error;
}

const Userform: React.FC<UserFormProps> = ({
  initialName = "",
  initialEmail = "",
  onSubmit,
  submitButtonText,
  isLoading,
  error,
}) => {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ name, email });
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border p-2"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border p-2"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-500 text-white p-2"
      >
        {isLoading
          ? submitButtonText.replace("User", "") + "..."
          : submitButtonText}
      </button>
      {error && <p className="text-red-500">Error: {error.message}</p>}
    </form>
  );
};

export default Userform;
