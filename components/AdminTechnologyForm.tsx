// components/AdminTechnologyForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminTechnologyForm() {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "",
    logo: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Generate slug if not provided
    const formData = { ...form };
    if (!formData.slug && formData.name) {
      formData.slug = formData.name.toLowerCase().replace(/\s+/g, "-");
    }

    try {
      const res = await fetch("/api/technologies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create technology");
      setSuccess(true);
      setForm({ name: "", slug: "", category: "", logo: "" });
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    }
  }

  function updateForm(e: { target: { name: string; value: string; }; }) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Add Technology</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={updateForm}
          placeholder="Technology Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="slug"
          value={form.slug}
          onChange={updateForm}
          placeholder="Slug (optional, will be generated from name)"
          className="w-full p-2 border rounded"
        />
        <input
          name="category"
          value={form.category}
          onChange={updateForm}
          placeholder="Category"
          className="w-full p-2 border rounded"
        />
        <input
          name="logo"
          value={form.logo}
          onChange={updateForm}
          placeholder="Logo URL"
          className="w-full p-2 border rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        {success && (
          <p className="text-green-600">Technology created successfully!</p>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Technology
        </button>
      </form>
    </div>
  );
}
