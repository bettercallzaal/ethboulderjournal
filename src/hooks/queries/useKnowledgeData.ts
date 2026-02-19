"use client";

import { useQuery } from "@tanstack/react-query";

import type { AgentLatestEpisodesResponse } from "@/types";
import type { GraphEdge, GraphNode } from "@/types/graph";
import { apiClient } from "@/lib/api/client";
import { normalizeNode, normalizeEdge } from "@/lib/utils/graph-normalizers";

/* ── Return type ── */

export interface KnowledgeData {
  entities: GraphNode[];
  episodes: GraphNode[];
  edges: GraphEdge[];
  nodeMap: Map<string, GraphNode>;
}

/* ── Hook ── */

export function useKnowledgeData({
  agentId,
  limit = 75,
  enabled = true,
}: {
  agentId: string | null;
  limit?: number;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ["knowledge-data", agentId, limit],
    queryFn: async (): Promise<KnowledgeData> => {
      if (!agentId) throw new Error("Agent ID required");

      const response = await apiClient.post<AgentLatestEpisodesResponse>(
        `/api/agents/${agentId}/episodes/search`,
        { limit },
      );

      // Merge nodes + entities arrays, dedupe by uuid
      const rawNodes = [
        ...(response.nodes ?? []),
        ...(response.entities ?? []),
      ];
      const nodeMap = new Map<string, GraphNode>();
      for (const raw of rawNodes) {
        const node = normalizeNode(raw as Record<string, unknown>);
        if (node && !nodeMap.has(node.uuid!)) {
          nodeMap.set(node.uuid!, node);
        }
      }

      // Also extract episode nodes from episodes array
      for (const raw of response.episodes ?? []) {
        const r = raw as Record<string, unknown>;
        const node = normalizeNode({ ...r, type: "episode" });
        if (node && !nodeMap.has(node.uuid!)) {
          nodeMap.set(node.uuid!, node);
        }
      }

      // Split by type
      const entities: GraphNode[] = [];
      const episodes: GraphNode[] = [];
      for (const node of nodeMap.values()) {
        if (node.type === "episode") {
          episodes.push(node);
        } else {
          entities.push(node);
        }
      }

      // Sort episodes by valid_at descending
      episodes.sort((a, b) => {
        const da = a.valid_at ? new Date(a.valid_at).getTime() : 0;
        const db = b.valid_at ? new Date(b.valid_at).getTime() : 0;
        return db - da;
      });

      // Sort entities alphabetically
      entities.sort((a, b) =>
        (a.name ?? "").localeCompare(b.name ?? ""),
      );

      // Normalize edges
      const edges = (response.edges ?? [])
        .map((edge) => normalizeEdge(edge as Record<string, unknown>))
        .filter((edge): edge is GraphEdge => !!edge);

      return { entities, episodes, edges, nodeMap };
    },
    enabled: enabled && !!agentId,
    staleTime: 2 * 60 * 1000,
  });
}
