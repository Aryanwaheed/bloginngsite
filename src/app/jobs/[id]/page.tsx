import { createClient } from "../../../../../supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SiteNavbar from "@/components/site-navbar";
import SiteFooter from "@/components/site-footer";
import ApplyModal from "@/components/apply-modal";
import { MapPin, DollarSign, Calendar, Tag, ChevronLeft } from "lucide-react";

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!job) notFound();

  const { data: relatedJobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("category", job.category)
    .eq("is_active", true)
    .neq("id", job.id)
    .limit(3);

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-jakarta">
      <SiteNavbar />

      {/* Hero Banner */}
      <div className="relative h-72 md:h-96 w-full overflow-hidden">
        {job.image_url ? (
          <Image src={job.image_url} alt={job.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1A56DB] to-blue-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute bottom-6 left-0 right-0 px-4 sm:px-8 max-w-7xl mx-auto">
          <Link href="/jobs" className="inline-flex items-center gap-1 text-white/80 text-sm mb-3 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Jobs
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{job.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Metadata Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] mb-6 flex flex-wrap gap-4 border border-gray-100">
              <div className="flex items-center gap-2 text-sm">
                <Tag className="w-4 h-4 text-[#1A56DB]" />
                <span className="text-[#1C1917] font-medium">{job.category}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-[#6B7280]" />
                <span className="text-[#6B7280]">{job.location}</span>
              </div>
              {job.salary && (
                <div className="flex items-center gap-2 text-sm bg-amber-50 px-3 py-1 rounded-full">
                  <DollarSign className="w-4 h-4 text-[#F59E0B]" />
                  <span className="text-[#F59E0B] font-semibold">{job.salary}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-[#6B7280]" />
                <span className="text-[#6B7280]">
                  {new Date(job.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] mb-8 border border-gray-100">
              <h2 className="text-xl font-bold text-[#1C1917] mb-4">Job Description</h2>
              <div className="text-[#6B7280] leading-relaxed whitespace-pre-line">{job.description}</div>
            </div>

            {/* Apply CTA (Desktop) */}
            <div className="hidden md:block">
              <ApplyModal jobId={job.id} jobTitle={job.title} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100">
              <h3 className="font-bold text-[#1C1917] mb-2">Ready to Apply?</h3>
              <p className="text-[#6B7280] text-sm mb-4">Submit your application in just a few seconds.</p>
              <ApplyModal jobId={job.id} jobTitle={job.title} />
            </div>

            {/* Ad Slot */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 text-center min-h-48 flex items-center justify-center">
              <div className="text-[#6B7280] text-sm font-medium">📢 Advertisement</div>
            </div>
          </div>
        </div>

        {/* Related Jobs */}
        {relatedJobs && relatedJobs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#1C1917] mb-6">Related Jobs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedJobs.map((rj) => (
                <Link
                  key={rj.id}
                  href={`/jobs/${rj.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 border border-gray-50"
                >
                  {rj.image_url && (
                    <div className="relative h-36 overflow-hidden">
                      <Image src={rj.image_url} alt={rj.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-[#1C1917] mb-1 text-sm line-clamp-1">{rj.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                      <MapPin className="w-3 h-3" />{rj.location}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Apply */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 safe-area-bottom">
        <ApplyModal jobId={job.id} jobTitle={job.title} mobile />
      </div>

      <SiteFooter />
    </div>
  );
}
