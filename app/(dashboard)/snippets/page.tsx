// app/(dashboard)/snippets/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function TechnologiesPage() {
  interface Technology {
    $id: string;
    name: string;
    slug: string;
    logo?: string;
    category?: string;
  }

  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTechnologies() {
      try {
        const res = await fetch("/api/technologies");
        if (!res.ok) throw new Error("Failed to fetch technologies");
        const data = await res.json();
        setTechnologies(data.technologies);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        setLoading(false);
      }
    }

    fetchTechnologies();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Technologies</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {technologies.map((tech) => (
            <Link
              href={`/snippets/${tech.slug}`}
              key={tech.$id}
              className="border rounded p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center mb-2">
                {tech.logo && (
                  <Image
                    src={tech.logo}
                    alt={tech.name}
                    className="w-8 h-8 mr-2"
                    height={64}
                    width={64}
                  />
                )}
                <h2 className="text-xl font-semibold">{tech.name}</h2>
              </div>
              {tech.category && (
                <span className="bg-blue-100 px-2 py-1 rounded text-sm">
                  {tech.category}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
