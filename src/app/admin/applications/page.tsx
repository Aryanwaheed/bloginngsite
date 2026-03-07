import { createClient } from "../../../../../supabase/server";

export default async function AdminApplicationsPage() {
  const supabase = await createClient();
  const { data: applications } = await supabase
    .from("applications")
    .select("*, jobs(title, category)")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <p className="text-gray-500 text-sm mt-1">{applications?.length || 0} total applications received</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Applicant</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Job Applied</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Message</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(applications || []).map((app: any) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{app.name}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{app.phone}</td>
                  <td className="px-5 py-4">
                    <div>
                      <div className="text-sm text-gray-900 font-medium">{app.jobs?.title || "—"}</div>
                      {app.jobs?.category && (
                        <span className="text-xs bg-blue-50 text-[#1A56DB] px-2 py-0.5 rounded-full">{app.jobs.category}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500 max-w-xs">
                    <p className="line-clamp-2">{app.message || <span className="text-gray-300 italic">No message</span>}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))}
              {(!applications || applications.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-400 text-sm">
                    <div className="text-4xl mb-3">📭</div>
                    No applications yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
