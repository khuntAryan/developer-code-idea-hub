// src/lib/server/setupCollections.ts
import { ID } from "node-appwrite";
import { createAdminClient } from "./appwrite";
import {
  appwriteDatabase,
  appwriteCollectionTechnologies,
  appwriteCollectionSnippets,
} from "../../conf/config";

// Utility function to check if an attribute exists
async function attributeExists(
  databases: any,
  databaseId: string,
  collectionId: string,
  attributeKey: string,
) {
  try {
    const result = await databases.listAttributes(databaseId, collectionId);
    return result.attributes.some((attr: any) => attr.key === attributeKey);
  } catch (error: any) {
    console.log(
      `⚠️ Could not check attributes for '${attributeKey}':`,
      error.message,
    );
    return false;
  }
}

// Create the Technology collection and its attributes
export async function createTechnologyCollection() {
  const { databases } = await createAdminClient();
  const databaseId = appwriteDatabase!;
  const collectionId = appwriteCollectionTechnologies!;

  try {
    await databases.createCollection(databaseId, collectionId, "Technologies");
    console.log("✅ Technology collection created");
  } catch (error: any) {
    console.log("⚠️ Technology collection might already exist:", error.message);
  }

  const attributes = [
    { key: "name", size: 255, required: true },
    { key: "slug", size: 255, required: true },
    { key: "category", size: 255, required: false },
    { key: "logo", size: 255, required: false },
  ];

  for (const attr of attributes) {
    try {
      await databases.createStringAttribute(
        databaseId,
        collectionId,
        attr.key,
        attr.size,
        attr.required,
      );
      console.log(
        `✅ Attribute '${attr.key}' created in Technology collection`,
      );
    } catch (error: any) {
      console.log(
        `⚠️ Attribute '${attr.key}' may already exist:`,
        error.message,
      );
    }
  }
}

// Create the Snippets collection, attributes, and relationship to Technology
export async function createSnippetsCollection() {
  const { databases } = await createAdminClient();
  const databaseId = appwriteDatabase!;
  const snippetCollectionId = appwriteCollectionSnippets!;
  const techCollectionId = appwriteCollectionTechnologies!;

  try {
    await databases.createCollection(
      databaseId,
      snippetCollectionId,
      "Snippets",
    );
    console.log("✅ Snippets collection created");
  } catch (error: any) {
    console.log("⚠️ Snippets collection might already exist:", error.message);
  }

  const attributes = [
    { key: "title", size: 255, required: true },
    { key: "category", size: 255, required: false },
    { key: "description", size: 1000, required: false },
    { key: "code", size: 2000, required: true },
  ];

  for (const attr of attributes) {
    try {
      await databases.createStringAttribute(
        databaseId,
        snippetCollectionId,
        attr.key,
        attr.size,
        attr.required,
      );
      console.log(`✅ Attribute '${attr.key}' created in Snippets collection`);
    } catch (error: any) {
      console.log(
        `⚠️ Attribute '${attr.key}' may already exist:`,
        error.message,
      );
    }
  }

  // Check if 'technology_technology_idid' relationship attribute already exists
  const relationshipKey = "Technology";
  const exists = await attributeExists(
    databases,
    databaseId,
    snippetCollectionId,
    relationshipKey,
  );

  if (!exists) {
    try {
      await databases.createRelationshipAttribute(
        databaseId,
        snippetCollectionId,
        techCollectionId,
        "manyToOne",
        false, // Change this to false to prevent creating the related attribute
        "Technology",
        relationshipKey,
        "cascade",
      );
      console.log("✅ Relationship 'Technology' created in Snippets");
    } catch (error: any) {
      console.log("❌ Failed to create relationship attribute:", error.message);
    }
  } else {
    console.log("⚠️ Relationship 'Technology' already exists in Snippets");
  }
}
