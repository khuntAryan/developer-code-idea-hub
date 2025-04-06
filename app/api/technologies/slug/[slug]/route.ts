// src/app/api/technologies/slug/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "../../../../lib/server/appwrite";
import {
  appwriteDatabase,
  appwriteCollectionTechnologies,
} from "../../../../conf/config";
import { Query } from "node-appwrite";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const slug = await params.slug;

  if (!slug) {
    return NextResponse.json(
      { error: "Slug parameter is required" },
      { status: 400 },
    );
  }

  try {
    const { databases } = await createAdminClient();

    // Query the technologies collection by slug
    const technologies = await databases.listDocuments(
      appwriteDatabase || "",
      appwriteCollectionTechnologies || "",
      [Query.equal("slug", slug)],
    );

    if (technologies.documents.length === 0) {
      return NextResponse.json(
        { error: "Technology not found" },
        { status: 404 },
      );
    }

    // Return the first matching technology
    return NextResponse.json({
      success: true,
      technology: technologies.documents[0],
    });
  } catch (error) {
    console.error("Failed to fetch technology by slug:", error);
    return NextResponse.json(
      { error: "Failed to fetch technology" },
      { status: 500 },
    );
  }
}
