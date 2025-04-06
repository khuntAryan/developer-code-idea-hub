// components/AdminNav.tsx
import Link from "next/link";

export default function AdminNav() {
  return (
    <nav className="bg-gray-100 p-4 mb-6">
      <div className="max-w-4xl mx-auto flex flex-wrap gap-4">
        <Link
          href="/admin/dashboard"
          className="px-3 py-2 bg-white rounded shadow hover:bg-gray-50"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/create"
          className="px-3 py-2 bg-white rounded shadow hover:bg-gray-50"
        >
          Create New Snippet
        </Link>
        <Link
          href="/admin/technologies"
          className="px-3 py-2 bg-white rounded shadow hover:bg-gray-50"
        >
          Manage Technologies
        </Link>
        <Link
          href="/admin/snippets"
          className="px-3 py-2 bg-white rounded shadow hover:bg-gray-50"
        >
          Manage Snippets
        </Link>
      </div>
    </nav>
  );
}
