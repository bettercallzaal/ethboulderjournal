"use client";

import { useMemo } from "react";

import { BarChart3, Clock, GitBranch, Users } from "lucide-react";

import { StatCard } from "@/components/analytics/stat-card";
import { BarChart } from "@/components/analytics/bar-chart";
import { DonutChart } from "@/components/analytics/donut-chart";
import { ActivityChart } from "@/components/analytics/activity-chart";
import type { TaxonomyStatsResponse } from "@/types";
import type { GraphEdge, GraphNode } from "@/types/graph";
import {
  computeTopHubs,
  computeTypeDistribution,
  computeRelationshipBreakdown,
  computeEpisodeActivity,
} from "@/lib/utils/graph-analytics";

interface AnalyticsViewProps {
  entities: GraphNode[];
  episodes: GraphNode[];
  edges: GraphEdge[];
  nodeMap: Map<string, GraphNode>;
  taxonomyStats?: TaxonomyStatsResponse;
  taxonomyLoading?: boolean;
}

export function AnalyticsView({
  entities,
  episodes,
  edges,
  taxonomyStats,
}: AnalyticsViewProps) {
  const topHubs = useMemo(
    () => computeTopHubs(entities, edges, 10),
    [entities, edges],
  );

  const typeDistribution = useMemo(
    () => computeTypeDistribution(entities),
    [entities],
  );

  const relationshipBreakdown = useMemo(
    () => computeRelationshipBreakdown(edges),
    [edges],
  );

  const episodeActivity = useMemo(
    () => computeEpisodeActivity(episodes),
    [episodes],
  );

  const avgConnections =
    entities.length > 0
      ? (edges.length / entities.length).toFixed(1)
      : "0";

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={Users}
          label="Entities"
          value={entities.length}
          color="var(--brand-primary)"
        />
        <StatCard
          icon={Clock}
          label="Episodes"
          value={episodes.length}
          color="#4fc5ff"
        />
        <StatCard
          icon={GitBranch}
          label="Connections"
          value={edges.length}
          color="#34d399"
        />
        <StatCard
          icon={BarChart3}
          label="Avg Connections"
          value={avgConnections}
          color="#a78bfa"
        />
      </div>

      {/* Two-column: types + relationships */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DonutChart
          title="Entity Types"
          data={typeDistribution.map((d) => ({
            label: d.label,
            value: d.count,
          }))}
        />
        <BarChart
          title="Relationship Types"
          data={relationshipBreakdown.map((d) => ({
            label: d.type,
            value: d.count,
            color: "#4fc5ff",
          }))}
          maxItems={8}
        />
      </div>

      {/* Episode activity timeline */}
      <ActivityChart title="Episode Activity Over Time" data={episodeActivity} />

      {/* Top connected entities */}
      <BarChart
        title="Most Connected Entities"
        data={topHubs.map((h) => ({
          label: h.node.name || "Unnamed",
          value: h.connectionCount,
        }))}
        maxItems={10}
      />

      {/* Taxonomy breakdown */}
      {taxonomyStats && taxonomyStats.taxonomy_stats.length > 0 && (
        <BarChart
          title="Topic Breakdown"
          data={taxonomyStats.taxonomy_stats.map((t) => ({
            label: t.taxonomy_name,
            value: t.chunk_count,
            color: "#34d399",
          }))}
          maxItems={10}
        />
      )}
    </div>
  );
}
