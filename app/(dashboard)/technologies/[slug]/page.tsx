// app/(dashboard)/technologies/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function TechnologySnippetsPage() {
  const params = useParams();
  const { slug } = params;

  const [technology, setTechnology] = useState<{ name: string; logo?: string; $id: string } | null>(null);
  const [snippets, setSnippets] = useState<{ $id: string; title: string; category: string; description: string; code: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch technology by slug
        const techRes = await fetch(`/api/technologies/slug/${slug}`);
        if (!techRes.ok) throw new Error("Failed to fetch technology");
        const techData = await techRes.json();
        setTechnology(techData.technology);

        // Fetch snippets for this technology
        const snippetsRes = await fetch(
          `/api/snippets/technology/${techData.technology.$id}`,
        );
        if (!snippetsRes.ok) throw new Error("Failed to fetch snippets");
        const snippetsData = await snippetsRes.json();
        setSnippets(snippetsData.snippets);

        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        setLoading(false);
      }
    }

    if (slug) {
      fetchData();
    }
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!technology) return <div>Technology not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        {technology.logo && (
          <Image
            src={technology.logo}
            alt={technology.name}
            className="w-10 h-10 mr-3"
          />
        )}
        <h1 className="text-3xl font-bold">{technology.name} Snippets</h1>
      </div>

      {snippets.length === 0 ? (
        <p>No snippets available for this technology yet.</p>
      ) : (
        <div className="space-y-4">
          {snippets.map((snip) => (
            <div key={snip.$id} className="border rounded p-4 bg-gray-50">
              <h2 className="text-xl font-semibold">{snip.title}</h2>
              <p className="text-sm text-gray-600 mb-2">{snip.category}</p>
              <p className="mb-2">{snip.description}</p>
              <pre className="bg-black text-white p-4 rounded overflow-x-auto">
                <code>{snip.code}</code>
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
