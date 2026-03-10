"use client";

import { useEffect, useRef } from "react";

export default function BelowHeaderAd() {
    const adRef = useRef<HTMLDivElement>(null);
    const adLoaded = useRef(false);

    useEffect(() => {
        // @ts-ignore
        window.googletag = window.googletag || { cmd: [] };

        if (typeof window !== "undefined" && adRef.current && !adLoaded.current) {
            adLoaded.current = true;
            // @ts-ignore
            window.googletag.cmd.push(function () {
                // @ts-ignore
                window.googletag.display("div-gpt-ad-1772472477296-0");
            });
        }
    }, []);

    return (
        <div className="w-full flex justify-center bg-gray-50 py-4 border-b border-gray-100 mt-0">
            <div
                id="div-gpt-ad-1772472477296-0"
                ref={adRef}
                style={{ minWidth: "336px", minHeight: "280px" }}
            />
        </div>
    );
}
