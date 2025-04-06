// src/app/oauth/route.js

import { createAdminClient } from "../lib/server/appwrite";
import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");

  const { account } = await createAdminClient();
  if (!userId || !secret) {
    throw new Error("Missing required parameters: userId or secret");
  }
  const session = await account.createSession(userId, secret);

  (await cookies()).set("my-custom-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  return NextResponse.redirect(`${request.nextUrl.origin}/`);
}
