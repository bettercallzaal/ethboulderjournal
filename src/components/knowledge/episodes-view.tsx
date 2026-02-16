"use client";

import { useMemo, useState } from "react";

import { Clock, Search } from "lucide-react";

import type { GraphNode } from "@/types/graph";
import {
  formatDate,
  parseEpisodeContent,
} from "@/components/graph-explorer/wiki/wiki-panel-utils";
import { buildEmbedUrl, buildShareText } from "@/lib/farcaster";
import { CastButton } from "./share-button";

interface EpisodesViewProps {
  episodes: GraphNode[];
  onSelect: (episode: GraphNode) => void;
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max).trimEnd() + "...";
}

export function EpisodesView({ episodes, onSelect }: EpisodesViewProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return episodes;
    const q = search.toLowerCase();
    return episodes.filter(
      (e) =>
        (e.name ?? "").toLowerCase().includes(q) ||
        (e.summary ?? "").toLowerCase().includes(q) ||
        (e.content ?? "").toLowerCase().includes(q),
    );
  }, [episodes, search]);

  return (
    <div>
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search episodes..."
          className="w-full bg-[#1a1d22] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[var(--brand-primary)]/50"
        />
      </div>

      {/* Count */}
      <div className="flex items-center gap-1.5 text-[10px] text-[#64748B] mb-3">
        <Clock className="w-3 h-3" />
        {filtered.length} episode{filtered.length !== 1 ? "s" : ""}
      </div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-[#64748B]">
          {search ? "No episodes match your search." : "No episodes yet. Add entries and process them."}
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />

          {filtered.map((ep) => {
            const parsed = parseEpisodeContent({
              uuid: ep.uuid!,
              name: ep.name,
              content: ep.content,
              valid_at: ep.valid_at,
            });
            const displayName = parsed.name || ep.name || "Untitled Episode";
            const displayContent = parsed.content || ep.summary || "";

            return (
              <div key={ep.uuid} className="relative pl-10 pb-5">
                {/* Timeline dot */}
                <div className="absolute left-[11px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--brand-primary)] border-2 border-[#0a0a0f]" />

                {/* Date */}
                {ep.valid_at && (
                  <span className="text-[10px] text-[#64748B]">
                    {formatDate(ep.valid_at)}
                  </span>
                )}

                {/* Card */}
                <button
                  onClick={() => onSelect(ep)}
                  className="mt-1 w-full text-left bg-[#1a1d22] border border-white/5 rounded-lg p-3 hover:border-[var(--brand-primary)]/30 transition-colors"
                >
                  <p className="text-xs font-medium text-white/90 mb-1">
                    {truncate(displayName, 100)}
                  </p>
                  {displayContent && (
                    <p className="text-[11px] text-[#94A3B8] line-clamp-3 leading-relaxed">
                      {truncate(displayContent, 200)}
                    </p>
                  )}
                </button>

                {/* Share */}
                <div className="mt-1.5 flex justify-end">
                  <CastButton
                    text={buildShareText(truncate(displayName, 200), "episode")}
                    embedUrl={buildEmbedUrl(ep.uuid)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
