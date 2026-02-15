"use client";

import { useMemo, useState } from "react";

import { GitBranch, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { GraphEdge, GraphNode } from "@/types/graph";
import { formatLabel } from "@/components/graph-explorer/wiki/wiki-panel-utils";

interface ConnectionsViewProps {
  edges: GraphEdge[];
  nodeMap: Map<string, GraphNode>;
  onSelectEntity: (uuid: string) => void;
}

function getNodeName(uuid: string, nodeMap: Map<string, GraphNode>): string {
  const node = nodeMap.get(uuid.replace(/^n:/, ""));
  return node?.name ?? uuid.replace(/^n:/, "").slice(0, 12) + "...";
}

export function ConnectionsView({
  edges,
  nodeMap,
  onSelectEntity,
}: ConnectionsViewProps) {
  const [search, setSearch] = useState("");

  const enriched = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        sourceName: getNodeName(edge.source ?? "", nodeMap),
        targetName: getNodeName(edge.target ?? "", nodeMap),
      })),
    [edges, nodeMap],
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return enriched;
    const q = search.toLowerCase();
    return enriched.filter(
      (e) =>
        e.sourceName.toLowerCase().includes(q) ||
        e.targetName.toLowerCase().includes(q) ||
        (e.type ?? "").toLowerCase().includes(q) ||
        (e.fact ?? "").toLowerCase().includes(q),
    );
  }, [enriched, search]);

  return (
    <div>
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search connections..."
          className="w-full bg-[#1a1d22] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[var(--brand-primary)]/50"
        />
      </div>

      {/* Count */}
      <div className="flex items-center gap-1.5 text-[10px] text-[#64748B] mb-3">
        <GitBranch className="w-3 h-3" />
        {filtered.length} connection{filtered.length !== 1 ? "s" : ""}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-[#64748B]">
          {search ? "No connections match your search." : "No connections in the knowledge graph yet."}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-white/5">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1a1d22] text-[10px] text-[#64748B] uppercase tracking-wider">
                <th className="text-left px-3 py-2 font-medium">Source</th>
                <th className="text-left px-3 py-2 font-medium">Relationship</th>
                <th className="text-left px-3 py-2 font-medium">Target</th>
                <th className="text-left px-3 py-2 font-medium hidden lg:table-cell">
                  Fact
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((edge, idx) => (
                <tr
                  key={`${edge.source}-${edge.target}-${idx}`}
                  className="hover:bg-[#2D2E33] transition-colors"
                >
                  <td className="px-3 py-2">
                    <button
                      onClick={() => onSelectEntity(edge.source ?? "")}
                      className="text-xs text-[var(--brand-primary)] hover:underline truncate max-w-[140px] block"
                    >
                      {edge.sourceName}
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <Badge variant="outline" className="text-[9px] capitalize">
                      {formatLabel(edge.type)}
                    </Badge>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => onSelectEntity(edge.target ?? "")}
                      className="text-xs text-[var(--brand-primary)] hover:underline truncate max-w-[140px] block"
                    >
                      {edge.targetName}
                    </button>
                  </td>
                  <td className="px-3 py-2 hidden lg:table-cell">
                    <span className="text-[11px] text-[#94A3B8] truncate max-w-[200px] block">
                      {edge.fact ?? "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
