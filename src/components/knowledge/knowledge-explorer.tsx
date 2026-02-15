"use client";

import { useCallback, useState } from "react";

import Link from "next/link";

import {
  BookOpen,
  GitBranch,
  Loader2,
  Network,
  PenTool,
  Clock,
  Users,
} from "lucide-react";

import { siteCopy } from "@/content";
import { useKnowledgeData } from "@/hooks/queries/useKnowledgeData";
import type { GraphNode } from "@/types/graph";

import { EntitiesView } from "./entities-view";
import { EpisodesView } from "./episodes-view";
import { ConnectionsView } from "./connections-view";
import { DetailPanel, type SelectedItem } from "./detail-panel";

type Tab = "entities" | "episodes" | "connections";

const NAV_CARDS = [
  {
    label: "Graph",
    href: "/graph",
    icon: Network,
    desc: "Visual knowledge graph",
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
  const [activeTab, setActiveTab] = useState<Tab>("entities");
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  const agentId = siteCopy.staticGraph.staticAgentId;

  const { data, isLoading, isError } = useKnowledgeData({
    agentId,
    limit: 75,
  });

  const entities = data?.entities ?? [];
  const episodes = data?.episodes ?? [];
  const edges = data?.edges ?? [];
  const nodeMap = data?.nodeMap ?? new Map<string, GraphNode>();

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

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-5 border-b border-white/5">
        {([
          { key: "entities" as Tab, label: "Entities", icon: Users, count: entities.length },
          { key: "episodes" as Tab, label: "Episodes", icon: Clock, count: episodes.length },
          { key: "connections" as Tab, label: "Connections", icon: GitBranch, count: edges.length },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-[var(--brand-primary)] text-white"
                : "border-transparent text-[#64748B] hover:text-white"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key
                  ? "bg-[var(--brand-primary)]/20 text-[var(--brand-primary)]"
                  : "bg-white/5 text-[#64748B]"
              }`}
            >
              {tab.count}
            </span>
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
