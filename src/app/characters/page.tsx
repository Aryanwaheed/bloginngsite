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
            <strong>AI Disclosure:</strong> All Life Guiders on this platform are AI-generated virtual personas. They are not real people.{" "}
            <a href="/ai-disclosure" className="underline font-medium">Learn more</a>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <CharacterGrid characters={characters || []} />
      </div>

      <SiteFooter />
    </div>
  );
}
