"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        googletag: any;
    }
}

export default function GlobalAd() {
    useEffect(() => {
        // We run the google tag display command inside useEffect
        // which guarantees it runs only on the client AFTER hydration.
        if (typeof window !== "undefined") {
            try {
                window.googletag = window.googletag || { cmd: [] };
                window.googletag.cmd.push(function () {
                    window.googletag.display('div-gpt-ad-1772287373829-0');
                });
            } catch (err) {
                console.error("Error displaying Google Ad:", err);
            }
        }
    }, []);

    return (
        <div className="w-full flex justify-center py-2 relative z-50 overflow-hidden min-h-[250px] bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
            <div id='div-gpt-ad-1772287373829-0' style={{ minWidth: '250px', minHeight: '250px' }}>
            </div>
        </div>
    );
}
