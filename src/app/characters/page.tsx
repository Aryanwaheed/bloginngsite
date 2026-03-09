import { createClient } from "../../../supabase/server";
import SiteNavbar from "@/components/site-navbar";
import SiteFooter from "@/components/site-footer";
import CharacterGrid from "./character-grid";

export default async function CharactersPage() {
  const supabase = await createClient();
  const { data: characters } = await supabase
    .from("ai_characters")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-jakarta">
      <SiteNavbar />

      {/* AI Disclosure Banner */}
      <div className="bg-amber-50 border-b border-amber-200 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3 text-sm text-amber-800">
          <span className="text-lg">🤖</span>
          <span>
            <strong>AI Disclosure:</strong> All characters on this platform are AI-generated virtual personas. They are not real people.{" "}
            <a href="/ai-disclosure" className="underline font-medium">Learn more</a>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1C1917] mb-3">AI Virtual Characters</h1>
          <p className="text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
            Meet our diverse roster of AI personalities from around the world. Each character has a unique personality, background, and conversational style.
          </p>
        </div>
        <CharacterGrid characters={characters || []} />
      </div>

      <SiteFooter />
    </div>
  );
}
