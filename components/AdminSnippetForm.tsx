// components/AdminSnippetForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminSnippetForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    code: "",
    category: "",
    Technology: "",
  });
  const [technologies, setTechnologies] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Fetch technologies when component mounts
  useEffect(() => {
    async function fetchTechnologies() {
      try {
        const res = await fetch("/api/technologies");
        if (!res.ok) throw new Error("Failed to fetch technologies");
        const data = await res.json();
        setTechnologies(data.technologies);
      } catch (err) {
        setError("Failed to load technologies");
      }
    }

    fetchTechnologies();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/snippets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create snippet");
      setSuccess(true);
      setForm({
        title: "",
        description: "",
        code: "",
        category: "",
        Technology: "",
      });
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    }
  }

  function updateForm(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Add Snippet</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={updateForm}
          placeholder="Title"
          className="w-full p-2 border rounded"
          required
        />

        {/* Technology dropdown */}
        <select
          name="Technology" // This should match the field in the form state
          value={form.Technology}
          onChange={updateForm}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Technology</option>
          {technologies.map((tech) => (
            <option key={tech.$id} value={tech.$id}>
              {tech.name}
            </option>
          ))}
        </select>

        <input
          name="category"
          value={form.category}
          onChange={updateForm}
          placeholder="Category"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={updateForm}
          placeholder="Description"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="code"
          value={form.code}
          onChange={updateForm}
          placeholder="Code"
          className="w-full p-2 font-mono border rounded h-40"
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        {success && (
          <p className="text-green-600">Snippet created successfully!</p>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Snippet
        </button>
      </form>
    </div>
  );
}
