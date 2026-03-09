"use client";

import { useState, useEffect } from "react";
import { Briefcase, X, ExternalLink, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface Props {
  jobId: string;
  jobTitle: string;
  mobile?: boolean;
  applyUrl?: string; // URL to the external job posting (e.g. LinkedIn, Indeed)
}

export default function ApplyModal({ jobId, jobTitle, mobile, applyUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (open) {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      } else {
        // Countdown finished, open link and close modal
        const targetUrl = applyUrl || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(jobTitle)}`;
        window.open(targetUrl, "_blank", "noopener,noreferrer");
        setOpen(false);
        // Reset countdown for next time after a short delay
        setTimeout(() => setCountdown(5), 500);
      }
    }
    return () => clearTimeout(timer);
  }, [open, countdown, applyUrl, jobTitle]);

  const handleClose = () => {
    setOpen(false);
    setCountdown(5);
  };

  return (
    <>
      <button
        onClick={() => { setOpen(true); trackEvent("apply_now_click", { job_id: jobId, job_title: jobTitle }); }}
        className={`${mobile ? "w-full" : "w-full"} bg-[#1A56DB] text-white font-semibold py-3.5 px-6 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-200`}
      >
        <Briefcase className="w-4 h-4" />
        Apply Now
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

          {/* Modal */}
          <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md shadow-2xl z-10 overflow-hidden flex flex-col items-center p-8">
            <button onClick={handleClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-[#6B7280]" />
            </button>

            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <ExternalLink className="w-8 h-8 text-[#1A56DB]" />
            </div>

            <h3 className="font-bold text-[#1C1917] text-xl mb-2 text-center">Redirecting to Application</h3>
            <p className="text-[#6B7280] text-sm mb-6 text-center">
              You are being redirected to our partner platform to apply for <span className="font-medium text-gray-800">{jobTitle}</span>.
            </p>

            {/* Ad Banner inside Modal */}
            <div className="w-full bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex flex-col items-center justify-center min-h-[120px] shadow-inner relative overflow-hidden">
              <div className="absolute top-0 left-0 bg-blue-200/50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-br-lg uppercase tracking-wider">
                Advertisement
              </div>
              <div className="text-3xl mb-2">🚀</div>
              <div className="font-semibold text-blue-900 text-sm text-center">Boost Your Career Today</div>
              <div className="text-xs text-blue-700/80 text-center mt-1">Discover premium courses and certifications.</div>
            </div>

            <div className="flex items-center gap-3 text-sm font-medium text-[#1A56DB] bg-blue-50 py-2 px-4 rounded-full">
              <Loader2 className="w-4 h-4 animate-spin" />
              Redirecting in {countdown} seconds...
            </div>

            <button
              // Allow immediate redirect if user doesn't want to wait
              onClick={() => setCountdown(0)}
              className="mt-6 text-xs text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors"
            >
              Click here if you are not redirected
            </button>
          </div>
        </div>
      )}
    </>
  );
}
