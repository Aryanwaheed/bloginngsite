"use client";

import { Share2 } from "lucide-react";

export default function ShareJobButton({ jobTitle }: { jobTitle: string }) {
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: jobTitle, url: window.location.href });
            } catch {
                // User cancelled
            }
        } else {
            await navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <button
            onClick={handleShare}
            className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-full px-4 py-2 text-sm font-medium hover:bg-white/30 transition-all flex-shrink-0"
        >
            <Share2 className="w-4 h-4" />
            Share
        </button>
    );
}
