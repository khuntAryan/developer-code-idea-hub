"use server";

import { signIn } from "../../auth";

export async function signInWithProvider(provider: string) {
  await signIn(provider);
}
