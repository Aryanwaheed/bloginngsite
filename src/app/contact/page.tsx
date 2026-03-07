"use client";

import { useState } from "react";
import SiteNavbar from "@/components/site-navbar";
import SiteFooter from "@/components/site-footer";
import { Mail, MessageSquare, User, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, send to an API or email service
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-jakarta">
      <SiteNavbar />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1C1917] mb-3">Contact Us</h1>
          <p className="text-[#6B7280] leading-relaxed">Have a question or feedback? We'd love to hear from you.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-gray-100">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-[#1C1917] mb-2">Message Sent!</h3>
              <p className="text-[#6B7280]">We'll get back to you within 24 hours.</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                className="mt-6 text-[#1A56DB] font-medium hover:underline text-sm"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Full Name</label>
                  <div className="flex items-center gap-3 bg-[#F7F5F0] rounded-xl px-4 py-3 border border-transparent focus-within:border-[#1A56DB] transition-colors">
                    <User className="w-4 h-4 text-[#6B7280]" />
                    <input type="text" required value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="John Smith" className="bg-transparent flex-1 text-sm outline-none text-[#1C1917] placeholder:text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Email</label>
                  <div className="flex items-center gap-3 bg-[#F7F5F0] rounded-xl px-4 py-3 border border-transparent focus-within:border-[#1A56DB] transition-colors">
                    <Mail className="w-4 h-4 text-[#6B7280]" />
                    <input type="email" required value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="john@email.com" className="bg-transparent flex-1 text-sm outline-none text-[#1C1917] placeholder:text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Subject</label>
                <input type="text" required value={form.subject} onChange={(e) => setForm(p => ({ ...p, subject: e.target.value }))}
                  placeholder="What's this about?"
                  className="w-full bg-[#F7F5F0] rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-[#1A56DB] transition-colors text-[#1C1917] placeholder:text-gray-400" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Message</label>
                <div className="flex gap-3 bg-[#F7F5F0] rounded-xl px-4 py-3 border border-transparent focus-within:border-[#1A56DB] transition-colors">
                  <MessageSquare className="w-4 h-4 text-[#6B7280] flex-shrink-0 mt-0.5" />
                  <textarea required value={form.message} onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                    rows={5} placeholder="Tell us more..."
                    className="bg-transparent flex-1 text-sm outline-none text-[#1C1917] placeholder:text-gray-400 resize-none" />
                </div>
              </div>

              <button type="submit"
                className="w-full bg-[#1A56DB] text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-200">
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-[#6B7280]">
          Or email us directly at{" "}
          <a href="mailto:hello@workhub.com" className="text-[#1A56DB] font-medium hover:underline">hello@workhub.com</a>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
