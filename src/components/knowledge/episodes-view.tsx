"use client";

import { useMemo, useState } from "react";

import { Clock, Grid3X3, List, Search, AlignLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { GraphNode } from "@/types/graph";
import {
  formatDate,
  parseEpisodeContent,
} from "@/components/graph-explorer/wiki/wiki-panel-utils";
import { buildEmbedUrl, buildShareText } from "@/lib/farcaster";
import { CastButton } from "./share-button";

type ViewMode = "timeline" | "cards" | "list";

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
  const [viewMode, setViewMode] = useState<ViewMode>("timeline");

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
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search episodes..."
            className="w-full bg-[#1a1d22] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[var(--brand-primary)]/50"
          />
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-[#1a1d22] border border-white/10 rounded-lg overflow-hidden">
          {([
            { mode: "timeline" as ViewMode, icon: AlignLeft, title: "Timeline" },
            { mode: "cards" as ViewMode, icon: Grid3X3, title: "Cards" },
            { mode: "list" as ViewMode, icon: List, title: "List" },
          ]).map(({ mode, icon: Icon, title }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              title={title}
              className={`p-2 transition-colors ${
                viewMode === mode
                  ? "bg-[var(--brand-primary)]/20 text-[var(--brand-primary)]"
                  : "text-[#64748B] hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="flex items-center gap-1.5 text-[10px] text-[#64748B] mb-3">
        <Clock className="w-3 h-3" />
        {filtered.length} episode{filtered.length !== 1 ? "s" : ""}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-[#64748B]">
          {search ? "No episodes match your search." : "No episodes yet. Add entries and process them."}
        </div>
      ) : viewMode === "timeline" ? (
        /* ─── Timeline View ─── */
        <div className="relative">
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
                <div className="absolute left-[11px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--brand-primary)] border-2 border-[#0a0a0f]" />
                {ep.valid_at && (
                  <span className="text-[10px] text-[#64748B]">
                    {formatDate(ep.valid_at)}
                  </span>
                )}
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
                <div className="mt-1.5 flex justify-end">
                  <CastButton
                    text={buildShareText(truncate(displayName, 200), "episode")}
                    embedUrl={buildEmbedUrl({
                      uuid: ep.uuid,
                      name: displayName,
                      type: "episode",
                      summary: displayContent,
                    })}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : viewMode === "cards" ? (
        /* ─── Cards View ─── */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
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
              <button
                key={ep.uuid}
                onClick={() => onSelect(ep)}
                className="bg-[#1a1d22] border border-white/5 rounded-lg p-4 hover:border-[var(--brand-primary)]/30 transition-colors text-left flex flex-col"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-medium text-white/90 line-clamp-2">
                    {truncate(displayName, 80)}
                  </h3>
                  <Badge variant="outline" className="text-[9px] shrink-0">
                    Episode
                  </Badge>
                </div>
                {displayContent && (
                  <p className="text-[11px] text-[#94A3B8] line-clamp-3 leading-relaxed mb-2 flex-1">
                    {truncate(displayContent, 200)}
                  </p>
                )}
                <div className="flex items-center justify-between mt-auto pt-2">
                  {ep.valid_at ? (
                    <span className="text-[10px] text-[#64748B]">
                      {formatDate(ep.valid_at)}
                    </span>
                  ) : (
                    <span />
                  )}
                  <CastButton
                    text={buildShareText(truncate(displayName, 200), "episode")}
                    embedUrl={buildEmbedUrl({
                      uuid: ep.uuid,
                      name: displayName,
                      type: "episode",
                      summary: displayContent,
                    })}
                  />
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* ─── List View ─── */
        <div className="space-y-1">
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
              <button
                key={ep.uuid}
                onClick={() => onSelect(ep)}
                className="w-full flex items-center gap-3 bg-[#1a1d22] border border-white/5 rounded-lg px-4 py-3 hover:border-[var(--brand-primary)]/30 transition-colors text-left"
              >
                {ep.valid_at && (
                  <span className="text-[10px] text-[#64748B] shrink-0 w-20">
                    {formatDate(ep.valid_at)}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white/90 truncate">
                    {truncate(displayName, 80)}
                  </h3>
                  {displayContent && (
                    <p className="text-[11px] text-[#94A3B8] truncate mt-0.5">
                      {truncate(displayContent, 150)}
                    </p>
                  )}
                </div>
                <CastButton
                  text={buildShareText(truncate(displayName, 200), "episode")}
                  embedUrl={buildEmbedUrl({
                    uuid: ep.uuid,
                    name: displayName,
                    type: "episode",
                    summary: displayContent,
                  })}
                  size="sm"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
