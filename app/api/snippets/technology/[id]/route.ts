// src/app/api/snippets/technology/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "../../../../lib/server/appwrite";
import { 
  appwriteDatabase, 
  appwriteCollectionSnippets 
} from "../../../../conf/config";
import { Query } from "node-appwrite";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const Technology = params.id;

  if (!Technology) {
    return NextResponse.json(
      { error: "Technology ID parameter is required" },
      { status: 400 }
    );
  }

  try {
    const { databases } = await createAdminClient();

    // Query the snippets collection by technology_id
    const snippets = await databases.listDocuments(
      appwriteDatabase || "",
      appwriteCollectionSnippets || "",
      [Query.equal("Technology", Technology)]
    );

    return NextResponse.json({ 
      success: true, 
      snippets: snippets.documents 
    });
  } catch (error) {
    console.error("Failed to fetch snippets by technology ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch snippets" },
      { status: 500 }
    );
  }
}
