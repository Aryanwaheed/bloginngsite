import { redirect } from "next/navigation";

// Visiting /chat without a character redirects to the character selection page
export default function ChatIndexPage() {
    redirect("/characters");
}
