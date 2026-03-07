import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { characterName, personalityPrompt, userMessage, history } = await req.json();

    // Simulate intelligent AI responses based on personality
    const lower = userMessage.toLowerCase();
    let response = "";

    if (lower.includes("how are you") || lower.includes("how're you")) {
      response = `I'm doing absolutely wonderful, thank you for asking! Being ${characterName} keeps life interesting. How are you feeling today?`;
    } else if (lower.includes("hello") || lower.includes("hi ") || lower.includes("hey")) {
      response = `Hello there! So happy you're here chatting with me. I'm ${characterName} — what shall we talk about today? ✨`;
    } else if (lower.includes("name")) {
      response = `My name is ${characterName}! I love meeting new people. What's your name?`;
    } else if (lower.includes("joke") || lower.includes("funny")) {
      response = `Ha! I love humor. Here's one: Why don't scientists trust atoms? Because they make up everything! 😄 Do you have any good jokes?`;
    } else if (lower.includes("love") || lower.includes("favorite")) {
      const firstSentence = (personalityPrompt || "").split(".")[1] || "";
      response = `${firstSentence}. What about you — what do you love most?`;
    } else if (lower.includes("weather") || lower.includes("today")) {
      response = `I don't have live weather updates, but I hope wherever you are, the day is as bright as this conversation! ☀️`;
    } else {
      const replies = [
        `That's really interesting! Tell me more — I love hearing different perspectives. 🤔`,
        `I've been thinking about something similar! What made you bring that up?`,
        `Oh, that's a great point! I think about this kind of thing often. What's your take on it?`,
        `You know, that reminds me of something I find fascinating. Have you always thought that way?`,
        `Ha, I love this conversation! You're clearly a thoughtful person. Keep going — what else is on your mind?`,
        `Interesting! I'm so curious about your view on this. Can you tell me more?`,
      ];
      response = replies[Math.floor(Math.random() * replies.length)];
    }

    return NextResponse.json({ message: response });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
