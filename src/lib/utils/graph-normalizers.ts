/**
 * Graph Normalizers
 *
 * Shared utilities for normalizing raw API responses into typed GraphNode/GraphEdge objects.
 * Used by GraphExplorer, useKnowledgeData, and other graph consumers.
 */
import type { GraphEdge, GraphNode, NodeType } from "@/types/graph";

/**
 * Determine whether a raw node is an "episode" or "entity" based on type string and labels.
 */
export function resolveNodeType(
  rawType: unknown,
  labels: string[]
): NodeType {
  const normalized = typeof rawType === "string" ? rawType.toLowerCase() : "";
  if (normalized.includes("episode")) return "episode";
  if (normalized.includes("entity")) return "entity";
  const hasEpisodeLabel = labels.some(
    (label) => label.toLowerCase() === "episode"
  );
  return hasEpisodeLabel ? "episode" : "entity";
}

/**
 * Merge nested `properties` object into the top-level record.
 */
export function buildProperties(
  raw: Record<string, unknown>
): Record<string, unknown> {
  const base = { ...raw };
  if (raw["properties"] && typeof raw["properties"] === "object") {
    Object.assign(base, raw["properties"] as Record<string, unknown>);
  }
  return base;
}

/**
 * Normalize a raw node record into a typed GraphNode.
 * Returns null if no UUID can be resolved.
 */
export function normalizeNode(raw: Record<string, unknown>): GraphNode | null {
  const rawUuid = String(
    raw["uuid"] ?? raw["id"] ?? raw["node_uuid"] ?? raw["nodeId"] ?? ""
  );
  const uuid = rawUuid.replace(/^n:/, "");
  if (!uuid) return null;

  const labels = Array.isArray(raw["labels"])
    ? raw["labels"].filter(
        (label): label is string => typeof label === "string"
      )
    : [];

  const nameCandidate =
    raw["name"] ?? raw["label"] ?? raw["title"] ?? raw["summary"] ?? uuid;
  const type = resolveNodeType(
    raw["type"] ?? raw["node_type"] ?? raw["entity_type"],
    labels
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

/**
 * Strip the "n:" prefix from a node ID value.
 */
export function normalizeNodeId(value: unknown): string {
  return String(value ?? "").replace(/^n:/, "");
}

/**
 * Normalize a raw edge record into a typed GraphEdge.
 * Returns null if source or target cannot be resolved.
 */
export function normalizeEdge(raw: Record<string, unknown>): GraphEdge | null {
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
      "related_to"
  );

  return {
    source: normalizeNodeId(sourceValue),
    target: normalizeNodeId(targetValue),
    type,
    fact: raw["fact"] as string | undefined,
    properties: buildProperties(raw),
  };
}

/**
 * Cast an unknown value to a record for normalization.
 */
export function asRecord(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}
