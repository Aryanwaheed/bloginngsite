import { createClient } from "../../../../../supabase/server";
import CharactersManager from "./characters-manager";

export default async function AdminCharactersPage() {
  const supabase = await createClient();
  const { data: characters } = await supabase
    .from("ai_characters")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="p-6 md:p-8">
      <CharactersManager initialCharacters={characters || []} />
    </div>
  );
}
