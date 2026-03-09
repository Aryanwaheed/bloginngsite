"use client";

import { useEffect, useRef } from "react";
import { initSession, pingSession, trackPageView } from "@/lib/analytics";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const initialized = useRef(false);

    useEffect(() => {
        // Initialize session on first mount
        if (!initialized.current) {
            initialized.current = true;
            // Store session start time
            const SESSION_KEY = "wh_session_id";
            const startKey = `${SESSION_KEY}_started`;
            if (!localStorage.getItem(startKey)) {
                localStorage.setItem(startKey, Date.now().toString());
            }
            initSession().catch(() => { });
        }

        // Track page view whenever pathname changes
        trackPageView(pathname).catch(() => { });
    }, [pathname]);

    useEffect(() => {
        // Ping every 60 seconds to update last_seen_at for active user tracking
        const interval = setInterval(() => {
            pingSession().catch(() => { });
        }, 60_000);

        return () => clearInterval(interval);
    }, []);

    return null;
}
