"use client";

import { useQuery } from "@tanstack/react-query";

import type { AgentLatestEpisodesResponse } from "@/types";
import type { GraphEdge, GraphNode, NodeType } from "@/types/graph";
import { apiClient } from "@/lib/api/client";

/* ── Normalization (mirrors useLatestEpisodesGraph) ── */

function resolveNodeType(rawType: unknown, labels: string[]): NodeType {
  const normalized = typeof rawType === "string" ? rawType.toLowerCase() : "";
  if (normalized.includes("episode")) return "episode";
  if (normalized.includes("entity")) return "entity";
  const hasEpisodeLabel = labels.some((l) => l.toLowerCase() === "episode");
  return hasEpisodeLabel ? "episode" : "entity";
}

function buildProperties(
  raw: Record<string, unknown>,
): Record<string, unknown> {
  const base = { ...raw };
  if (raw["properties"] && typeof raw["properties"] === "object") {
    Object.assign(base, raw["properties"] as Record<string, unknown>);
  }
  return base;
}

function normalizeNode(raw: Record<string, unknown>): GraphNode | null {
  const rawUuid = String(
    raw["uuid"] ?? raw["id"] ?? raw["node_uuid"] ?? raw["nodeId"] ?? "",
  );
  const uuid = rawUuid.replace(/^n:/, "");
  if (!uuid) return null;

  const labels = Array.isArray(raw["labels"])
    ? raw["labels"].filter((l): l is string => typeof l === "string")
    : [];

  const nameCandidate =
    raw["name"] ?? raw["label"] ?? raw["title"] ?? raw["summary"] ?? uuid;
  const type = resolveNodeType(
    raw["type"] ?? raw["node_type"] ?? raw["entity_type"],
    labels,
  );

  return {
    uuid,
    name: String(nameCandidate),
    type,
    labels,
    summary: raw["summary"] as string | undefined,
    content: raw["content"] as string | undefined,
    valid_at: raw["valid_at"] as string | undefined,
    properties: buildProperties(raw),
  };
}

function normalizeEdge(raw: Record<string, unknown>): GraphEdge | null {
  const sourceValue =
    raw["source"] ??
    raw["source_uuid"] ??
    raw["source_node_uuid"] ??
    raw["from_uuid"] ??
    raw["from"];
  const targetValue =
    raw["target"] ??
    raw["target_uuid"] ??
    raw["target_node_uuid"] ??
    raw["to_uuid"] ??
    raw["to"];

  if (!sourceValue || !targetValue) return null;

  const type = String(
    raw["type"] ??
      raw["relationship"] ??
      raw["relationship_type"] ??
      raw["label"] ??
      "related_to",
  );

  return {
    source: String(sourceValue).replace(/^n:/, ""),
    target: String(targetValue).replace(/^n:/, ""),
    type,
    fact: raw["fact"] as string | undefined,
    properties: buildProperties(raw),
  };
}

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
