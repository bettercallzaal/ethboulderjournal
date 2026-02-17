"use client";

import Link from "next/link";

import { Flame, Loader2, Users } from "lucide-react";

import { useBonfireSelection } from "@/contexts/BonfireSelectionContext";
import { peopleSectionCopy } from "@/content/landing-page";
import { useKnowledgeData } from "@/hooks/queries/useKnowledgeData";
import type { GraphNode } from "@/types/graph";

import { Button } from "../ui/button";

const ZABAL_NAMES = ["zabal", "bettercallzaal", "zaal"];

function isZabalRelated(node: GraphNode): boolean {
  const name = (node.name ?? "").toLowerCase();
  return ZABAL_NAMES.some((z) => name.includes(z));
}

export default function PeopleSection() {
  const { title, subtitle, description, cta, ctaHref } = peopleSectionCopy;
  const { active: activeBonfire } = useBonfireSelection();
  const agentId = activeBonfire.agentId;

  const { data, isLoading } = useKnowledgeData({ agentId, limit: 50 });

  const entities = data?.entities ?? [];
  const edges = data?.edges ?? [];
  const nodeMap = data?.nodeMap ?? new Map<string, GraphNode>();

  // Find ZABAL entities and their connections
  const zabalUuids = new Set(
    entities.filter(isZabalRelated).map((e) => e.uuid!),
  );
  const connectedUuids = new Set<string>();
  for (const edge of edges) {
    if (zabalUuids.has(edge.source ?? "")) connectedUuids.add(edge.target ?? "");
    if (zabalUuids.has(edge.target ?? "")) connectedUuids.add(edge.source ?? "");
  }
  const zabalConnections = [...connectedUuids]
    .filter((uuid) => !zabalUuids.has(uuid))
    .map((uuid) => nodeMap.get(uuid))
    .filter((n): n is GraphNode => !!n && n.type !== "episode");

  // Top entities by connection count (excluding ZABAL itself)
  const relCounts = new Map<string, number>();
  for (const edge of edges) {
    if (edge.source) relCounts.set(edge.source, (relCounts.get(edge.source) ?? 0) + 1);
    if (edge.target) relCounts.set(edge.target, (relCounts.get(edge.target) ?? 0) + 1);
  }

  const topEntities = [...entities]
    .filter((e) => !isZabalRelated(e) && e.type !== "episode")
    .sort((a, b) => (relCounts.get(b.uuid!) ?? 0) - (relCounts.get(a.uuid!) ?? 0))
    .slice(0, 8);

  const zabalEntity = entities.find(isZabalRelated);
  const hasGraphData = !isLoading && entities.length > 0;

  return (
    <div className="flex flex-col items-center justify-center px-6 lg:px-20 py-12 lg:py-24">
      <div className="z-10 flex flex-col items-start lg:items-center justify-center gap-2 lg:gap-4 mb-8 lg:mb-16">
        <p className="text-sm font-montserrat uppercase tracking-widest text-[var(--brand-primary)]">
          {subtitle}
        </p>
        <h2 className="text-2xl lg:text-5xl font-black font-montserrat">
          {title}
        </h2>
        <p className="max-w-full lg:max-w-[600px] mx-auto font-laro-soft text-left lg:text-center text-sm lg:text-base text-[#94A3B8]">
          {description}
        </p>
      </div>

      {/* ZABAL's connections — live from the knowledge graph */}
      {hasGraphData && zabalConnections.length > 0 && (
        <div className="w-full max-w-5xl mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-[var(--brand-primary)]" />
            <h3 className="text-lg font-bold font-montserrat">
              ZABAL&apos;s Network
            </h3>
            <span className="text-xs text-[#64748B]">
              {zabalConnections.length} connections
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {/* ZABAL entity card — highlighted */}
            {zabalEntity && (
              <Link
                href={`/graph?q=bettercallzaal`}
                className="shrink-0 w-40 flex flex-col items-center text-center p-4 rounded-xl bg-gradient-to-b from-[var(--brand-primary)]/15 to-[var(--brand-primary)]/5 border border-[var(--brand-primary)]/30 hover:border-[var(--brand-primary)]/60 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--brand-primary)]/20 flex items-center justify-center mb-2">
                  <Flame className="w-5 h-5 text-[var(--brand-primary)]" />
                </div>
                <h4 className="text-sm font-semibold text-[var(--brand-primary)]">
                  {zabalEntity.name}
                </h4>
                <p className="text-[10px] text-[#94A3B8] mt-1">
                  {relCounts.get(zabalEntity.uuid!) ?? 0} connections
                </p>
              </Link>
            )}
            {/* Connected entities */}
            {zabalConnections.slice(0, 10).map((node) => (
              <Link
                key={node.uuid}
                href={`/graph?q=${encodeURIComponent(node.name ?? "")}`}
                className="shrink-0 w-36 flex flex-col items-center text-center p-4 rounded-xl bg-[#22252B]/50 border border-white/5 hover:border-[var(--brand-primary)]/30 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2">
                  <Users className="w-4 h-4 text-[#94A3B8]" />
                </div>
                <h4 className="text-xs font-medium text-white/90 truncate w-full">
                  {node.name}
                </h4>
                {node.labels && node.labels.length > 0 && (
                  <p className="text-[10px] text-[#64748B] mt-1 capitalize">
                    {node.labels[0]}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Top entities from the knowledge graph */}
      {hasGraphData && topEntities.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl">
          {topEntities.map((entity) => {
            const count = relCounts.get(entity.uuid!) ?? 0;
            return (
              <Link
                key={entity.uuid}
                href={`/graph?q=${encodeURIComponent(entity.name ?? "")}`}
                className="group relative flex flex-col items-center text-center p-5 rounded-xl bg-[#22252B]/50 border border-white/5 hover:border-[var(--brand-primary)]/30 transition-all duration-300"
              >
                <h3 className="text-sm font-bold font-montserrat mb-1 truncate w-full">
                  {entity.name}
                </h3>
                {entity.labels && entity.labels.length > 0 && (
                  <span className="text-[10px] text-[var(--brand-primary)] uppercase tracking-wider mb-2 capitalize">
                    {entity.labels[0]}
                  </span>
                )}
                {(entity.summary || entity.content) && (
                  <p className="text-[11px] text-[#94A3B8] line-clamp-2 leading-relaxed">
                    {entity.summary || entity.content}
                  </p>
                )}
                {count > 0 && (
                  <span className="text-[10px] text-[#64748B] mt-2">
                    {count} connections
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-[#64748B]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
          {/* Fallback static cards when no graph data */}
          {[
            { label: "Builders", desc: "Developers and hackers shipping at ETH Boulder" },
            { label: "Musicians", desc: "Artists exploring Web3 music and tokenized royalties" },
            { label: "Creators", desc: "Generative artists and digital makers" },
            { label: "Speakers", desc: "Thought leaders sharing insights on Web3 and music" },
          ].map((item) => (
            <div
              key={item.label}
              className="group relative flex flex-col items-center text-center p-6 rounded-xl bg-[#22252B]/50 border border-white/5"
            >
              <h3 className="text-lg font-bold font-montserrat mb-2">
                {item.label}
              </h3>
              <p className="text-sm text-[#94A3B8]">{item.desc}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 flex gap-4">
        <Button variant="outline" href={ctaHref}>
          {cta}
        </Button>
        <Button variant="outline" href="/knowledge">
          Browse All
        </Button>
      </div>
    </div>
  );
}
