import Link from "next/link";
import SiteNavbar from "@/components/site-navbar";
import SiteFooter from "@/components/site-footer";
import { Home, Briefcase, Bot, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#F7F5F0] font-jakarta flex flex-col">
            <SiteNavbar />

            <main className="flex-1 flex items-center justify-center px-4 py-20">
                <div className="text-center max-w-2xl mx-auto">

                    {/* Animated 404 Number */}
                    <div className="relative mb-8 select-none">
                        <div
                            className="text-[160px] sm:text-[220px] font-extrabold leading-none tracking-tighter"
                            style={{
                                background: "linear-gradient(135deg, #1A56DB 0%, #6366f1 50%, #F59E0B 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            404
                        </div>
                        {/* Floating blur blobs behind */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-100/60 rounded-full blur-3xl pointer-events-none -z-10" />
                        <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-amber-100/50 rounded-full blur-2xl pointer-events-none -z-10" />
                    </div>

                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] mb-6 border border-gray-100">
                        <Search className="w-8 h-8 text-[#1A56DB]" />
                    </div>

                    {/* Heading */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#1C1917] mb-4">
                        Page Not Found
                    </h1>
                    <p className="text-[#6B7280] text-lg mb-10 leading-relaxed">
                        Looks like this page doesn&apos;t exist or may have been moved.
                        <br />
                        Let&apos;s get you back on track.
                    </p>

                    {/* Quick Links */}
                    <div className="grid sm:grid-cols-3 gap-4 mb-10 max-w-lg mx-auto">
                        <Link
                            href="/"
                            className="group flex flex-col items-center gap-3 bg-white rounded-2xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 border border-gray-100"
                        >
                            <div className="w-11 h-11 bg-[#F7F5F0] rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                <Home className="w-5 h-5 text-[#1A56DB]" />
                            </div>
                            <span className="text-sm font-semibold text-[#1C1917]">Home</span>
                        </Link>

                        <Link
                            href="/jobs"
                            className="group flex flex-col items-center gap-3 bg-white rounded-2xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 border border-gray-100"
                        >
                            <div className="w-11 h-11 bg-[#F7F5F0] rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                <Briefcase className="w-5 h-5 text-[#1A56DB]" />
                            </div>
                            <span className="text-sm font-semibold text-[#1C1917]">Browse Jobs</span>
                        </Link>

                        <Link
                            href="/characters"
                            className="group flex flex-col items-center gap-3 bg-white rounded-2xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 border border-gray-100"
                        >
                            <div className="w-11 h-11 bg-[#F7F5F0] rounded-xl flex items-center justify-center group-hover:bg-amber-50 transition-colors">
                                <Bot className="w-5 h-5 text-[#F59E0B]" />
                            </div>
                            <span className="text-sm font-semibold text-[#1C1917]">AI Chat</span>
                        </Link>
                    </div>

                    {/* Go Back Button */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-[#1A56DB] text-white font-semibold px-7 py-3.5 rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
