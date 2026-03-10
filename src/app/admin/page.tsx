import { createClient } from "../../../supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [{ count: jobsCount }, { count: appsCount }, { count: charsCount }] = await Promise.all([
    supabase.from("jobs").select("*", { count: "exact", head: true }),
    supabase.from("applications").select("*", { count: "exact", head: true }),
    supabase.from("ai_characters").select("*", { count: "exact", head: true }),
  ]);

  const { data: recentApps } = await supabase
    .from("applications")
    .select("*, jobs(title)")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { label: "Total Jobs", value: jobsCount ?? 0, color: "bg-blue-50 text-[#1A56DB]", emoji: "💼" },
    { label: "Applications", value: appsCount ?? 0, color: "bg-green-50 text-green-600", emoji: "📋" },
    { label: "Life Guiders", value: charsCount ?? 0, color: "bg-purple-50 text-purple-600", emoji: "🤖" },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's an overview of your platform.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-2xl mb-4`}>
              {stat.emoji}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Applications</h2>
          <a href="/admin/applications" className="text-sm text-[#1A56DB] hover:underline">View all</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Job</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(recentApps || []).map((app: any) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{app.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{app.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{app.jobs?.title || "—"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(app.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {(!recentApps || recentApps.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm">No applications yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
