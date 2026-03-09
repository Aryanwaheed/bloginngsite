import { createClient } from "../../../../supabase/server";
import JobsManager from "./jobs-manager";

export default async function AdminJobsPage() {
  const supabase = await createClient();
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 md:p-8">
      <JobsManager initialJobs={jobs || []} />
    </div>
  );
}
