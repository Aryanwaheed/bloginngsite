import { createClient } from "../../../../supabase/server";
import AnalyticsClient from "./analytics-client";

export const revalidate = 0;

export default async function AnalyticsPage() {
    const supabase = await createClient();

    // Fetch last 30 days as initial load
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const from = thirtyDaysAgo.toISOString();

    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    const [sessions, events, pageViews, activeUsersRes, recentEventsRes] = await Promise.all([
        supabase.from("analytics_sessions").select("*").gte("started_at", from),
        supabase.from("analytics_events").select("*").gte("created_at", from),
        supabase.from("analytics_page_views").select("*").gte("created_at", from),
        supabase.from("analytics_sessions").select("*", { count: "exact", head: true }).gte("last_seen_at", fiveMinAgo),
        supabase.from("analytics_events").select("id, event_type, page, created_at").order("created_at", { ascending: false }).limit(20),
    ]);

    const sessData = sessions.data || [];
    const evData = events.data || [];
    const pvData = pageViews.data || [];

    // ── Build daily visitors ──
    const dayMap: Record<string, Set<string>> = {};
    sessData.forEach(s => {
        const day = s.started_at?.slice(0, 10);
        if (!day) return;
        if (!dayMap[day]) dayMap[day] = new Set();
        dayMap[day].add(s.session_id);
    });
    const dailyVisitors = Object.entries(dayMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, set]) => ({ date: date.slice(5), visitors: set.size }));

    // ── Peak hours ──
    const hourMap: Record<number, number> = {};
    for (let i = 0; i < 24; i++) hourMap[i] = 0;
    pvData.forEach(pv => {
        const h = new Date(pv.created_at).getHours();
        hourMap[h] = (hourMap[h] || 0) + 1;
    });
    const peakHours = Object.entries(hourMap).map(([hour, count]) => ({
        hour: `${String(hour).padStart(2, "0")}h`,
        count,
    }));

    // ── Country data ──
    const countryMap: Record<string, number> = {};
    sessData.forEach(s => {
        const c = s.country || "Unknown";
        countryMap[c] = (countryMap[c] || 0) + 1;
    });
    const countryData = Object.entries(countryMap)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count);

    // ── Job events ──
    const findJobsClicks = evData.filter(e => e.event_type === "find_jobs_click").length;
    const jobViews = evData.filter(e => e.event_type === "job_view").length;
    const applyClicks = evData.filter(e => e.event_type === "apply_now_click").length;

    // ── Top jobs ──
    const jobMap: Record<string, { name: string; views: number }> = {};
    evData.filter(e => e.event_type === "job_view" && e.metadata?.job_title).forEach(e => {
        const title = e.metadata.job_title as string;
        const id = e.metadata.job_id as string;
        if (!jobMap[id]) jobMap[id] = { name: title.slice(0, 20) + (title.length > 20 ? "…" : ""), views: 0 };
        jobMap[id].views++;
    });
    const topJobs = Object.values(jobMap).sort((a, b) => b.views - a.views).slice(0, 6);

    // ── Chat stats ──
    const chatSessions = evData.filter(e => e.event_type === "chat_session_start").length;
    const userMessages = evData.filter(e => e.event_type === "chat_message_sent").length;
    const aiResponses = evData.filter(e => e.event_type === "chat_ai_response").length;

    const charMap: Record<string, { name: string; sessions: number; messages: number }> = {};
    evData.filter(e => ["chat_session_start", "chat_message_sent"].includes(e.event_type) && e.metadata?.character_name).forEach(e => {
        const name = e.metadata.character_name as string;
        if (!charMap[name]) charMap[name] = { name, sessions: 0, messages: 0 };
        if (e.event_type === "chat_session_start") charMap[name].sessions++;
        if (e.event_type === "chat_message_sent") charMap[name].messages++;
    });
    const topCharacters = Object.values(charMap).sort((a, b) => b.sessions - a.sessions).slice(0, 6);

    // ── Top content ──
    const topContent = [
        ...topJobs.map(j => ({ name: j.name, type: "Job", count: j.views })),
        ...topCharacters.map(c => ({ name: c.name, type: "Life Guider", count: c.sessions + c.messages })),
    ].sort((a, b) => b.count - a.count).slice(0, 10);

    // ── Avg session duration ──
    const withDuration = sessData.filter(s => s.duration_seconds > 0);
    const avgDuration = withDuration.length > 0
        ? Math.round(withDuration.reduce((sum, s) => sum + (s.duration_seconds as number), 0) / withDuration.length)
        : 0;

    const initialData = {
        totalSessions: sessData.length,
        totalPageViews: pvData.length,
        activeUsers: activeUsersRes.count || 0,
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
        recentEvents: recentEventsRes.data || [],
    };

    return <AnalyticsClient initialData={initialData} />;
}
