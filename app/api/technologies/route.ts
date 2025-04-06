// src/app/api/technologies/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "../../lib/server/appwrite";
import {
  appwriteDatabase,
  appwriteCollectionTechnologies,
} from "../../conf/config";
import { ID, Permission, Role } from "node-appwrite";

export async function GET() {
  try {
    const { databases } = await createAdminClient();

    const technologies = await databases.listDocuments(
      appwriteDatabase || "",
      appwriteCollectionTechnologies || "",
      [],
    );

    return NextResponse.json({
      success: true,
      technologies: technologies.documents,
    });
  } catch (error) {
    console.error("Failed to fetch technologies:", error);
    return NextResponse.json(
      { error: "Failed to fetch technologies" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { databases } = await createAdminClient();
    const { name, slug, category, logo } = await req.json();

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 },
      );
    }

    const newTechnology = await databases.createDocument(
      appwriteDatabase || "",
      appwriteCollectionTechnologies || "",
      ID.unique(),
      { name, slug, category, logo },
      [
        Permission.read(Role.any()),
        Permission.write(Role.user("67f0a5e0000e01019b55")), // Your admin user ID
        Permission.delete(Role.user("67f0a5e0000e01019b55")),
      ],
    );

    return NextResponse.json({ success: true, technology: newTechnology });
  } catch (error) {
    console.error("Failed to create technology:", error);
    return NextResponse.json(
      { error: "Failed to create technology" },
      { status: 500 },
    );
  }
}
