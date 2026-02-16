"use client";

import Link from "next/link";

import { BookOpen, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { EntityContent } from "@/components/graph-explorer/wiki/entity-content";
import { EpisodeContent } from "@/components/graph-explorer/wiki/episode-content";
import type { WikiEdgeData } from "@/components/graph-explorer/wiki/wiki-panel-utils";
import { parseEpisodeContent } from "@/components/graph-explorer/wiki/wiki-panel-utils";
import type { GraphEdge, GraphNode } from "@/types/graph";
import { buildEmbedUrl, buildShareText } from "@/lib/farcaster";
import { CastButton, XShareButton } from "./share-button";

export interface SelectedItem {
  type: "entity" | "episode";
  node: GraphNode;
}

interface DetailPanelProps {
  item: SelectedItem | null;
  edges: GraphEdge[];
  nodeMap: Map<string, GraphNode>;
  onClose: () => void;
  onNavigateToEntity: (uuid: string) => void;
}

export function DetailPanel({
  item,
  edges,
  nodeMap,
  onClose,
  onNavigateToEntity,
}: DetailPanelProps) {
  if (!item) return null;

  const { node } = item;

  // Build relationships for entity content
  const nodeRelationships: WikiEdgeData[] = edges
    .filter((e) => e.source === node.uuid || e.target === node.uuid)
    .map((e, idx) => ({
      id: `${e.source}-${e.target}-${idx}`,
      source: e.source ?? "",
      target: e.target ?? "",
      relation_type: e.type,
      label: e.type,
      fact: e.fact,
    }));

  const getRelatedNodeTitle = (nodeId: string): string | undefined => {
    return nodeMap.get(nodeId)?.name;
  };

  return (
    <div className="fixed top-0 right-0 h-full w-full md:w-[450px] z-50 bg-[#22252B] border-l border-white/5 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2 min-w-0">
          <Badge variant="outline" className="text-[9px] capitalize shrink-0">
            {item.type}
          </Badge>
          <h2 className="text-sm font-medium text-white truncate">
            {node.name}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors shrink-0"
        >
          <X className="w-4 h-4 text-[#64748B]" />
        </button>
      </div>

      {/* Share bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-[#1a1d22]/50">
        <span className="text-[10px] text-[#64748B] mr-1">Share:</span>
        <CastButton
          size="md"
          text={buildShareText(node.name ?? "Item", item.type)}
          embedUrl={buildEmbedUrl({
            uuid: node.uuid,
            name: node.name,
            type: item.type,
            summary: node.summary || node.content,
            connections: nodeRelationships.length,
          })}
        />
        <XShareButton
          size="md"
          text={buildShareText(node.name ?? "Item", item.type)}
          url={buildEmbedUrl({
            uuid: node.uuid,
            name: node.name,
            type: item.type,
            summary: node.summary || node.content,
          })}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {item.type === "entity" ? (
          <EntityContent
            node={{
              uuid: node.uuid!,
              name: node.name,
              summary: node.summary,
              content: node.content,
              labels: node.labels,
              attributes: node.properties as Record<string, unknown> | undefined,
            }}
            nodeRelationships={nodeRelationships}
            onNodeSelect={onNavigateToEntity}
            getRelatedNodeTitle={getRelatedNodeTitle}
          />
        ) : (
          <EpisodeContent
            episode={parseEpisodeContent({
              uuid: node.uuid!,
              name: node.name,
              content: node.content,
              valid_at: node.valid_at,
            })}
          />
        )}

        {/* Write a Hyperblog CTA */}
        <Link
          href="/hyperblogs"
          className="mt-6 flex items-center gap-3 bg-gradient-to-r from-[var(--brand-primary)]/10 to-transparent border border-[var(--brand-primary)]/20 rounded-xl p-4 hover:border-[var(--brand-primary)]/40 transition-colors group"
        >
          <BookOpen className="w-5 h-5 text-[var(--brand-primary)] shrink-0" />
          <div>
            <p className="text-sm font-medium text-white group-hover:text-[var(--brand-primary)] transition-colors">
              Write a Hyperblog
            </p>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              Generate an AI-powered blog post about {node.name || "this topic"}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
