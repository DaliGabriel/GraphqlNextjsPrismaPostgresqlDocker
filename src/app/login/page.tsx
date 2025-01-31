"use client";
import React, { useState } from "react";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password: password }), // Send username and password
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token); // Store the token
        // Redirect or update UI to indicate successful login
        // console.log("Login successful, token:", token);
        window.location.href = "/"; // Redirect to the home page (or any other page)
      } else {
        const data = await response.json();
        setError(data.error || "Login failed");
      }
    } catch (error: unknown) {
      setError("An error occurred during login");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center my-32">
      <form
        onSubmit={handleLogin}
        className="bg-white p-4 max-w-sm rounded-lg shadow-md"
      >
        <p className="text-lg font-semibold text-center text-gray-800">
          Sign in to your account
        </p>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}

        <div className="relative mt-2">
          <input
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white border border-gray-200 px-4 py-3 pr-12 text-sm w-full rounded-lg shadow-sm"
            required
          />
          {/* You might want to add an icon or something in this span for visual effect */}
          <span className="absolute right-3 top-1/2 -translate-y-1/2"></span>
        </div>
        <div className="relative mt-2">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white border border-gray-200 px-4 py-3 pr-12 text-sm w-full rounded-lg shadow-sm"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="block mt-5 py-3 px-5 bg-indigo-600 text-white text-sm font-medium w-full rounded-lg uppercase disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
};

export default Page;
