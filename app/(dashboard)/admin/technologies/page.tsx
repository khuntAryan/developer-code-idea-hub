// app/(dashboard)/admin/technologies/page.tsx
import { createSessionClient } from "../../../lib/server/appwrite";
import { redirect } from "next/navigation";
import AdminTechnologyForm from "../../../../components/AdminTechnologyForm";

export default async function AdminTechnologiesPage() {
  const { account } = await createSessionClient();
  const user = await account.get();

  if (!user || user.email !== "jenishkhunt002@gmail.com") {
    redirect("/");
  }

  return <AdminTechnologyForm />;
}
