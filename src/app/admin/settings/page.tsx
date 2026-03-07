"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../../../../../supabase/client";
import { LogOut, Settings } from "lucide-react";

export default function AdminSettingsPage() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your admin account and platform settings</p>
      </div>

      <div className="space-y-4 max-w-2xl">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Platform Settings</h3>
              <p className="text-sm text-gray-500">Configure your WorkHub platform</p>
            </div>
          </div>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span>Platform Name</span>
              <span className="font-medium text-gray-900">WorkHub</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span>Database</span>
              <span className="text-green-600 font-medium flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400" /> Connected
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span>Realtime Updates</span>
              <span className="text-green-600 font-medium flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400" /> Enabled
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Account</h3>
              <p className="text-sm text-gray-500">Sign out of your admin account</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-50 text-red-600 hover:bg-red-100 transition-colors px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
