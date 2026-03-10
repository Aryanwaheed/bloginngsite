"use client";

import { useState, useEffect, useCallback } from "react";
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { createClient } from "../../../../supabase/client";
import { Users, Eye, TrendingUp, MessageCircle, Briefcase, Globe, Clock, Activity, Zap } from "lucide-react";

type DateRange = "today" | "week" | "month" | "all";

const COLORS = ["#1A56DB", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"];

function StatCard({ label, value, icon: Icon, color, sub }: {
    label: string; value: string | number; icon: any; color: string; sub?: string;
}) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
                {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
            </div>
        </div>
    );
}

export default function AnalyticsClient({ initialData }: { initialData: any }) {
    const [range, setRange] = useState<DateRange>("month");
    const [activeUsers, setActiveUsers] = useState(initialData.activeUsers || 0);
    const [data, setData] = useState(initialData);

    const fetchRangedData = useCallback(async (r: DateRange) => {
        const supabase = createClient();
        const now = new Date();
        let from: Date;
        if (r === "today") from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        else if (r === "week") { from = new Date(now); from.setDate(from.getDate() - 7); }
        else if (r === "month") { from = new Date(now); from.setDate(from.getDate() - 30); }
        else from = new Date(0);

        const fromISO = from.toISOString();

        const [sessions, events, pageViews] = await Promise.all([
            supabase.from("analytics_sessions").select("*").gte("started_at", fromISO),
            supabase.from("analytics_events").select("*").gte("created_at", fromISO),
            supabase.from("analytics_page_views").select("*").gte("created_at", fromISO),
        ]);

        setData(processData(sessions.data || [], events.data || [], pageViews.data || [], initialData));
    }, [initialData]);

    useEffect(() => {
        fetchRangedData(range);
    }, [range, fetchRangedData]);

    // Poll active users every 30s
    useEffect(() => {
        const poll = async () => {
            const supabase = createClient();
            const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
            const { count } = await supabase
                .from("analytics_sessions")
                .select("*", { count: "exact", head: true })
                .gte("last_seen_at", fiveMinAgo);
            setActiveUsers(count || 0);
        };
        poll();
        const interval = setInterval(poll, 30_000);
        return () => clearInterval(interval);
    }, []);

    const ranges: { key: DateRange; label: string }[] = [
        { key: "today", label: "Today" },
        { key: "week", label: "This Week" },
        { key: "month", label: "This Month" },
        { key: "all", label: "All Time" },
    ];

    return (
        <div className="p-6 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-gray-500 text-sm mt-1">Monitor your platform performance and visitor engagement.</p>
                </div>
                <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
                    {ranges.map(r => (
                        <button
                            key={r.key}
                            onClick={() => setRange(r.key)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${range === r.key ? "bg-white text-[#1A56DB] shadow-sm" : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Section 1: Overview Cards ── */}
            <section>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Overview</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total Visitors" value={data.totalSessions} icon={Users} color="bg-blue-50 text-[#1A56DB]" />
                    <StatCard label="Page Views" value={data.totalPageViews} icon={Eye} color="bg-purple-50 text-purple-600" />
                    <StatCard label="Active Now" value={activeUsers} icon={Activity} color="bg-green-50 text-green-600" sub="Last 5 min" />
                    <StatCard label="Avg Session" value={`${data.avgDuration}s`} icon={Clock} color="bg-amber-50 text-amber-600" />
                </div>
            </section>

            {/* ── Section 2: Visitor Trends ── */}
            <section>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Visitor Trends</h2>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-4">Daily Unique Visitors</h3>
                    {data.dailyVisitors?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={data.dailyVisitors} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9CA3AF" }} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: 12 }} />
                                <Line type="monotone" dataKey="visitors" stroke="#1A56DB" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No data yet for this period</div>
                    )}
                </div>
            </section>

            {/* ── Section 3: Peak Hours + Country Distribution ── */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" /> Peak Activity Hours
                    </h3>
                    {data.peakHours?.some((h: any) => h.count > 0) ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={data.peakHours} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#9CA3AF" }} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: 12 }} />
                                <Bar dataKey="count" fill="#1A56DB" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No activity data yet</div>
                    )}
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-500" /> Traffic by Country
                    </h3>
                    {data.countryData?.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie data={data.countryData.slice(0, 6)} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="count" paddingAngle={3}>
                                        {data.countryData.slice(0, 6).map((_: any, i: number) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: 12 }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-2">
                                {data.countryData.slice(0, 6).map((c: any, i: number) => (
                                    <div key={c.country} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                            <span className="text-gray-700 truncate max-w-[90px]">{c.country}</span>
                                        </div>
                                        <span className="font-semibold text-gray-800">{c.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No geo data yet</div>
                    )}
                </div>
            </section>

            {/* ── Section 4: Job Engagement ── */}
            <section>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Job Engagement</h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <StatCard label="Find Jobs Clicks" value={data.findJobsClicks} icon={Briefcase} color="bg-blue-50 text-[#1A56DB]" />
                    <StatCard label="Job Views" value={data.jobViews} icon={Eye} color="bg-indigo-50 text-indigo-600" />
                    <StatCard label="Apply Now Clicks" value={data.applyClicks} icon={TrendingUp} color="bg-green-50 text-green-600" />
                </div>
                {data.topJobs?.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-800 mb-4">Most Viewed Jobs</h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={data.topJobs} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 11, fill: "#9CA3AF" }} tickLine={false} axisLine={false} />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#374151" }} tickLine={false} width={130} />
                                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: 12 }} />
                                <Bar dataKey="views" fill="#1A56DB" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </section>

            {/* ── Section 5: AI Chat Metrics ── */}
            <section>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Life Guider Chat Usage</h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <StatCard label="Chat Sessions" value={data.chatSessions} icon={MessageCircle} color="bg-purple-50 text-purple-600" />
                    <StatCard label="User Messages" value={data.userMessages} icon={TrendingUp} color="bg-amber-50 text-amber-600" />
                    <StatCard label="AI Responses" value={data.aiResponses} icon={Activity} color="bg-pink-50 text-pink-600" />
                </div>
                {data.topCharacters?.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-800 mb-4">Most Popular Life Guiders</h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={data.topCharacters} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9CA3AF" }} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: 12 }} />
                                <Bar dataKey="sessions" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Chat Sessions" />
                                <Bar dataKey="messages" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Messages" />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </section>

            {/* ── Section 6: Top Content Table ── */}
            <section>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Top Content</h2>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Content</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Type</th>
                                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Interactions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.topContent?.map((item: any, i: number) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.type === "Job" ? "bg-blue-50 text-[#1A56DB]" : "bg-purple-50 text-purple-600"
                                            }`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">{item.count}</td>
                                </tr>
                            ))}
                            {(!data.topContent || data.topContent.length === 0) && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-gray-400 text-sm">No content data yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ── Section 7: Traffic Sources / Recent Events ── */}
            <section>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Recent Activity Feed</h2>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Event</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Page</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.recentEvents?.map((ev: any) => (
                                    <tr key={ev.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                {ev.event_type.replace(/_/g, " ")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-500 font-mono">{ev.page || "/"}</td>
                                        <td className="px-6 py-3 text-sm text-gray-400">
                                            {new Date(ev.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                {(!data.recentEvents || data.recentEvents.length === 0) && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-gray-400 text-sm">No events recorded yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}

// ── Helper: process raw Supabase data into chart-friendly format ──
function processData(sessions: any[], events: any[], pageViews: any[], base: any) {
    // Daily visitors
    const dayMap: Record<string, Set<string>> = {};
    sessions.forEach(s => {
        const day = s.started_at?.slice(0, 10);
        if (!day) return;
        if (!dayMap[day]) dayMap[day] = new Set();
        dayMap[day].add(s.session_id);
    });
    const dailyVisitors = Object.entries(dayMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-30)
        .map(([date, set]) => ({
            date: date.slice(5),
            visitors: set.size,
        }));

    // Peak hours (using page views)
    const hourMap: Record<number, number> = {};
    for (let i = 0; i < 24; i++) hourMap[i] = 0;
    pageViews.forEach(pv => {
        const h = new Date(pv.created_at).getHours();
        hourMap[h] = (hourMap[h] || 0) + 1;
    });
    const peakHours = Object.entries(hourMap).map(([hour, count]) => ({
        hour: `${hour.padStart(2, "0")}h`,
        count,
    }));

    // Country data
    const countryMap: Record<string, number> = {};
    sessions.forEach(s => {
        const c = s.country || "Unknown";
        countryMap[c] = (countryMap[c] || 0) + 1;
    });
    const countryData = Object.entries(countryMap)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count);

    // Job events
    const findJobsClicks = events.filter(e => e.event_type === "find_jobs_click").length;
    const jobViews = events.filter(e => e.event_type === "job_view").length;
    const applyClicks = events.filter(e => e.event_type === "apply_now_click").length;

    // Top jobs
    const jobMap: Record<string, { name: string; views: number }> = {};
    events.filter(e => e.event_type === "job_view" && e.metadata?.job_title).forEach(e => {
        const title = e.metadata.job_title as string;
        const id = e.metadata.job_id as string;
        if (!jobMap[id]) jobMap[id] = { name: title.slice(0, 18) + (title.length > 18 ? "…" : ""), views: 0 };
        jobMap[id].views++;
    });
    const topJobs = Object.values(jobMap).sort((a, b) => b.views - a.views).slice(0, 6);

    // Chat stats
    const chatSessions = events.filter(e => e.event_type === "chat_session_start").length;
    const userMessages = events.filter(e => e.event_type === "chat_message_sent").length;
    const aiResponses = events.filter(e => e.event_type === "chat_ai_response").length;

    // Top characters
    const charMap: Record<string, { name: string; sessions: number; messages: number }> = {};
    events.filter(e => ["chat_session_start", "chat_message_sent"].includes(e.event_type) && e.metadata?.character_name).forEach(e => {
        const name = e.metadata.character_name as string;
        if (!charMap[name]) charMap[name] = { name, sessions: 0, messages: 0 };
        if (e.event_type === "chat_session_start") charMap[name].sessions++;
        if (e.event_type === "chat_message_sent") charMap[name].messages++;
    });
    const topCharacters = Object.values(charMap).sort((a, b) => b.sessions - a.sessions).slice(0, 6);

    // Top content (combined jobs + characters)
    const topContent = [
        ...topJobs.map(j => ({ name: j.name, type: "Job", count: j.views })),
        ...topCharacters.map(c => ({ name: c.name, type: "Life Guider", count: c.sessions + c.messages })),
    ].sort((a, b) => b.count - a.count).slice(0, 10);

    // Avg session duration
    const withDuration = sessions.filter(s => s.duration_seconds > 0);
    const avgDuration = withDuration.length > 0
        ? Math.round(withDuration.reduce((sum, s) => sum + s.duration_seconds, 0) / withDuration.length)
        : 0;

    return {
        totalSessions: sessions.length,
        totalPageViews: pageViews.length,
        avgDuration,
        dailyVisitors,
        peakHours,
        countryData,
        findJobsClicks,
        jobViews,
        applyClicks,
        topJobs,
        chatSessions,
        userMessages,
        aiResponses,
        topCharacters,
        topContent,
        recentEvents: base.recentEvents, // keep server-fetched recent events
        activeUsers: base.activeUsers,
    };
}
