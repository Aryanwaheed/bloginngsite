"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Briefcase, Bot, Menu, X, ChevronRight, Home, Search, MessageSquare } from "lucide-react";
import BelowHeaderAd from "@/components/below-header-ad";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function SiteNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/jobs", label: "Find Jobs" },
    { href: "/characters", label: "Life Guider" },
  ];

  return (
    <>
      <header className="w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1A56DB] flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl text-[#1C1917]">WorkHub</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${pathname?.startsWith(link.href)
                    ? "text-[#1A56DB]"
                    : "text-[#6B7280] hover:text-[#1C1917]"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  className="md:hidden p-2 rounded-lg text-[#6B7280] hover:bg-gray-100 flex items-center gap-2"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" />
                  <span className="text-sm font-medium">Menu</span>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l-0 p-0">
                <div className="flex flex-col h-full bg-white">
                  <SheetHeader className="p-6 border-b border-gray-100 text-left">
                    <SheetTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#1A56DB] flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-bold text-xl text-[#1C1917]">WorkHub</span>
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-2 p-6">
                    {links.map((link) => {
                      const Icon = link.label === "Find Jobs" ? Search : MessageSquare;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center justify-between p-4 rounded-xl text-lg font-semibold transition-all ${pathname?.startsWith(link.href)
                            ? "bg-blue-50 text-[#1A56DB]"
                            : "text-[#1C1917] hover:bg-gray-50"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 opacity-70" />
                            {link.label}
                          </div>
                          <ChevronRight className="w-5 h-5 opacity-50" />
                        </Link>
                      );
                    })}
                  </nav>
                  <div className="mt-auto p-6 border-t border-gray-100">
                    <p className="text-sm text-[#6B7280] text-center">
                      © {new Date().getFullYear()} WorkHub. All rights reserved.
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <BelowHeaderAd />
    </>
  );
}
