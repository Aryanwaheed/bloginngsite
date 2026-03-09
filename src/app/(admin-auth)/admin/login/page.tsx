"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../../supabase/client";
import { Briefcase, Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setError("Invalid credentials. Please try again.");
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center p-4 font-jakarta">
      <div className="bg-[#1F2937] rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-[#374151]">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#1A56DB] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-gray-400 text-sm mt-1">WorkHub Dashboard</p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
            <div className="flex items-center gap-3 bg-[#111827] rounded-xl px-4 py-3 border border-[#374151] focus-within:border-[#1A56DB] transition-colors">
              <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="bg-transparent flex-1 text-sm text-gray-200 placeholder:text-gray-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
            <div className="flex items-center gap-3 bg-[#111827] rounded-xl px-4 py-3 border border-[#374151] focus-within:border-[#1A56DB] transition-colors">
              <Lock className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="bg-transparent flex-1 text-sm text-gray-200 placeholder:text-gray-600 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A56DB] text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-6">
          This page is for administrators only.
        </p>
      </div>
    </div>
  );
}
