import type { GraphEdge, GraphNode } from "@/types/graph";

export interface EntityHub {
  node: GraphNode;
  connectionCount: number;
}

export interface TypeDistribution {
  label: string;
  count: number;
  percentage: number;
}

export interface RelationshipBreakdown {
  type: string;
  count: number;
  percentage: number;
}

export interface EpisodeActivityBucket {
  date: string; // YYYY-MM-DD
  count: number;
}

/** Top N entities ranked by number of edges */
export function computeTopHubs(
  entities: GraphNode[],
  edges: GraphEdge[],
  limit: number = 10,
): EntityHub[] {
  const counts = new Map<string, number>();
  for (const edge of edges) {
    if (edge.source) counts.set(edge.source, (counts.get(edge.source) ?? 0) + 1);
    if (edge.target) counts.set(edge.target, (counts.get(edge.target) ?? 0) + 1);
  }

  return entities
    .map((node) => ({
      node,
      connectionCount: counts.get(node.uuid ?? "") ?? 0,
    }))
    .sort((a, b) => b.connectionCount - a.connectionCount)
    .slice(0, limit);
}

/** Entity label/type distribution with percentages */
export function computeTypeDistribution(
  entities: GraphNode[],
): TypeDistribution[] {
  const counts = new Map<string, number>();
  for (const entity of entities) {
    const label =
      entity.labels?.find((l) => l.toLowerCase() !== "entity") ??
      "uncategorized";
    const normalized = label.toLowerCase();
    counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
  }

  const total = entities.length || 1;
  return [...counts.entries()]
    .map(([label, count]) => ({
      label,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

/** Edge relationship type breakdown with percentages */
export function computeRelationshipBreakdown(
  edges: GraphEdge[],
): RelationshipBreakdown[] {
  const counts = new Map<string, number>();
  for (const edge of edges) {
    const type = edge.type || "unknown";
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }

  const total = edges.length || 1;
  return [...counts.entries()]
    .map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

/** Episode count bucketed by day, sorted chronologically */
export function computeEpisodeActivity(
  episodes: GraphNode[],
): EpisodeActivityBucket[] {
  const buckets = new Map<string, number>();
  for (const ep of episodes) {
    if (!ep.valid_at) continue;
    const date = new Date(ep.valid_at).toISOString().slice(0, 10);
    buckets.set(date, (buckets.get(date) ?? 0) + 1);
  }

  return [...buckets.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
