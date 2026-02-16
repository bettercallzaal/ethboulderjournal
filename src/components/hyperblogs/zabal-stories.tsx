"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Flame, Sparkles } from "lucide-react";

import { zabalPromptSuggestions } from "@/content/hyperblogs";
import { useSubdomainBonfire } from "@/contexts/SubdomainBonfireContext";
import { useDataRoomsInfiniteQuery } from "@/hooks";
import type { DataRoomInfo } from "@/types/api";

import { CreateBlogModal } from "./create-blog";

export function ZabalStories() {
  const router = useRouter();
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [createBlogOpen, setCreateBlogOpen] = useState(false);

  const { subdomainConfig, isSubdomainScoped } = useSubdomainBonfire();
  const bonfireId = isSubdomainScoped ? subdomainConfig?.bonfireId : undefined;

  const { data } = useDataRoomsInfiniteQuery({ pageSize: 4, bonfireId });

  const firstDataroom: DataRoomInfo | undefined = data?.pages?.[0]?.datarooms?.[0];

  function handlePromptClick(prompt: string) {
    setSelectedPrompt(prompt);
    if (firstDataroom) {
      setCreateBlogOpen(true);
    }
  }

  return (
    <>
      <div className="mt-6 mb-8 bg-gradient-to-r from-[var(--brand-primary)]/5 to-transparent border border-[var(--brand-primary)]/20 rounded-2xl p-5 lg:p-7">
        <div className="flex items-center gap-2.5 mb-2">
          <Flame className="w-5 h-5 text-[var(--brand-primary)]" />
          <h2 className="font-montserrat text-lg lg:text-2xl font-black">
            ZABAL Stories
          </h2>
          <Sparkles className="w-4 h-4 text-[var(--brand-primary)]/60" />
        </div>
        <p className="text-sm text-[#94A3B8] mb-4 max-w-2xl">
          Quick-start an AI-powered blog about ZABAL and ETH Boulder. Pick a
          theme below to open the blog creator with a pre-filled prompt.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {zabalPromptSuggestions.map((suggestion) => (
            <button
              key={suggestion.label}
              onClick={() => handlePromptClick(suggestion.prompt)}
              className="text-left bg-[#1a1d22]/80 border border-white/5 rounded-xl p-4 hover:border-[var(--brand-primary)]/30 hover:bg-[var(--brand-primary)]/5 transition-colors group"
            >
              <p className="text-sm font-medium text-white group-hover:text-[var(--brand-primary)] transition-colors mb-1.5">
                {suggestion.label}
              </p>
              <p className="text-[11px] text-[#64748B] line-clamp-2 leading-relaxed">
                {suggestion.prompt}
              </p>
            </button>
          ))}
        </div>

        {!firstDataroom && (
          <p className="text-[11px] text-[#64748B] mt-3">
            Loading topics... Pick a theme above once topics are available.
          </p>
        )}
      </div>

      {firstDataroom && (
        <CreateBlogModal
          isOpen={createBlogOpen}
          onClose={() => {
            setCreateBlogOpen(false);
            setSelectedPrompt(null);
          }}
          dataroomId={firstDataroom.id}
          dataroomTitle={firstDataroom.description}
          dataroomPriceUsd={firstDataroom.price_usd}
          onSuccess={(hyperblogId) => {
            setCreateBlogOpen(false);
            setSelectedPrompt(null);
            router.push(`/hyperblogs/${hyperblogId}`);
          }}
          initialPrompt={selectedPrompt ?? undefined}
        />
      )}
    </>
  );
}
