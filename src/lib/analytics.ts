import { createClient } from "../../supabase/client";

const SESSION_KEY = "wh_session_id";
const SESSION_COUNTRY_KEY = "wh_session_country";

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = generateSessionId();
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

async function getCountry(): Promise<{ country: string; country_code: string }> {
  if (typeof window === "undefined") return { country: "Unknown", country_code: "XX" };

  // Cache country in sessionStorage to avoid repeated API calls
  const cached = sessionStorage.getItem(SESSION_COUNTRY_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {}
  }

  try {
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error("geo fail");
    const data = await res.json();
    const result = {
      country: data.country_name || "Unknown",
      country_code: data.country_code || "XX",
    };
    sessionStorage.setItem(SESSION_COUNTRY_KEY, JSON.stringify(result));
    return result;
  } catch {
    return { country: "Unknown", country_code: "XX" };
  }
}

let sessionInitialized = false;

export async function initSession(): Promise<string> {
  if (typeof window === "undefined") return "";
  const sessionId = getOrCreateSessionId();

  if (!sessionInitialized) {
    sessionInitialized = true;
    const supabase = createClient();
    const { country, country_code } = await getCountry();
    const userAgent = navigator.userAgent.substring(0, 200);

    await supabase.from("analytics_sessions").upsert(
      {
        session_id: sessionId,
        country,
        country_code,
        user_agent: userAgent,
        started_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
      },
      { onConflict: "session_id", ignoreDuplicates: false }
    );
  }

  return sessionId;
}

export async function pingSession(): Promise<void> {
  if (typeof window === "undefined") return;
  const sessionId = getOrCreateSessionId();
  const supabase = createClient();
  const startedAt = localStorage.getItem(`${SESSION_KEY}_started`);
  const durationSeconds = startedAt
    ? Math.floor((Date.now() - parseInt(startedAt, 10)) / 1000)
    : 0;

  await supabase
    .from("analytics_sessions")
    .update({ last_seen_at: new Date().toISOString(), duration_seconds: durationSeconds })
    .eq("session_id", sessionId);
}

export async function trackPageView(page: string): Promise<void> {
  if (typeof window === "undefined") return;
  const sessionId = getOrCreateSessionId();
  const supabase = createClient();
  await supabase.from("analytics_page_views").insert({ page, session_id: sessionId });
}

export async function trackEvent(
  eventType: string,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  if (typeof window === "undefined") return;
  const sessionId = getOrCreateSessionId();
  const page = window.location.pathname;
  const supabase = createClient();
  await supabase.from("analytics_events").insert({
    event_type: eventType,
    session_id: sessionId,
    page,
    metadata,
  });

  // Also fire Google Analytics event if available
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventType, { ...metadata });
  }
}
