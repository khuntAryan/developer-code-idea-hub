// /app/(dashboard)/admin/snippets/page.tsx
import { createSessionClient } from "../../../lib/server/appwrite";
import { redirect } from "next/navigation";
import AdminSnippetForm from "../../../../components/AdminSnippetForm";


export default async function AdminSnippetsPage() {

  const { account } = await createSessionClient();
  const user = await account.get();

  if (!user || user.email !== "jenishkhunt002@gmail.com") {
    redirect("/");
  }

  return <AdminSnippetForm />;
}
