"use client";

import { Suspense, useMemo } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import type { NodeData } from "@/components/graph-explorer/NodeContextMenu";
import { useSubdomainBonfire, useBonfireSelection } from "@/contexts";

import { GraphExplorer } from "@/components/graph-explorer/GraphExplorer";

function GraphExplorerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { subdomainConfig, isSubdomainScoped } = useSubdomainBonfire();
  const { active: activeBonfire } = useBonfireSelection();

  const bonfireId = searchParams.get("bonfireId");
  const agentId = searchParams.get("agentId");

  const staticGraph = useMemo(() => {
    if (isSubdomainScoped && subdomainConfig) {
      return {
        staticBonfireId: subdomainConfig.bonfireId,
        staticAgentId: subdomainConfig.agentId ?? "",
      };
    }
    return {
      staticBonfireId: activeBonfire.bonfireId,
      staticAgentId: activeBonfire.agentId,
    };
  }, [isSubdomainScoped, subdomainConfig, activeBonfire]);

  const effectiveBonfireId =
    isSubdomainScoped && subdomainConfig
      ? subdomainConfig.bonfireId
      : bonfireId ?? activeBonfire.bonfireId;
  const effectiveAgentId =
    isSubdomainScoped && subdomainConfig
      ? (subdomainConfig.agentId ?? agentId)
      : agentId ?? activeBonfire.agentId;

  const handleCreateDataRoom = (nodeData: NodeData, bfId: string) => {
    const params = new URLSearchParams();
    params.set("bonfireId", bfId);
    params.set("centerNode", nodeData.id.replace(/^n:/, ""));
    params.set("nodeName", nodeData.label || nodeData.name || "");

    router.push(`/datarooms/create?${params.toString()}`);
  };

  return (
    <div className="min-h-[calc(100dvh-5rem)] flex flex-col relative">
      <GraphExplorer
        initialBonfireId={effectiveBonfireId ?? undefined}
        initialAgentId={effectiveAgentId ?? undefined}
        onCreateDataRoom={handleCreateDataRoom}
        className="flex-1"
        staticGraph={staticGraph}
      />
    </div>
  );
}

export default function GraphPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-[calc(100dvh-5rem)]">
          <span className="text-white/80">Loading graph...</span>
        </div>
      }
    >
      <GraphExplorerContent />
    </Suspense>
  );
}
