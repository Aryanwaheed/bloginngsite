import Link from "next/link";
import Image from "next/image";
import { createClient } from "../../supabase/server";
import SiteNavbar from "@/components/site-navbar";
import SiteFooter from "@/components/site-footer";
import { TrackFindJobsClick, TrackCharacterSectionClick } from "@/components/track-clicks";
import { Briefcase, Bot, MapPin, DollarSign, TrendingUp, Users, Star, ChevronRight, ArrowRight } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();

  const { data: trendingJobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-jakarta">
      <SiteNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#F7F5F0] pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/60 via-[#F7F5F0] to-amber-50/40" />
          <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-blue-100/30 blur-3xl" />
          <div className="absolute bottom-0 left-20 w-72 h-72 rounded-full bg-amber-100/40 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/80 border border-blue-100 rounded-full px-4 py-1.5 text-sm font-medium text-[#1A56DB] mb-6 shadow-sm">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>500+ Jobs Listed · 10,000+ Users</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-[#1C1917] leading-tight mb-6">
              Find Work.<br />
              <span className="text-[#1A56DB]">Connect.</span>{" "}
              <span className="text-[#F59E0B]">Chat.</span>
            </h1>
            Browse hundreds of blue & white-collar jobs or engage with your own Life Guiders for an immersive chat experience.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <TrackFindJobsClick>
              <Link
                href="/jobs"
                className="order-2 md:order-1 group relative bg-white rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden block"
              >
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-blue-50 -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-100 transition-colors" />
                <div className="relative">
                  <div className="w-14 h-14 bg-[#1A56DB] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
                    <Briefcase className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#1C1917] mb-3">Find Jobs</h2>
                  <div className="text-[#6B7280] mb-6 leading-relaxed block">
                    Explore curated listings across cleaning, delivery, caregiving, trucking, office roles, and more.
                  </div>
                  <div className="flex items-center gap-2 text-[#1A56DB] font-semibold">
                    Browse Jobs
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </TrackFindJobsClick>

            <TrackCharacterSectionClick>
              <Link
                href="/characters"
                className="order-1 md:order-2 group relative bg-[#1C1917] rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 overflow-hidden block"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/women-who-lead.png"
                    alt="Life Guider Background"
                    fill
                    className="object-cover opacity-100 transition-opacity duration-300 mix-blend-normal grayscale-0"
                  />
                  {/* Dark gradient overlay moving bottom-to-top to make the text pop properly */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-[#000000]/30 to-transparent" />
                </div>

                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-amber-500/10 -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/20 transition-colors z-0" />

                <div className="relative z-10">
                  <div className="w-14 h-14 bg-[#F59E0B] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-200/40">
                    <Bot className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3 drop-shadow-sm">Your Own Life
                    Guider</h2>
                  <div className="text-gray-300 mb-6 leading-relaxed font-medium drop-shadow-md block">
                    Chat with unique personalities from around the world. Engaging, fun, and always available.
                  </div>
                  <div className="flex items-center gap-2 text-[#F59E0B] font-bold">
                    Meet Your Life Guider
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </TrackCharacterSectionClick>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white border-y border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "500+", label: "Jobs Listed", icon: Briefcase },
              { value: "10K+", label: "Active Users", icon: Users },
              { value: "8", label: "Job Categories", icon: Star },
              { value: "8", label: "Life Guiders", icon: Bot },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2">
                <stat.icon className="w-5 h-5 text-[#1A56DB]" />
                <div className="text-2xl font-bold text-[#1C1917]">{stat.value}</div>
                <div className="text-sm text-[#6B7280]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Jobs */}
      <section className="py-16 bg-[#F7F5F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-sm font-medium text-[#F59E0B] uppercase tracking-wide">Trending Now</span>
              </div>
              <h2 className="text-2xl font-bold text-[#1C1917]">Latest Job Listings</h2>
            </div>
            <Link href="/jobs" className="hidden sm:flex items-center gap-1 text-[#1A56DB] font-medium hover:underline text-sm">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(trendingJobs || []).map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 border border-gray-50"
              >
                {job.image_url && (
                  <div className="relative h-40 overflow-hidden">
                    <Image src={job.image_url} alt={job.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <span className="absolute top-3 left-3 bg-[#1A56DB] text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      {job.category}
                    </span>
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-semibold text-[#1C1917] mb-2 line-clamp-1">{job.title}</h3>
                  <div className="flex flex-wrap gap-2 text-xs text-[#6B7280]">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                    {job.salary && (
                      <span className="flex items-center gap-1 text-[#F59E0B] font-medium bg-amber-50 px-2 py-0.5 rounded-full">
                        <DollarSign className="w-3 h-3" />{job.salary}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#1C1917] mb-2">Browse by Category</h2>
            <p className="text-[#6B7280]">Find opportunities across all job types</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Cleaning", emoji: "🧹", color: "bg-green-50 border-green-100 hover:bg-green-100" },
              { label: "Caretaker", emoji: "❤️", color: "bg-red-50 border-red-100 hover:bg-red-100" },
              { label: "Nanny", emoji: "👶", color: "bg-pink-50 border-pink-100 hover:bg-pink-100" },
              { label: "Truck Driver", emoji: "🚛", color: "bg-orange-50 border-orange-100 hover:bg-orange-100" },
              { label: "Delivery", emoji: "📦", color: "bg-yellow-50 border-yellow-100 hover:bg-yellow-100" },
              { label: "Office", emoji: "💼", color: "bg-blue-50 border-blue-100 hover:bg-blue-100" },
            ].map((cat) => (
              <Link
                key={cat.label}
                href={`/jobs?category=${cat.label}`}
                className={`${cat.color} border rounded-2xl p-4 text-center transition-all duration-200 hover:-translate-y-0.5`}
              >
                <div className="text-3xl mb-2">{cat.emoji}</div>
                <div className="text-sm font-medium text-[#1C1917]">{cat.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
