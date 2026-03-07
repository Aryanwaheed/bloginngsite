import { createClient } from "../../../../../supabase/server";
import { notFound } from "next/navigation";
import ChatInterface from "./chat-interface";

export default async function ChatPage({ params }: { params: { characterId: string } }) {
  const supabase = await createClient();
  const { data: character } = await supabase
    .from("ai_characters")
    .select("*")
    .eq("id", params.characterId)
    .single();

  if (!character) notFound();

  return <ChatInterface character={character} />;
}
