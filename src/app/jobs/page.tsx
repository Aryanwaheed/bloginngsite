import { createClient } from "../../../../supabase/server";
import SiteNavbar from "@/components/site-navbar";
import SiteFooter from "@/components/site-footer";
import JobsClient from "./jobs-client";

export default async function JobsPage() {
  const supabase = await createClient();
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-jakarta">
      <SiteNavbar />
      <JobsClient initialJobs={jobs || []} />
      <SiteFooter />
    </div>
  );
}
