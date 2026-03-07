"use client";

import { useState } from "react";
import { createClient } from "../../supabase/client";
import { Briefcase, X, CheckCircle, Phone, User, MessageSquare } from "lucide-react";

interface Props {
  jobId: string;
  jobTitle: string;
  mobile?: boolean;
}

export default function ApplyModal({ jobId, jobTitle, mobile }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!phone.trim()) errs.phone = "Phone number is required";
    else if (!/^[\d\s\-\+\(\)]+$/.test(phone)) errs.phone = "Invalid phone number";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("applications").insert({
      job_id: jobId,
      name,
      phone,
      message,
    });

    setLoading(false);
    if (!error) {
      setSuccess(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSuccess(false);
    setName("");
    setPhone("");
    setMessage("");
    setErrors({});
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`${mobile ? "w-full" : "w-full"} bg-[#1A56DB] text-white font-semibold py-3.5 px-6 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-200`}
      >
        <Briefcase className="w-4 h-4" />
        Apply Now
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

          {/* Modal */}
          <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md shadow-2xl z-10 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-[#1C1917] text-lg">Apply for Position</h3>
                <p className="text-[#6B7280] text-sm mt-0.5 line-clamp-1">{jobTitle}</p>
              </div>
              <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>

            <div className="p-6">
              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-xl font-bold text-[#1C1917] mb-2">Application Sent!</h4>
                  <p className="text-[#6B7280] mb-6">We've received your application and will be in touch soon.</p>
                  <button
                    onClick={handleClose}
                    className="bg-[#1A56DB] text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Full Name *</label>
                    <div className={`flex items-center gap-3 bg-[#F7F5F0] rounded-xl px-4 py-3 border ${errors.name ? "border-red-400" : "border-transparent"} focus-within:border-[#1A56DB] transition-colors`}>
                      <User className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                        placeholder="John Smith"
                        className="bg-transparent flex-1 text-sm text-[#1C1917] placeholder:text-[#9CA3AF] outline-none"
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Phone Number *</label>
                    <div className={`flex items-center gap-3 bg-[#F7F5F0] rounded-xl px-4 py-3 border ${errors.phone ? "border-red-400" : "border-transparent"} focus-within:border-[#1A56DB] transition-colors`}>
                      <Phone className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: "" })); }}
                        placeholder="+1 (555) 000-0000"
                        className="bg-transparent flex-1 text-sm text-[#1C1917] placeholder:text-[#9CA3AF] outline-none"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Message (optional)</label>
                    <div className="flex gap-3 bg-[#F7F5F0] rounded-xl px-4 py-3 border border-transparent focus-within:border-[#1A56DB] transition-colors">
                      <MessageSquare className="w-4 h-4 text-[#6B7280] flex-shrink-0 mt-0.5" />
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us why you're a great fit..."
                        rows={3}
                        className="bg-transparent flex-1 text-sm text-[#1C1917] placeholder:text-[#9CA3AF] outline-none resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1A56DB] text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
