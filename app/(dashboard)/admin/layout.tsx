// app/(dashboard)/admin/layout.tsx
import AdminNav from "../../../components/AdminNav";
import { createSessionClient } from "../../lib/server/appwrite";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    // Verify the user is an admin
    const { account } = await createSessionClient();
    const user = await account.get();

    if (!user || user.email !== "jenishkhunt002@gmail.com") {
      redirect("/");
    }

    return (
      <div>
        <AdminNav />
        <main>{children}</main>
      </div>
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    // If there's an error (like no session), redirect to login
    redirect("/login");
  }
}
