// app/(dashboard)/admin/create/snippet/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CreateSnippetPage() {
  const searchParams = useSearchParams();
  const techId = searchParams.get("techId");
  const techName = searchParams.get("techName");

  const [form, setForm] = useState({
    title: "",
    description: "",
    code: "",
    category: "",
    Technology: techId || "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Update technology_id if techId changes
  useEffect(() => {
    if (techId) {
      setForm((prev) => ({ ...prev, Technology: techId }));
    }
  }, [techId]);

  // Redirect if no technology is selected
  useEffect(() => {
    if (!techId) {
      router.push("/admin/create");
    }
  }, [techId, router]);

  function updateForm(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
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
        Technology: techId || "",
      });

      // Optionally redirect after success
      // setTimeout(() => router.push("/admin/snippets"), 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    }
  }

  if (!techId) {
    return <div className="p-6">Redirecting to technology selection...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Create Snippet</h1>
      {techName && (
        <p className="text-blue-600 mb-6">
          For technology: <strong>{techName}</strong>
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={updateForm}
            placeholder="Snippet title"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            name="category"
            value={form.category}
            onChange={updateForm}
            placeholder="e.g., Authentication, Setup, etc."
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={updateForm}
            placeholder="Brief description of what this snippet does"
            className="w-full p-2 border rounded h-24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Code</label>
          <textarea
            name="code"
            value={form.code}
            onChange={updateForm}
            placeholder="Paste your code snippet here"
            className="w-full p-2 font-mono border rounded h-64"
            required
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {success && (
          <p className="text-green-600">Snippet created successfully!</p>
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Create Snippet
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/create")}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
          >
            Back to Technology Selection
          </button>
        </div>
      </form>
    </div>
  );
}
