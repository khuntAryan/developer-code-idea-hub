// src/lib/server/appwrite.js
"use server";
import { Client, Account ,Databases} from "node-appwrite";
import { cookies } from "next/headers";
import {
  appwriteApiKey,
  appwriteEndpoint,
  appwriteProject,
} from "../../conf/config";

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(appwriteEndpoint!)
    .setProject(appwriteProject!);

  const session = (await cookies()).get("my-custom-session");
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      const account = new Account(client);
      return account;
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(appwriteEndpoint!)
    .setProject(appwriteProject!)
    .setKey(appwriteApiKey!);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    }
  };
}

export async function getLoggedInUser() {
  const sessionSecret = (await cookies()).get("my-custom-session")?.value;
  if (sessionSecret) return true;
  try {
    const { account } = await createSessionClient();
    return await account.get();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}
export { Client };

