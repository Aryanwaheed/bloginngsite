"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Send, MoreVertical } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type Character = {
  id: string;
  name: string;
  country: string;
  country_flag: string;
  tagline: string;
  personality_prompt: string;
  image_url: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const SESSION_ID = `session_${Math.random().toString(36).slice(2)}`;

export default function ChatInterface({ character }: { character: Character }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Track chat session start
  useEffect(() => {
    trackEvent("chat_session_start", { character_id: character.id, character_name: character.name }).catch(() => { });
  }, [character.id, character.name]);

  // Load chat history and message count from local storage
  useEffect(() => {
    const savedMessages = localStorage.getItem(`workhub_chat_${character.id}`);
    const savedCount = localStorage.getItem(`workhub_total_messages`);

    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      } catch (e) {
        console.error("Failed to parse saved messages", e);
      }
    } else {
      // Default welcome message if no history
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: `Hi there! I'm ${character.name} ${character.country_flag} — ${character.tagline}. It's so lovely to meet you! What's on your mind today? 😊`,
          timestamp: new Date(),
        },
      ]);
    }

    if (savedCount) {
      setMessageCount(parseInt(savedCount, 10));
    }
  }, [character.id, character.name, character.country_flag, character.tagline]);

  // Save chat history to local storage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`workhub_chat_${character.id}`, JSON.stringify(messages));
    }
  }, [messages, character.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const getAIResponse = async (userMessage: string): Promise<string> => {
    // Silent limit check: if count >= 10, use dummy response
    if (messageCount >= 10) {
      console.log("Limit reached, using dummy response");
      return generateFallbackResponse(character, userMessage);
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId: character.id,
          characterName: character.name,
          personalityPrompt: character.personality_prompt,
          sessionId: SESSION_ID,
          userMessage,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error("API failed");
      const data = await response.json();

      // Update global message count on success
      const newCount = messageCount + 1;
      setMessageCount(newCount);
      localStorage.setItem("workhub_total_messages", newCount.toString());

      return data.message || generateFallbackResponse(character, userMessage);
    } catch {
      return generateFallbackResponse(character, userMessage);
    }
  };

  const generateFallbackResponse = (char: Character, userMsg: string): string => {
    const lower = userMsg.toLowerCase();

    // More natural dummy responses
    if (lower.includes("how are you") || lower.includes("how're you")) {
      return `I'm doing wonderful, thank you for asking! ${char.country_flag} Life in ${char.country} is always so exciting. How are you doing today?`;
    }
    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      return `Hello! So great to hear from you! I'm ${char.name}, and I'm all ears. What would you like to chat about? ✨`;
    }
    if (lower.includes("name")) {
      return `My name is ${char.name}! I'm from ${char.country} ${char.country_flag}. ${char.tagline}. Nice to meet you!`;
    }
    if (lower.includes("where are you from") || lower.includes("country")) {
      return `I'm from ${char.country}! ${char.country_flag} It's a beautiful place with so much culture and life. Have you ever been there or would you like to know more about it?`;
    }
    if (lower.includes("what do you like") || lower.includes("hobby") || lower.includes("interests")) {
      const prompt = char.personality_prompt || "";
      const firstSentence = prompt.split(".")[1] || "";
      return `Oh, I love so many things! ${firstSentence}. What about you? What are your passions?`;
    }

    const responses = [
      `That's such an interesting thought! Tell me more about that. 🤔`,
      `I love talking about this! From my perspective in ${char.country}, I think it's fascinating. What do you think?`,
      `Ha, you make a great point! I've been thinking about something similar lately. ${char.country_flag}`,
      `Oh really? That's so interesting! I never looked at it that way before. Can you elaborate?`,
      `You know, we have a saying in ${char.country} about this... well, maybe not exactly, but I think it applies! 😄`,
      `I appreciate you sharing that with me. It's the kind of conversation I truly enjoy having. What else is on your mind?`,
      `I totally understand where you're coming from. It's a journey, isn't it?`,
      `That's a very unique way of putting it! i like how you think.`,
      `Tell me, do you often think about things like this? It's really refreshing to talk to someone so thoughtful.`,
      `I'm really enjoying our chat! You have such a vibrant energy.`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Track user message sent
    trackEvent("chat_message_sent", { character_id: character.id, character_name: character.name }).catch(() => { });

    const aiText = await getAIResponse(userMessage.content);

    // Simulate typing delay
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiText,
      timestamp: new Date(),
    };

    // Track AI response generated
    trackEvent("chat_ai_response", { character_id: character.id, character_name: character.name }).catch(() => { });

    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0F1117] relative">
      {/* Dark background image of the character */}
      {character.image_url && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <Image src={character.image_url} alt="background" fill className="object-cover opacity-20 blur-sm" />
          <div className="absolute inset-0 bg-[#0F1117]/80" />
        </div>
      )}

      {/* Chat Header */}
      <div className="relative z-10 flex items-center gap-4 px-4 py-3 bg-[#0F1117]/80 backdrop-blur-md border-b border-[#1E2433] shadow-lg">
        <Link href="/characters" className="p-2 rounded-full hover:bg-[#1E2433] transition-colors text-gray-400 hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <div className="flex items-center gap-3 flex-1">
          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            {character.image_url ? (
              <Image src={character.image_url} alt={character.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl">
                {character.country_flag}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm">{character.name}</span>
              <span>{character.country_flag}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-gray-400">Online · AI Virtual Character</span>
            </div>
          </div>
        </div>

        <button className="p-2 rounded-full hover:bg-[#1E2433] transition-colors text-gray-400">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* AI Disclosure */}
      <div className="relative z-10 bg-amber-900/20 backdrop-blur-sm border-b border-amber-800/30 px-4 py-2 text-center">
        <p className="text-xs text-amber-400">🤖 This is an AI-powered virtual character. Not a real person.</p>
      </div>

      {/* Top Ad Banner (Mobile Friendly) */}
      <div className="relative z-10 w-full bg-[#0F1117] border-b border-[#1E2433] p-2 flex justify-center items-center shadow-lg flex-shrink-0">
        <div className="text-center w-full max-w-sm bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-purple-900/30 rounded-lg py-2 px-3 border border-blue-500/20 flex flex-col items-center justify-center">
          <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1">Advertisement</span>
          <div className="w-full flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center">
              <span className="text-lg">✨</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-gray-200">Featured Ad Placement</span>
              <span className="text-[10px] text-gray-400">Click to learn more</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* Dot grid background */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mr-2 mt-1">
                {character.image_url ? (
                  <Image src={character.image_url} alt={character.name} width={32} height={32} className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm">
                    {character.country_flag}
                  </div>
                )}
              </div>
            )}
            <div className={`max-w-xs lg:max-w-md`}>
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                  ? "bg-[#1A56DB] text-white rounded-br-sm"
                  : "bg-[#1E2433] text-[#E2E8F0] rounded-bl-sm"
                  }`}
              >
                {msg.content}
              </div>
              <p className={`text-xs text-gray-600 mt-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-in fade-in">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mr-2 mt-1">
              {character.image_url ? (
                <Image src={character.image_url} alt={character.name} width={32} height={32} className="object-cover" />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full" />
              )}
            </div>
            <div className="bg-[#1E2433] px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="relative z-10 bg-[#0F1117]/80 backdrop-blur-md border-t border-[#1E2433] px-4 py-3 pb-safe">
        <div className="flex items-center gap-3 bg-[#1E2433] rounded-2xl px-4 py-2 max-w-4xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${character.name}...`}
            className="flex-1 bg-transparent text-[#E2E8F0] placeholder:text-gray-600 text-sm outline-none py-1.5"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-9 h-9 rounded-xl bg-[#1A56DB] flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
