import { createClient } from "../../../../supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SiteNavbar from "@/components/site-navbar";
import SiteFooter from "@/components/site-footer";
import ApplyModal from "@/components/apply-modal";
import ShareJobButton from "@/components/share-job-button";
import {
  MapPin,
  DollarSign,
  Calendar,
  Tag,
  ChevronLeft,
  CheckCircle2,
  Clock,
  Building2,
  Briefcase,
} from "lucide-react";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (!job) notFound();

  const { data: relatedJobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("category", job.category)
    .eq("is_active", true)
    .neq("id", job.id)
    .limit(3);

  // Parse bullet-point requirements from description (lines starting with - or •)
  const descriptionLines = (job.description || "").split("\n");
  const requirements = descriptionLines.filter(
    (l: string) => l.trim().startsWith("-") || l.trim().startsWith("•") || l.trim().startsWith("*")
  );
  const bodyText = descriptionLines
    .filter(
      (l: string) =>
        !l.trim().startsWith("-") && !l.trim().startsWith("•") && !l.trim().startsWith("*")
    )
    .join("\n")
    .trim();

  const postedDate = new Date(job.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-jakarta">
      <SiteNavbar />

      {/* Hero Banner */}
      <div className="relative h-72 md:h-96 w-full overflow-hidden">
        {job.image_url ? (
          <Image
            src={job.image_url}
            alt={job.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1A56DB] to-indigo-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="absolute bottom-6 left-0 right-0 px-4 sm:px-8 max-w-7xl mx-auto">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1 text-white/80 text-sm mb-3 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Jobs
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#1A56DB] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {job.category}
                </span>
                {job.is_active && (
                  <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Hiring
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {job.title}
              </h1>
            </div>
            <ShareJobButton jobTitle={job.title} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Metadata Bar */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] flex flex-wrap gap-5 border border-gray-100">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Tag className="w-4 h-4 text-[#1A56DB]" />
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]">Category</p>
                  <p className="font-semibold text-[#1C1917]">{job.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#6B7280]" />
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]">Location</p>
                  <p className="font-semibold text-[#1C1917]">{job.location || "Remote"}</p>
                </div>
              </div>

              {job.salary && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3AF]">Salary</p>
                    <p className="font-semibold text-[#F59E0B]">{job.salary}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-[#6B7280]" />
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]">Posted</p>
                  <p className="font-semibold text-[#1C1917]">{postedDate}</p>
                </div>
              </div>

              {job.job_type && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3AF]">Type</p>
                    <p className="font-semibold text-[#1C1917]">{job.job_type}</p>
                  </div>
                </div>
              )}

              {job.company && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3AF]">Company</p>
                    <p className="font-semibold text-[#1C1917]">{job.company}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-[#1A56DB] rounded-full" />
                <h2 className="text-xl font-bold text-[#1C1917]">Job Description</h2>
              </div>
              {bodyText ? (
                <div className="text-[#4B5563] leading-relaxed whitespace-pre-line text-[15px]">
                  {bodyText}
                </div>
              ) : (
                <div className="text-[#4B5563] leading-relaxed whitespace-pre-line text-[15px]">
                  {job.description}
                </div>
              )}
            </div>

            {/* Requirements (if extracted from description) */}
            {requirements.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1 h-6 bg-green-500 rounded-full" />
                  <h2 className="text-xl font-bold text-[#1C1917]">Requirements & Skills</h2>
                </div>
                <ul className="space-y-3">
                  {requirements.map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>
                      <span className="text-[#4B5563] text-[15px] leading-relaxed">
                        {req.replace(/^[-•*]\s*/, "").trim()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What to Expect */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-[#1A56DB]" />
                <h3 className="font-bold text-[#1C1917]">Application Process</h3>
              </div>
              <ol className="space-y-3">
                {[
                  "Submit your application using the Apply button",
                  "Our team reviews your application within 2-3 business days",
                  "If shortlisted, you will be contacted for an interview",
                  "Successful candidates receive an official offer",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#1A56DB] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-[#4B5563] text-sm leading-relaxed mt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Apply CTA (Desktop) */}
            <div className="hidden md:block">
              <ApplyModal jobId={job.id} jobTitle={job.title} applyUrl={job.apply_url || job.job_link || job.external_url} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Apply Card */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-green-600">Actively Hiring</span>
              </div>
              <h3 className="font-bold text-[#1C1917] text-lg mb-1">Ready to Apply?</h3>
              <p className="text-[#6B7280] text-sm mb-5">
                Submit your application in just a few seconds. Our team typically responds within 2-3 days.
              </p>
              <ApplyModal jobId={job.id} jobTitle={job.title} applyUrl={job.apply_url || job.job_link || job.external_url} />

              {/* Quick stats */}
              <div className="mt-5 pt-5 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#9CA3AF]">Category</span>
                  <span className="font-medium text-[#1C1917]">{job.category}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#9CA3AF]">Location</span>
                  <span className="font-medium text-[#1C1917]">{job.location || "Remote"}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#9CA3AF]">Salary</span>
                    <span className="font-semibold text-[#F59E0B]">{job.salary}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#9CA3AF]">Posted</span>
                  <span className="font-medium text-[#1C1917]">{postedDate}</span>
                </div>
              </div>
            </div>

            {/* Ad Slot */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 text-center min-h-48 flex flex-col items-center justify-center gap-2">
              <div className="text-2xl">📢</div>
              <div className="text-[#6B7280] text-sm font-medium">Advertisement</div>
              <div className="text-xs text-[#9CA3AF]">Your ad here</div>
            </div>

            {/* Share card */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100">
              <h3 className="font-semibold text-[#1C1917] mb-3 text-sm">Share this Job</h3>
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out this job: ${job.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors text-center"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Hiring: ${job.title} — Apply now!`)}&url=${encodeURIComponent(`https://yoursite.com/jobs/${job.id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#1DA1F2] hover:bg-sky-500 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors text-center"
                >
                  Twitter/X
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://yoursite.com/jobs/${job.id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#1877F2] hover:bg-blue-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors text-center"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Jobs */}
        {relatedJobs && relatedJobs.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm font-medium text-[#F59E0B] mb-1 uppercase tracking-wide">Similar Opportunities</p>
                <h2 className="text-2xl font-bold text-[#1C1917]">Related Jobs in {job.category}</h2>
              </div>
              <Link
                href={`/jobs?category=${job.category}`}
                className="text-sm font-medium text-[#1A56DB] hover:underline hidden sm:block"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedJobs.map((rj) => (
                <Link
                  key={rj.id}
                  href={`/jobs/${rj.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 border border-gray-50 group"
                >
                  {rj.image_url && (
                    <div className="relative h-36 overflow-hidden">
                      <Image
                        src={rj.image_url}
                        alt={rj.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <span className="absolute top-3 left-3 bg-[#1A56DB] text-white text-xs font-medium px-2.5 py-1 rounded-full">
                        {rj.category}
                      </span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-[#1C1917] mb-1 text-sm line-clamp-1">
                      {rj.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {rj.location}
                      </span>
                      {rj.salary && (
                        <span className="text-[#F59E0B] font-semibold">
                          {rj.salary}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Apply */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <ApplyModal jobId={job.id} jobTitle={job.title} mobile applyUrl={job.apply_url || job.job_link || job.external_url} />
      </div>

      <SiteFooter />
    </div>
  );
}
