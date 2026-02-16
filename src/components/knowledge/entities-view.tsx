"use client";

import { useMemo, useState } from "react";

import { Grid3X3, List, Search, Table, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { GraphEdge, GraphNode } from "@/types/graph";
import { buildEmbedUrl, buildShareText } from "@/lib/farcaster";
import { CastButton } from "./share-button";

type ViewMode = "grid" | "list" | "table";
type SortBy = "name" | "connections" | "type";

interface EntitiesViewProps {
  entities: GraphNode[];
  edges: GraphEdge[];
  onSelect: (entity: GraphNode) => void;
}

export function EntitiesView({ entities, edges, onSelect }: EntitiesViewProps) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("connections");

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
    let result = entities;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          (e.name ?? "").toLowerCase().includes(q) ||
          (e.summary ?? "").toLowerCase().includes(q) ||
          (e.labels ?? []).some((l) => l.toLowerCase().includes(q)),
      );
    }
    // Sort
    return [...result].sort((a, b) => {
      if (sortBy === "connections") {
        return (relCounts.get(b.uuid!) ?? 0) - (relCounts.get(a.uuid!) ?? 0);
      }
      if (sortBy === "type") {
        const aLabel = (a.labels ?? [])[0] ?? "";
        const bLabel = (b.labels ?? [])[0] ?? "";
        return aLabel.localeCompare(bLabel) || (a.name ?? "").localeCompare(b.name ?? "");
      }
      return (a.name ?? "").localeCompare(b.name ?? "");
    });
  }, [entities, search, sortBy, relCounts]);

  return (
    <div>
      {/* Toolbar: search + view toggle + sort */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search entities..."
            className="w-full bg-[#1a1d22] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[var(--brand-primary)]/50"
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="bg-[#1a1d22] border border-white/10 rounded-lg px-2 py-2 text-[11px] text-[#94A3B8] focus:outline-none focus:border-[var(--brand-primary)]/50"
        >
          <option value="connections">Most Connected</option>
          <option value="name">A-Z</option>
          <option value="type">By Type</option>
        </select>

        {/* View toggle */}
        <div className="flex items-center bg-[#1a1d22] border border-white/10 rounded-lg overflow-hidden">
          {([
            { mode: "grid" as ViewMode, icon: Grid3X3, title: "Grid view" },
            { mode: "list" as ViewMode, icon: List, title: "List view" },
            { mode: "table" as ViewMode, icon: Table, title: "Table view" },
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
        <Users className="w-3 h-3" />
        {filtered.length} entit{filtered.length === 1 ? "y" : "ies"}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-[#64748B]">
          {search ? "No entities match your search." : "No entities in the knowledge graph yet."}
        </div>
      ) : viewMode === "grid" ? (
        /* ─── Grid View ─── */
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
                    embedUrl={buildEmbedUrl({
                      uuid: entity.uuid,
                      name: entity.name,
                      type: "entity",
                      summary: entity.summary || entity.content,
                      connections: count,
                    })}
                  />
                </div>
              </button>
            );
          })}
        </div>
      ) : viewMode === "list" ? (
        /* ─── List View ─── */
        <div className="space-y-1">
          {filtered.map((entity) => {
            const count = relCounts.get(entity.uuid!) ?? 0;
            return (
              <button
                key={entity.uuid}
                onClick={() => onSelect(entity)}
                className="w-full flex items-center gap-3 bg-[#1a1d22] border border-white/5 rounded-lg px-4 py-3 hover:border-[var(--brand-primary)]/30 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-white/90 truncate">
                      {entity.name}
                    </h3>
                    {entity.labels && entity.labels.length > 0 && (
                      <Badge
                        variant="outline"
                        className="text-[9px] capitalize shrink-0"
                      >
                        {entity.labels[0]}
                      </Badge>
                    )}
                  </div>
                  {(entity.summary || entity.content) && (
                    <p className="text-[11px] text-[#94A3B8] truncate mt-0.5">
                      {entity.summary || entity.content}
                    </p>
                  )}
                </div>
                <span className="text-[10px] text-[#64748B] shrink-0">
                  {count} conn.
                </span>
                <CastButton
                  text={buildShareText(entity.name ?? "Entity", "entity")}
                  embedUrl={buildEmbedUrl({
                    uuid: entity.uuid,
                    name: entity.name,
                    type: "entity",
                    summary: entity.summary || entity.content,
                    connections: count,
                  })}
                  size="sm"
                />
              </button>
            );
          })}
        </div>
      ) : (
        /* ─── Table View ─── */
        <div className="overflow-x-auto rounded-lg border border-white/5">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1a1d22] text-[10px] text-[#64748B] uppercase tracking-wider">
                <th className="text-left px-3 py-2 font-medium">Name</th>
                <th className="text-left px-3 py-2 font-medium">Type</th>
                <th className="text-left px-3 py-2 font-medium hidden md:table-cell">
                  Summary
                </th>
                <th className="text-right px-3 py-2 font-medium">Connections</th>
                <th className="text-right px-3 py-2 font-medium w-12">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((entity) => {
                const count = relCounts.get(entity.uuid!) ?? 0;
                return (
                  <tr
                    key={entity.uuid}
                    onClick={() => onSelect(entity)}
                    className="hover:bg-[#2D2E33] transition-colors cursor-pointer"
                  >
                    <td className="px-3 py-2">
                      <span className="text-xs font-medium text-white/90">
                        {entity.name}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {entity.labels && entity.labels.length > 0 ? (
                        <Badge variant="outline" className="text-[9px] capitalize">
                          {entity.labels[0]}
                        </Badge>
                      ) : (
                        <span className="text-[10px] text-[#64748B]">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 hidden md:table-cell">
                      <span className="text-[11px] text-[#94A3B8] truncate max-w-[250px] block">
                        {entity.summary || entity.content || "—"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <span className="text-[11px] text-[#64748B]">{count}</span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <CastButton
                        text={buildShareText(entity.name ?? "Entity", "entity")}
                        embedUrl={buildEmbedUrl({
                          uuid: entity.uuid,
                          name: entity.name,
                          type: "entity",
                          connections: count,
                        })}
                        size="sm"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
