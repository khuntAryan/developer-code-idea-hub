// src/app/api/setup/route.ts
import { NextResponse } from "next/server";
import {
  createTechnologyCollection,
  createSnippetsCollection,
} from "../../lib/server/createTechnologyCollection";

export async function GET() {
  try {
    const techCreated = await createTechnologyCollection();
    const snippetsCreated = await createSnippetsCollection();

    if (!techCreated || !snippetsCreated) {
      return NextResponse.json(
        { message: "Some collections could not be created properly." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "✅ Collections and relationships set up successfully." },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("❌ Error in setup:", error.message || error);
    return NextResponse.json(
      { message: "❌ Internal server error." },
      { status: 500 },
    );
  }
}
