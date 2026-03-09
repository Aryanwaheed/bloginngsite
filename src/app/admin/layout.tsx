import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "./admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-screen bg-gray-50 font-jakarta overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</main>
    </div>
  );
}
