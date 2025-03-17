// page.tsx (Home Page)
import Link from "next/link";
import { auth } from "../../auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl text-center bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Code Idea Hub
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          A centralized platform where developers can access, store, and
          contribute code snippets while visually demonstrating their ideas.
        </p>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/snippets">
            <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
              Browse Snippets
            </button>
          </Link>

          {session?.user ? (
            <Link href="/workspace">
              <button className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200">
                Open Workspace
              </button>
            </Link>
          ) : (
            <></>
          )}

          {session?.user ? (
            <Link href="/submit">
              <button className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200">
                Submit Snippet
              </button>
            </Link>
          ) : (
            <></>
          )}
        </div>
      </div>
    </main>
  );
}
