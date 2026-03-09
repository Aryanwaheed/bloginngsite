"use client";

import { trackEvent } from "@/lib/analytics";

export function TrackFindJobsClick({ children }: { children: React.ReactNode }) {
    return (
        <span onClick={() => trackEvent("find_jobs_click").catch(() => { })}>
            {children}
        </span>
    );
}

export function TrackCharacterSectionClick({ children }: { children: React.ReactNode }) {
    return (
        <span onClick={() => trackEvent("character_section_click").catch(() => { })}>
            {children}
        </span>
    );
}
