"use client";

import { useState } from "react";
import { createClient } from "../../../../../supabase/client";
import { Megaphone, ToggleLeft, ToggleRight } from "lucide-react";

type Ad = {
  id: string;
  slot_name: string;
  is_active: boolean;
  ad_code: string | null;
};

const slotLabels: Record<string, { label: string; description: string; location: string }> = {
  homepage_banner: { label: "Homepage Banner", description: "Horizontal ad below hero section", location: "Homepage" },
  jobboard_interstitial: { label: "Job Board Interstitial", description: "Injected every 6 job cards", location: "Job Board" },
  jobboard_sidebar: { label: "Job Board Sidebar", description: "Sticky right-rail on desktop", location: "Job Board" },
  jobdetail_sidebar: { label: "Job Detail Sidebar", description: "Right-rail ad on job detail pages", location: "Job Detail" },
};

export default function AdsManager({ initialAds }: { initialAds: Ad[] }) {
  const [ads, setAds] = useState<Ad[]>(initialAds);
  const [saving, setSaving] = useState<string | null>(null);

  const handleToggle = async (ad: Ad) => {
    setSaving(ad.id);
    const supabase = createClient();
    const { data } = await supabase
      .from("ad_placements")
      .update({ is_active: !ad.is_active, updated_at: new Date().toISOString() })
      .eq("id", ad.id)
      .select()
      .single();
    if (data) setAds((prev) => prev.map((a) => (a.id === data.id ? data : a)));
    setSaving(null);
  };

  const handleCodeSave = async (ad: Ad, code: string) => {
    const supabase = createClient();
    await supabase.from("ad_placements").update({ ad_code: code }).eq("id", ad.id);
    setAds((prev) => prev.map((a) => (a.id === ad.id ? { ...a, ad_code: code } : a)));
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Ad Placements</h1>
        <p className="text-gray-500 text-sm mt-1">Manage ad slots across the platform</p>
      </div>

      <div className="space-y-4">
        {ads.map((ad) => {
          const meta = slotLabels[ad.slot_name] || { label: ad.slot_name, description: "", location: "" };
          return (
            <div key={ad.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Megaphone className="w-5 h-5 text-[#F59E0B]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{meta.label}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{meta.description}</p>
                    <span className="text-xs bg-blue-50 text-[#1A56DB] px-2 py-0.5 rounded-full mt-1 inline-block">{meta.location}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(ad)}
                  disabled={saving === ad.id}
                  className="flex items-center gap-2 flex-shrink-0"
                >
                  {ad.is_active ? (
                    <>
                      <ToggleRight className="w-8 h-8 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">Active</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-8 h-8 text-gray-300" />
                      <span className="text-sm text-gray-400 font-medium">Inactive</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Ad Code / Script (optional)</label>
                <textarea
                  defaultValue={ad.ad_code || ""}
                  onBlur={(e) => handleCodeSave(ad, e.target.value)}
                  rows={3}
                  placeholder="<!-- Paste your Google AdSense or other ad code here -->"
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-xs font-mono text-gray-600 outline-none border border-transparent focus:border-[#1A56DB] transition-colors resize-none"
                />
              </div>
            </div>
          );
        })}

        {ads.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <div className="text-5xl mb-4">📢</div>
            <p className="text-gray-500">No ad slots configured</p>
          </div>
        )}
      </div>
    </>
  );
}
