"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

type Character = {
  id: string;
  name: string;
  country: string;
  country_flag: string;
  tagline: string;
  personality_prompt: string;
  image_url: string;
};

export default function CharacterGrid({ characters }: { characters: Character[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {characters.map((char) => (
        <div
          key={char.id}
          className="group bg-white rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 border border-gray-50"
        >
          <div className="relative h-64 overflow-hidden">
            {char.image_url ? (
              <Image
                src={char.image_url}
                alt={char.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                <span className="text-6xl">{char.country_flag}</span>
              </div>
            )}
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

            {/* Always visible info */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{char.country_flag}</span>
                <h3 className="text-white font-bold text-lg">{char.name}</h3>
              </div>
              <p className="text-gray-300 text-sm">{char.tagline}</p>
            </div>

            {/* Hover overlay with description + CTA */}
            <div className="absolute inset-0 flex flex-col justify-center items-center p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-center mt-auto pt-10">
                <p className="text-white text-sm leading-relaxed line-clamp-4 mb-4">
                  {char.personality_prompt?.split(".")[0]}.
                </p>
                <Link
                  href={`/chat/${char.id}`}
                  className="inline-flex items-center gap-2 bg-[#1A56DB] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat Now
                </Link>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-[#6B7280]">Online · {char.country}</span>
            </div>
            <Link
              href={`/chat/${char.id}`}
              className="text-xs font-semibold text-[#1A56DB] hover:underline flex items-center gap-1"
            >
              Chat <span className="text-base">→</span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
