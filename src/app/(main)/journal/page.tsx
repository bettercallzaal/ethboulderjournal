"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { siteCopy } from "@/content";
import type { AgentLatestEpisodesResponse } from "@/types";
import { apiClient } from "@/lib/api/client";

import {
  JournalHeader,
  JournalWriteSection,
  JournalGraphFeed,
  JournalChatSection,
} from "@/components/journal";
import type { JournalGraphFeedHandle } from "@/components/journal";

export default function JournalPage() {
  const feedRef = useRef<JournalGraphFeedHandle>(null);
  const [entitySuggestions, setEntitySuggestions] = useState<string[]>([]);

  const agentId = siteCopy.staticGraph.staticAgentId;

  // Fetch entity names for tag suggestions
  useEffect(() => {
    async function fetchEntities() {
      try {
        const response = await apiClient.post<AgentLatestEpisodesResponse>(
          `/api/agents/${agentId}/episodes/search`,
          { limit: 5 }
        );
        const names = new Set<string>();
        for (const entity of response.entities ?? []) {
          const r = entity as Record<string, unknown>;
          const name = (r["name"] ?? r["title"]) as string | undefined;
          if (name && name.length < 40) names.add(name);
        }
        setEntitySuggestions([...names].slice(0, 8));
      } catch {
        // No suggestions available
      }
    }
    fetchEntities();
  }, [agentId]);

  const handleEntryAdded = useCallback(() => {
    feedRef.current?.refresh();
  }, []);

  return (
    <main className="flex flex-col px-4 lg:px-12 py-6 lg:py-12 min-h-screen max-w-screen-2xl mx-auto">
      <JournalHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-8 lg:min-h-[calc(100vh-16rem)]">
        <JournalWriteSection
          onEntryAdded={handleEntryAdded}
          entitySuggestions={entitySuggestions}
        />
        <JournalGraphFeed ref={feedRef} />
        <JournalChatSection />
      </div>
    </main>
  );
}
