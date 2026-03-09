import Link from "next/link";
import { Briefcase } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="bg-[#1C1917] text-gray-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#1A56DB] flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl text-white">WorkHub</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              Connecting people with opportunities. Find your next job or chat with AI virtual characters.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jobs" className="hover:text-white transition-colors">Find Jobs</Link></li>
              <li><Link href="/characters" className="hover:text-white transition-colors">AI Characters</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/ai-disclosure" className="hover:text-white transition-colors">AI Disclosure</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} WorkHub. All rights reserved.</p>
          <p className="text-sm text-gray-500">AI characters are virtual and not real people. <Link href="/ai-disclosure" className="underline hover:text-white">AI Disclosure</Link></p>
        </div>
      </div>
    </footer>
  );
}
