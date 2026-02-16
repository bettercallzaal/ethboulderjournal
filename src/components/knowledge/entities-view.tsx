"use client";

import { useMemo, useState } from "react";

import { Search, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { GraphEdge, GraphNode } from "@/types/graph";
import { buildEmbedUrl, buildShareText } from "@/lib/farcaster";
import { CastButton } from "./share-button";

interface EntitiesViewProps {
  entities: GraphNode[];
  edges: GraphEdge[];
  onSelect: (entity: GraphNode) => void;
}

export function EntitiesView({ entities, edges, onSelect }: EntitiesViewProps) {
  const [search, setSearch] = useState("");

  // Count relationships per entity
  const relCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const edge of edges) {
      if (edge.source) counts.set(edge.source, (counts.get(edge.source) ?? 0) + 1);
      if (edge.target) counts.set(edge.target, (counts.get(edge.target) ?? 0) + 1);
    }
    return counts;
  }, [edges]);

  const filtered = useMemo(() => {
    if (!search.trim()) return entities;
    const q = search.toLowerCase();
    return entities.filter(
      (e) =>
        (e.name ?? "").toLowerCase().includes(q) ||
        (e.summary ?? "").toLowerCase().includes(q) ||
        (e.labels ?? []).some((l) => l.toLowerCase().includes(q)),
    );
  }, [entities, search]);

  return (
    <div>
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search entities..."
          className="w-full bg-[#1a1d22] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[var(--brand-primary)]/50"
        />
      </div>

      {/* Count */}
      <div className="flex items-center gap-1.5 text-[10px] text-[#64748B] mb-3">
        <Users className="w-3 h-3" />
        {filtered.length} entit{filtered.length === 1 ? "y" : "ies"}
      </div>

      {/* Card grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-[#64748B]">
          {search ? "No entities match your search." : "No entities in the knowledge graph yet."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((entity) => {
            const count = relCounts.get(entity.uuid!) ?? 0;
            return (
              <button
                key={entity.uuid}
                onClick={() => onSelect(entity)}
                className="bg-[#1a1d22] border border-white/5 rounded-lg p-4 hover:border-[var(--brand-primary)]/30 transition-colors text-left"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-medium text-white/90 truncate">
                    {entity.name}
                  </h3>
                  {count > 0 && (
                    <span className="text-[10px] text-[#64748B] shrink-0">
                      {count} conn.
                    </span>
                  )}
                </div>
                {entity.labels && entity.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {entity.labels.slice(0, 3).map((label) => (
                      <Badge
                        key={label}
                        variant="outline"
                        className="text-[9px] capitalize"
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                )}
                {(entity.summary || entity.content) && (
                  <p className="text-[11px] text-[#94A3B8] line-clamp-2 leading-relaxed mb-2">
                    {entity.summary || entity.content}
                  </p>
                )}
                <div className="flex justify-end mt-auto pt-1">
                  <CastButton
                    text={buildShareText(entity.name ?? "Entity", "entity")}
                    embedUrl={buildEmbedUrl(entity.uuid)}
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
