"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import type { GraphNode } from "@/types/graph";
import { formatDate } from "@/components/graph-explorer/wiki/wiki-panel-utils";
import { buildEmbedUrl, buildShareText } from "@/lib/farcaster";
import { CastButton } from "./share-button";
import { Search, Zap } from "lucide-react";

interface FeedViewProps {
  entities: GraphNode[];
  episodes: GraphNode[];
  onSelectEntity: (entity: GraphNode) => void;
  onSelectEpisode: (episode: GraphNode) => void;
}

type FeedFilter = "all" | "entities" | "episodes";

interface FeedItem {
  node: GraphNode;
  kind: "entity" | "episode";
  sortDate: number;
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max).trimEnd() + "...";
}

export function FeedView({
  entities,
  episodes,
  onSelectEntity,
  onSelectEpisode,
}: FeedViewProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FeedFilter>("all");

  const feed = useMemo(() => {
    const items: FeedItem[] = [];

    if (filter !== "episodes") {
      for (const entity of entities) {
        items.push({
          node: entity,
          kind: "entity",
          sortDate: entity.valid_at ? new Date(entity.valid_at).getTime() : 0,
        });
      }
    }

    if (filter !== "entities") {
      for (const episode of episodes) {
        items.push({
          node: episode,
          kind: "episode",
          sortDate: episode.valid_at ? new Date(episode.valid_at).getTime() : 0,
        });
      }
    }

    // Sort newest first, unknowns at end
    items.sort((a, b) => {
      if (a.sortDate === 0 && b.sortDate === 0) return 0;
      if (a.sortDate === 0) return 1;
      if (b.sortDate === 0) return -1;
      return b.sortDate - a.sortDate;
    });

    if (!search.trim()) return items;

    const q = search.toLowerCase();
    return items.filter(
      (item) =>
        (item.node.name ?? "").toLowerCase().includes(q) ||
        (item.node.summary ?? "").toLowerCase().includes(q) ||
        (item.node.content ?? "").toLowerCase().includes(q),
    );
  }, [entities, episodes, search, filter]);

  // Group by date for date separators
  const grouped = useMemo(() => {
    const groups: { label: string; items: FeedItem[] }[] = [];
    let currentLabel = "";

    for (const item of feed) {
      let dateLabel = "Unknown Date";
      if (item.sortDate > 0) {
        const d = new Date(item.sortDate);
        dateLabel = d.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
      }

      if (dateLabel !== currentLabel) {
        groups.push({ label: dateLabel, items: [] });
        currentLabel = dateLabel;
      }
      groups[groups.length - 1]!.items.push(item);
    }

    return groups;
  }, [feed]);

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
            placeholder="Search everything..."
            className="w-full bg-[#1a1d22] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[var(--brand-primary)]/50"
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1">
          {([
            { key: "all" as FeedFilter, label: "All" },
            { key: "entities" as FeedFilter, label: "Entities" },
            { key: "episodes" as FeedFilter, label: "Episodes" },
          ]).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                filter === f.key
                  ? "bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] border border-[var(--brand-primary)]/30"
                  : "text-[#64748B] border border-white/10 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="flex items-center gap-1.5 text-[10px] text-[#64748B] mb-3">
        <Zap className="w-3 h-3" />
        {feed.length} item{feed.length !== 1 ? "s" : ""}
      </div>

      {/* Feed */}
      {feed.length === 0 ? (
        <div className="text-center py-12 text-sm text-[#64748B]">
          {search ? "No items match your search." : "No data in the knowledge graph yet."}
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map((group) => (
            <div key={group.label}>
              {/* Date separator */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider shrink-0">
                  {group.label}
                </span>
                <div className="h-px flex-1 bg-white/5" />
              </div>

              {/* Items */}
              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const node = item.node;
                  const displayName = node.name || "Untitled";
                  const displayContent = node.summary || node.content || "";
                  const isEpisode = item.kind === "episode";

                  return (
                    <button
                      key={node.uuid}
                      onClick={() =>
                        isEpisode
                          ? onSelectEpisode(node)
                          : onSelectEntity(node)
                      }
                      className="w-full flex items-start gap-3 bg-[#1a1d22] border border-white/5 rounded-lg px-4 py-3 hover:border-[var(--brand-primary)]/30 transition-colors text-left"
                    >
                      {/* Type indicator */}
                      <div
                        className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                          isEpisode
                            ? "bg-blue-400"
                            : "bg-[var(--brand-primary)]"
                        }`}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-sm font-medium text-white/90 truncate">
                            {truncate(displayName, 80)}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`text-[9px] shrink-0 capitalize ${
                              isEpisode ? "text-blue-400 border-blue-400/30" : ""
                            }`}
                          >
                            {isEpisode ? "Episode" : (node.labels?.[0] ?? "Entity")}
                          </Badge>
                        </div>
                        {displayContent && (
                          <p className="text-[11px] text-[#94A3B8] truncate">
                            {truncate(displayContent, 150)}
                          </p>
                        )}
                        {node.valid_at && (
                          <span className="text-[10px] text-[#64748B] mt-0.5 block">
                            {formatDate(node.valid_at)}
                          </span>
                        )}
                      </div>

                      <CastButton
                        text={buildShareText(
                          truncate(displayName, 200),
                          isEpisode ? "episode" : "entity",
                        )}
                        embedUrl={buildEmbedUrl({
                          uuid: node.uuid,
                          name: displayName,
                          type: isEpisode ? "episode" : "entity",
                          summary: displayContent,
                        })}
                        size="sm"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
