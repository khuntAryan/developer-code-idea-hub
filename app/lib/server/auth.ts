"use server";

import { createAdminClient } from "./appwrite";
import { ID } from "node-appwrite";
import { cookies } from "next/headers";

export async function signUpWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password || !name) {
    return { error: "All fields are required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  try {
    const { account } = await createAdminClient();

    // Create user in Appwrite
    await account.create(ID.unique(), email, password, name);
    const session = await account.createEmailPasswordSession(email, password);

    // Store session in cookies
    (await cookies()).set("my-custom-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return { success: true };
  } catch (error: any) {
    if (error.message.includes("already exists")) {
      return {
        error: "An account with this email already exists. Please log in.",
      };
    }
    return { error: "An error occurred. Please try again." };
  }
}

export async function loginWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Both email and password are required." };
  }

  try {
    const { account } = await createAdminClient();

    // Attempt login
    const session = await account.createEmailPasswordSession(email, password);

    // Store session in cookies
    (await cookies()).set("my-custom-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return { success: true };
  } catch (error: any) {
    if (error.message.includes("Invalid")) {
      return { error: "Invalid email or password. Please try again." };
    }
    return { error: "An error occurred. Please try again later." };
  }
}
