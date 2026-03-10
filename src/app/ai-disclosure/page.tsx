import SiteNavbar from "@/components/site-navbar";
import SiteFooter from "@/components/site-footer";
import { Bot, AlertTriangle, Info, Heart } from "lucide-react";

export default function AIDisclosurePage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] font-jakarta">
      <SiteNavbar />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center">
            <Bot className="w-7 h-7 text-amber-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#1C1917]">AI Disclosure</h1>
            <p className="text-[#6B7280]">Important information about our Life Guiders</p>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10 flex gap-4">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-800 font-semibold text-sm mb-1">All Life Guiders on WorkHub are AI-generated</p>
            <p className="text-amber-700 text-sm leading-relaxed">They are not real people. Conversations are powered by artificial intelligence and do not represent the views of any real individual.</p>
          </div>
        </div>

        <div className="space-y-8">
          {[
            {
              icon: <Bot className="w-5 h-5 text-[#1A56DB]" />,
              title: "What are Life Guiders?",
              content: "Our Life Guiders are computer-generated personas powered by large language models. Each Life Guider has been given a unique personality, background, and conversational style. However, they do not possess consciousness, feelings, or real experiences."
            },
            {
              icon: <Info className="w-5 h-5 text-purple-500" />,
              title: "How the AI Works",
              content: "When you chat with a character, your messages are processed by an AI system that generates contextually relevant responses based on the character's defined personality. The AI may make mistakes and its responses should not be taken as professional advice."
            },
            {
              icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
              title: "Important Limitations",
              content: "Life Guiders cannot: provide medical, legal, or financial advice; verify information as factually accurate; form real emotional relationships; remember conversations between sessions (unless chat history is enabled); or represent real public figures or entities."
            },
            {
              icon: <Heart className="w-5 h-5 text-red-400" />,
              title: "Safe & Responsible Use",
              content: "Please use our AI chat features responsibly. Do not share sensitive personal information such as passwords, financial details, or government ID numbers. The AI is designed for entertainment and general conversation purposes only. If you are experiencing a mental health crisis, please contact appropriate professional services."
            },
          ].map((section) => (
            <div key={section.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                  {section.icon}
                </div>
                <h2 className="text-lg font-bold text-[#1C1917]">{section.title}</h2>
              </div>
              <p className="text-[#6B7280] leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
