"use client";

import { useCallback, useMemo, useState } from "react";

import Link from "next/link";

import {
  BarChart3,
  BookOpen,
  GitBranch,
  Loader2,
  PenTool,
  Clock,
  Flame,
  Users,
  Zap,
} from "lucide-react";

import { siteCopy } from "@/content";
import { useKnowledgeData } from "@/hooks/queries/useKnowledgeData";
import { useTaxonomyStatsQuery } from "@/hooks/queries/useTaxonomyStatsQuery";
import type { GraphEdge, GraphNode } from "@/types/graph";

import { EntitiesView } from "./entities-view";
import { EpisodesView } from "./episodes-view";
import { ConnectionsView } from "./connections-view";
import { FeedView } from "./feed-view";
import { AnalyticsView } from "./analytics-view";
import { DetailPanel, type SelectedItem } from "./detail-panel";

type Tab = "feed" | "entities" | "episodes" | "connections" | "analytics";

/** Names to match when finding ZABAL-related entities */
const ZABAL_NAMES = ["zabal", "bettercallzaal", "zaal"];

function isZabalRelated(node: GraphNode): boolean {
  const name = (node.name ?? "").toLowerCase();
  return ZABAL_NAMES.some((z) => name.includes(z));
}

function getZabalConnections(
  entities: GraphNode[],
  edges: GraphEdge[],
  nodeMap: Map<string, GraphNode>,
): GraphNode[] {
  const zabalUuids = new Set(
    entities.filter(isZabalRelated).map((e) => e.uuid!),
  );
  if (zabalUuids.size === 0) return [];

  const connectedUuids = new Set<string>();
  for (const edge of edges) {
    if (zabalUuids.has(edge.source ?? "")) connectedUuids.add(edge.target ?? "");
    if (zabalUuids.has(edge.target ?? "")) connectedUuids.add(edge.source ?? "");
  }

  return [...connectedUuids]
    .filter((uuid) => !zabalUuids.has(uuid))
    .map((uuid) => nodeMap.get(uuid))
    .filter((n): n is GraphNode => !!n);
}

const NAV_CARDS = [
  {
    label: "ZABAL's Graph",
    href: "/graph?q=ZABAL",
    icon: Flame,
    desc: "See ZABAL's connections",
  },
  {
    label: "Journal",
    href: "/journal",
    icon: PenTool,
    desc: "Write & share thoughts",
  },
  {
    label: "Hyperblogs",
    href: "/hyperblogs",
    icon: BookOpen,
    desc: "AI-generated posts",
  },
];

export function KnowledgeExplorer() {
  const [activeTab, setActiveTab] = useState<Tab>("feed");
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  const agentId = siteCopy.staticGraph.staticAgentId;
  const bonfireId = siteCopy.staticGraph.staticBonfireId;

  const { data, isLoading, isError } = useKnowledgeData({
    agentId,
    limit: 75,
  });

  const { data: taxonomyData, isLoading: taxonomyLoading } =
    useTaxonomyStatsQuery(bonfireId);

  const entities = data?.entities ?? [];
  const episodes = data?.episodes ?? [];
  const edges = data?.edges ?? [];
  const nodeMap = data?.nodeMap ?? new Map<string, GraphNode>();

  // ZABAL's direct connections
  const zabalConnections = useMemo(
    () => getZabalConnections(entities, edges, nodeMap),
    [entities, edges, nodeMap],
  );

  // ZABAL entity itself
  const zabalEntity = useMemo(
    () => entities.find(isZabalRelated),
    [entities],
  );

  // Unique entity labels for stats
  const labelCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of entities) {
      for (const label of e.labels ?? []) {
        const normalized = label.toLowerCase();
        if (normalized !== "entity") {
          counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
        }
      }
    }
    return counts;
  }, [entities]);

  const handleSelectEntity = useCallback((entity: GraphNode) => {
    setSelectedItem({ type: "entity", node: entity });
  }, []);

  const handleSelectEpisode = useCallback((episode: GraphNode) => {
    setSelectedItem({ type: "episode", node: episode });
  }, []);

  const handleNavigateToEntity = useCallback(
    (uuid: string) => {
      const node = nodeMap.get(uuid);
      if (node) {
        setActiveTab("entities");
        setSelectedItem({ type: node.type === "episode" ? "episode" : "entity", node });
      }
    },
    [nodeMap],
  );

  const handleClosePanel = useCallback(() => {
    setSelectedItem(null);
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-black font-montserrat mb-1">
          Knowledge Explorer
        </h1>
        <p className="text-sm text-[#94A3B8]">
          Browse everything in the ZABAL knowledge graph — entities, episodes,
          and connections.
        </p>
      </div>

      {/* Quick nav cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {NAV_CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-[#22252B]/50 border border-white/5 rounded-lg p-3 hover:border-[var(--brand-primary)]/30 transition-colors flex items-center gap-3"
          >
            <card.icon className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-white">{card.label}</p>
              <p className="text-[10px] text-[#64748B] truncate">
                {card.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats bar */}
      {!isLoading && (entities.length > 0 || episodes.length > 0) && (
        <div className="flex items-center gap-4 mb-5 py-3 px-4 bg-[#22252B]/30 rounded-lg border border-white/5 overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0">
            <Users className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
            <span className="text-xs font-medium text-white">{entities.length}</span>
            <span className="text-[10px] text-[#64748B]">entities</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-1.5 shrink-0">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-medium text-white">{episodes.length}</span>
            <span className="text-[10px] text-[#64748B]">episodes</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-1.5 shrink-0">
            <GitBranch className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs font-medium text-white">{edges.length}</span>
            <span className="text-[10px] text-[#64748B]">connections</span>
          </div>
          {labelCounts.size > 0 && (
            <>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {[...labelCounts.entries()]
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([label, count]) => (
                    <span
                      key={label}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#94A3B8] capitalize shrink-0"
                    >
                      {label} ({count})
                    </span>
                  ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ZABAL's Connections — highlighted section */}
      {!isLoading && zabalConnections.length > 0 && (
        <div className="mb-6 bg-gradient-to-r from-[var(--brand-primary)]/5 to-transparent border border-[var(--brand-primary)]/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-[var(--brand-primary)]" />
            <h2 className="text-sm font-semibold text-white">
              ZABAL&apos;s Connections
            </h2>
            <span className="text-[10px] text-[#64748B]">
              {zabalConnections.length} direct connections
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {zabalEntity && (
              <button
                onClick={() => handleSelectEntity(zabalEntity)}
                className="shrink-0 bg-[var(--brand-primary)]/15 border border-[var(--brand-primary)]/30 rounded-lg px-3 py-2 hover:bg-[var(--brand-primary)]/25 transition-colors text-left"
              >
                <p className="text-xs font-medium text-[var(--brand-primary)]">
                  {zabalEntity.name}
                </p>
                <p className="text-[10px] text-[#94A3B8] mt-0.5">You</p>
              </button>
            )}
            {zabalConnections.slice(0, 12).map((node) => (
              <button
                key={node.uuid}
                onClick={() => handleSelectEntity(node)}
                className="shrink-0 bg-[#1a1d22] border border-white/10 rounded-lg px-3 py-2 hover:border-[var(--brand-primary)]/30 transition-colors text-left"
              >
                <p className="text-xs font-medium text-white/90 truncate max-w-[120px]">
                  {node.name}
                </p>
                {node.labels && node.labels.length > 0 && (
                  <p className="text-[10px] text-[#64748B] mt-0.5 capitalize">
                    {node.labels[0]}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-5 border-b border-white/5 overflow-x-auto">
        {([
          { key: "feed" as Tab, label: "Feed", icon: Zap, count: entities.length + episodes.length },
          { key: "entities" as Tab, label: "Entities", icon: Users, count: entities.length },
          { key: "episodes" as Tab, label: "Episodes", icon: Clock, count: episodes.length },
          { key: "connections" as Tab, label: "Connections", icon: GitBranch, count: edges.length },
          { key: "analytics" as Tab, label: "Analytics", icon: BarChart3, count: undefined },
        ] as { key: Tab; label: string; icon: typeof Zap; count?: number }[]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors shrink-0 ${
              activeTab === tab.key
                ? "border-[var(--brand-primary)] text-white"
                : "border-transparent text-[#64748B] hover:text-white"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            {tab.count != null && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key
                    ? "bg-[var(--brand-primary)]/20 text-[var(--brand-primary)]"
                    : "bg-white/5 text-[#64748B]"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-[#64748B]" />
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-sm text-red-400">
          Failed to load knowledge graph data. Try refreshing.
        </div>
      ) : (
        <>
          {activeTab === "feed" && (
            <FeedView
              entities={entities}
              episodes={episodes}
              onSelectEntity={handleSelectEntity}
              onSelectEpisode={handleSelectEpisode}
            />
          )}
          {activeTab === "entities" && (
            <EntitiesView
              entities={entities}
              edges={edges}
              onSelect={handleSelectEntity}
            />
          )}
          {activeTab === "episodes" && (
            <EpisodesView episodes={episodes} onSelect={handleSelectEpisode} />
          )}
          {activeTab === "connections" && (
            <ConnectionsView
              edges={edges}
              nodeMap={nodeMap}
              onSelectEntity={handleNavigateToEntity}
            />
          )}
          {activeTab === "analytics" && (
            <AnalyticsView
              entities={entities}
              episodes={episodes}
              edges={edges}
              nodeMap={nodeMap}
              taxonomyStats={taxonomyData}
              taxonomyLoading={taxonomyLoading}
            />
          )}
        </>
      )}

      {/* Detail panel overlay */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={handleClosePanel}
        />
      )}
      <DetailPanel
        item={selectedItem}
        edges={edges}
        nodeMap={nodeMap}
        onClose={handleClosePanel}
        onNavigateToEntity={handleNavigateToEntity}
      />
    </div>
  );
}
