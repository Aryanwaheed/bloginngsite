"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { createClient } from "../../../supabase/client";
import { Search, MapPin, DollarSign, SlidersHorizontal } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type Job = {
  id: string;
  title: string;
  category: string;
  location: string;
  salary: string;
  description: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
};

const CATEGORIES = ["All", "Cleaning", "Caretaker", "Nanny", "Truck Driver", "Delivery", "Office"];

export default function JobsClient({ initialJobs }: { initialJobs: Job[] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [activeCategories, setActiveCategories] = useState<string[]>(
    initialCategory !== "All" ? [initialCategory] : []
  );
  const [loading, setLoading] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase.from("jobs").select("*").eq("is_active", true);

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }
    if (location) {
      query = query.ilike("location", `%${location}%`);
    }
    if (activeCategories.length > 0) {
      query = query.in("category", activeCategories);
    }

    const { data } = await query.order("created_at", { ascending: false });
    setJobs(data || []);
    setLoading(false);
  }, [search, location, activeCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchJobs]);

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("jobs-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "jobs" }, () => {
        fetchJobs();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchJobs]);

  const toggleCategory = (cat: string) => {
    if (cat === "All") {
      setActiveCategories([]);
      return;
    }
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1C1917] mb-1">Job Board</h1>
        <p className="text-[#6B7280]">{jobs.length} jobs available</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-4 mb-6 flex flex-col sm:flex-row gap-3 border border-gray-100">
        <div className="flex-1 flex items-center gap-3 bg-[#F7F5F0] rounded-xl px-4 py-2.5">
          <Search className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent flex-1 text-sm text-[#1C1917] placeholder:text-[#9CA3AF] outline-none"
          />
        </div>
        <div className="flex-1 flex items-center gap-3 bg-[#F7F5F0] rounded-xl px-4 py-2.5">
          <MapPin className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
          <input
            type="text"
            placeholder="Filter by location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-transparent flex-1 text-sm text-[#1C1917] placeholder:text-[#9CA3AF] outline-none"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const isActive = cat === "All" ? activeCategories.length === 0 : activeCategories.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                ? "bg-[#1A56DB] text-white shadow-md shadow-blue-200"
                : "bg-white text-[#6B7280] border border-gray-200 hover:border-[#1A56DB] hover:text-[#1A56DB]"
                }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="h-44 bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-[#1C1917] mb-2">No jobs found</h3>
          <p className="text-[#6B7280]">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job, index) => (
            <React.Fragment key={job.id}>
              <Link
                href={`/jobs/${job.id}`}
                onClick={() => trackEvent("job_view", { job_id: job.id, job_title: job.title, category: job.category })}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 border border-gray-50 group"
              >
                {job.image_url && (
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={job.image_url}
                      alt={job.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <span className="absolute top-3 left-3 bg-[#1A56DB] text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      {job.category}
                    </span>
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-semibold text-[#1C1917] mb-3 line-clamp-1 text-base">{job.title}</h3>
                  <p className="text-[#6B7280] text-sm line-clamp-2 mb-4 leading-relaxed">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </span>
                    {job.salary && (
                      <span className="flex items-center gap-1 text-xs text-[#F59E0B] font-semibold bg-amber-50 px-2.5 py-1 rounded-full">
                        <DollarSign className="w-3 h-3" />
                        {job.salary}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
              {/* Ad slot every 6 jobs */}
              {(index + 1) % 6 === 0 && index !== jobs.length - 1 && (
                <div key={`ad-${index}`} className="sm:col-span-2 lg:col-span-3 bg-gradient-to-r from-blue-50 to-amber-50 rounded-2xl p-6 flex items-center justify-center text-center border border-blue-100 min-h-[80px]">
                  <div className="text-[#6B7280] text-sm font-medium">📢 Advertisement Slot</div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
