import {
  appwriteDatabase,
  appwriteCollectionSnippets,
} from "./../../conf/config";
import { NextResponse } from "next/server";

import {
  createAdminClient,
  createSessionClient,
} from "../../lib/server/appwrite";
import { ID, Permission, Role } from "node-appwrite";

// src/app/api/snippets/route.ts (modified POST method)
export async function POST(req: Request) {
  const { account } = await createSessionClient();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = await account.get();

  const { title, description, code, category, Technology } = await req.json();

  const { databases } = await createAdminClient();

  if (!databases) {
    return NextResponse.json(
      { error: "Failed to initialize Appwrite Databases client" },
      { status: 500 },
    );
  }

  try {
    const newSnippet = await databases.createDocument(
      appwriteDatabase || "",
      appwriteCollectionSnippets || "",
      ID.unique(),
      {
        title,
        description,
        code,
        category,
        Technology,
      },
      [
        Permission.read(Role.any()),
        Permission.write(Role.user("67f0a5e0000e01019b55")),
        Permission.delete(Role.user("67f0a5e0000e01019b55")),
      ],
    );
    return NextResponse.json({ success: true, snippet: newSnippet });
  } catch (error: unknown) {
    console.error("Snippet creation error:", error);
    return NextResponse.json(
      {
        error: `Failed to create snippet: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const { databases } = await createAdminClient();
    if (!databases) {
      return NextResponse.json(
        { error: "Failed to initialize Appwrite Databases client" },
        { status: 500 },
      );
    }

    const snippets = await databases.listDocuments(
      appwriteDatabase || "any", // Database ID
      appwriteCollectionSnippets || "any", // Collection ID
      [],
    );
    return NextResponse.json({ success: true, snippets: snippets.documents });
  } catch (error) {
    // Handle the case where the client could not be created
    console.error("Failed to create Appwrite client:", error);
    return NextResponse.json(
      { error: "Failed to initialize Appwrite Databases client" },
      { status: 500 },
    );
  }
}
