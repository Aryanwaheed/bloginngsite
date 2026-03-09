"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../../supabase/client";
import { Save, AlertCircle, CheckCircle2, Key, Bot, Settings2 } from "lucide-react";

export default function SettingsForm() {
    const [provider, setProvider] = useState("openrouter");
    const [apiKey, setApiKey] = useState("");
    const [model, setModel] = useState("openrouter/free");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

    useEffect(() => {
        async function loadSettings() {
            const supabase = createClient();
            const { data, error } = await supabase.from("site_settings").select("*");

            if (!error && data) {
                data.forEach((setting) => {
                    if (setting.key === "ai_api_provider") setProvider(setting.value);
                    if (setting.key === "ai_api_key") setApiKey(setting.value);
                    if (setting.key === "ai_model") setModel(setting.value);
                });
            }
            setLoading(false);
        }
        loadSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setStatus({ type: null, message: "" });

        const supabase = createClient();

        // Upsert all settings
        const updates = [
            { key: "ai_api_provider", value: provider },
            { key: "ai_api_key", value: apiKey },
            { key: "ai_model", value: model },
        ];

        const { error } = await supabase.from("site_settings").upsert(updates);

        setSaving(false);

        if (error) {
            setStatus({ type: "error", message: "Failed to save settings: " + error.message });
        } else {
            setStatus({ type: "success", message: "Settings saved successfully! AI chat will now use these configurations." });
            // Clear status after 3 seconds
            setTimeout(() => setStatus({ type: null, message: "" }), 4000);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <div className="w-8 h-8 border-4 border-[#1A56DB] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#1A56DB]">
                    <Settings2 className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">AI Chat Configuration</h2>
                    <p className="text-sm text-gray-500">Manage the AI provider and API keys for character chats.</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
                {status.type && (
                    <div className={`p-4 rounded-xl flex items-start gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                        {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                        <p className="text-sm font-medium">{status.message}</p>
                    </div>
                )}

                {/* Provider Selection */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">AI Provider</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setProvider("google")}
                            className={`p-4 rounded-xl border-2 text-left flex flex-col gap-1 transition-all ${provider === "google"
                                ? "border-[#1A56DB] bg-blue-50/50"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                                }`}
                        >
                            <div className="flex items-center justify-between w-full mb-1">
                                <span className="font-bold text-gray-900">Google Gemini</span>
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${provider === "google" ? "border-[#1A56DB]" : "border-gray-300"}`}>
                                    {provider === "google" && <div className="w-2 h-2 rounded-full bg-[#1A56DB]" />}
                                </div>
                            </div>
                            <span className="text-xs text-gray-500">Standard Gemini models</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setProvider("openrouter")}
                            className={`p-4 rounded-xl border-2 text-left flex flex-col gap-1 transition-all ${provider === "openrouter"
                                ? "border-[#1A56DB] bg-blue-50/50"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                                }`}
                        >
                            <div className="flex items-center justify-between w-full mb-1">
                                <span className="font-bold text-gray-900">OpenRouter (Pro)</span>
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${provider === "openrouter" ? "border-[#1A56DB]" : "border-gray-300"}`}>
                                    {provider === "openrouter" && <div className="w-2 h-2 rounded-full bg-[#1A56DB]" />}
                                </div>
                            </div>
                            <span className="text-xs text-gray-500">Access to all top models</span>
                        </button>
                    </div>
                </div>

                {/* API Key Input */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">API Key</label>
                    <p className="text-xs text-gray-500 mb-2">
                        Enter your {provider === 'google' ? 'Google AI Studio' : 'OpenRouter'} API Key. Leave blank to fallback to environment variables.
                    </p>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Key className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder={`sk-or-v1-...`}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/20 focus:border-[#1A56DB] transition-all"
                        />
                    </div>
                </div>

                {/* Model Input */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Model Name</label>
                    <p className="text-xs text-gray-500 mb-2">
                        The exact model identifier to use.
                        <br />For OpenRouter (Free): <code>openrouter/free</code> (Auto-selects best free model) or <code>google/gemini-2.0-flash-lite-preview-02-05:free</code>
                        <br />For Google: <code>gemini-pro</code> or <code>gemini-1.5-flash-latest</code>
                    </p>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Bot className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            placeholder={provider === "openrouter" ? "openrouter/free" : "gemini-pro"}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/20 focus:border-[#1A56DB] transition-all"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-[#1A56DB] hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all shadow-sm shadow-blue-200 disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {saving ? "Saving..." : "Save Settings"}
                    </button>
                </div>
            </form>
        </div>
    );
}
