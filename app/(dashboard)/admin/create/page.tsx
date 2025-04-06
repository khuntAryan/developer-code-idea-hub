// app/(dashboard)/admin/create/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Technology {
  $id: string;
  name: string;
  slug: string;
  category?: string;
  logo?: string;
}

export default function CreateWorkflowPage() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTech, setSelectedTech] = useState("");
  const [showNewTechForm, setShowNewTechForm] = useState(false);
  const [newTech, setNewTech] = useState({
    name: "",
    slug: "",
    category: "",
    logo: "",
  });
  
  const router = useRouter();

  useEffect(() => {
    async function fetchTechnologies() {
      try {
        const res = await fetch("/api/technologies");
        if (!res.ok) throw new Error("Failed to fetch technologies");
        const data = await res.json();
        setTechnologies(data.technologies);
        setLoading(false);
      } catch (err : unknown) {
        setError(`Failed to load technologies ${err}`);
        setLoading(false);
      }
    }
    
    fetchTechnologies();
  }, []);

  function handleNewTechChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setNewTech(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from name if slug field is empty
    if (name === "name" && !newTech.slug) {
      setNewTech(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/\s+/g, '-')
      }));
    }
  }

  async function handleCreateTechnology(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const res = await fetch("/api/technologies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTech),
      });
      
      if (!res.ok) throw new Error("Failed to create technology");
      
      const data = await res.json();
      
      // Redirect to snippet creation page with the new technology ID
      router.push(`/admin/create/snippet?techId=${data.technology.$id}&techName=${encodeURIComponent(data.technology.name)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create technology");
    }
  }

  function handleExistingTechSelect() {
    if (!selectedTech) {
      setError("Please select a technology");
      return;
    }
    
    const tech = technologies.find(t => t.$id === selectedTech);
    if (!tech) return;
    
    router.push(`/admin/create/snippet?techId=${tech.$id}&techName=${encodeURIComponent(tech.name)}`);
  }

  if (loading) return <div className="p-6">Loading technologies...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Snippet</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Step 1: Select Technology</h2>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        {/* Toggle between existing and new technology */}
        <div className="flex space-x-4 mb-6">
          <button
            type="button"
            onClick={() => setShowNewTechForm(false)}
            className={`px-4 py-2 rounded ${!showNewTechForm ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Use Existing Technology
          </button>
          <button
            type="button"
            onClick={() => setShowNewTechForm(true)}
            className={`px-4 py-2 rounded ${showNewTechForm ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Create New Technology
          </button>
        </div>
        
        {!showNewTechForm ? (
          <div>
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="">Select a technology</option>
              {technologies.map(tech => (
                <option key={tech.$id} value={tech.$id}>
                  {tech.name}
                </option>
              ))}
            </select>
            
            <button
              type="button"
              onClick={handleExistingTechSelect}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Continue to Snippet Creation
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreateTechnology} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Technology Name</label>
              <input
                name="name"
                value={newTech.name}
                onChange={handleNewTechChange}
                placeholder="e.g., React, Next.js, etc."
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Slug (URL-friendly name)</label>
              <input
                name="slug"
                value={newTech.slug}
                onChange={handleNewTechChange}
                placeholder="e.g., react, next-js, etc."
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Category (Optional)</label>
              <input
                name="category"
                value={newTech.category}
                onChange={handleNewTechChange}
                placeholder="e.g., Frontend, Backend, etc."
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Logo URL (Optional)</label>
              <input
                name="logo"
                value={newTech.logo}
                onChange={handleNewTechChange}
                placeholder="URL to technology logo"
                className="w-full p-2 border rounded"
              />
            </div>
            
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Create Technology & Continue
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
