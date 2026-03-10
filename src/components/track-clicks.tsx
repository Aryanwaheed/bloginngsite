"use client";

import { trackEvent } from "@/lib/analytics";

export function TrackFindJobsClick({ children }: { children: React.ReactNode }) {
    return (
        <div onClick={() => trackEvent("find_jobs_click").catch(() => { })}>
            {children}
        </div>
    );
}

export function TrackCharacterSectionClick({ children }: { children: React.ReactNode }) {
    return (
        <div onClick={() => trackEvent("character_section_click").catch(() => { })}>
            {children}
        </div>
    );
}
