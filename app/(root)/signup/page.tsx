"use client";

import { useState, FormEvent } from "react";
import { signUpWithEmail } from "../../lib/server/auth"; // Import Server Action
import Link from "next/link";

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    const response = await signUpWithEmail(formData);

    if (response.error) {
      setError(response.error);
    } else {
      window.location.href = "/"; // Redirect after successful signup
    }

    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Create an Account
        </h1>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="Full Name"
              type="text"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              placeholder="Enter your email"
              type="email"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              placeholder="Create a password"
              type="password"
              minLength={8}
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
