"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";

import { useRouter } from "next/navigation";

import Image from "next/image";

import {
  Activity,
  Flame,
  Loader2,
  RefreshCw,
} from "lucide-react";

const SITE_URL = "https://ethboulderjournal.vercel.app";

import { siteCopy } from "@/content";
import type { AgentLatestEpisodesResponse } from "@/types";
import { apiClient } from "@/lib/api/client";

interface EpisodeItem {
  uuid: string;
  name?: string;
  content?: string;
  valid_at?: string;
}

interface StackStatus {
  message_count: number;
  is_ready_for_processing: boolean;
  last_message_at: string | null;
}

export interface JournalGraphFeedHandle {
  refresh: () => void;
}

export const JournalGraphFeed = forwardRef<JournalGraphFeedHandle>(
  function JournalGraphFeed(_props, ref) {
    const router = useRouter();
    const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState<StackStatus | null>(null);
    const [feedback, setFeedback] = useState<{
      type: "success" | "error";
      message: string;
    } | null>(null);

    const agentId = siteCopy.staticGraph.staticAgentId;
    const bonfireId = siteCopy.staticGraph.staticBonfireId;

    const fetchEpisodes = useCallback(async () => {
      setLoading(true);
      try {
        const response = await apiClient.post<AgentLatestEpisodesResponse>(
          `/api/agents/${agentId}/episodes/search`,
          { limit: 15 }
        );
        const items: EpisodeItem[] = (response.episodes ?? []).map(
          (episode) => {
            const r = episode as Record<string, unknown>;
            return {
              uuid: String(r["uuid"] ?? r["id"] ?? ""),
              name: (r["name"] ?? r["title"]) as string | undefined,
              content: (r["summary"] ?? r["content"]) as string | undefined,
              valid_at: r["valid_at"] as string | undefined,
            };
          }
        );
        setEpisodes(items.filter((e) => e.uuid));
      } catch {
        setEpisodes([]);
      } finally {
        setLoading(false);
      }
    }, [agentId]);

    const fetchStatus = useCallback(async () => {
      try {
        const res = await fetch("/api/journal/status");
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
        }
      } catch {
        // Silently fail
      }
    }, []);

    const handleProcess = async () => {
      setIsProcessing(true);
      setFeedback(null);
      try {
        const res = await fetch("/api/journal/process", { method: "POST" });
        if (res.ok) {
          setFeedback({
            type: "success",
            message: "Processing into the knowledge graph...",
          });
          fetchStatus();
          // Refresh episodes after a delay to let processing complete
          setTimeout(fetchEpisodes, 3000);
        } else {
          setFeedback({ type: "error", message: "Processing failed." });
        }
      } catch {
        setFeedback({ type: "error", message: "Network error." });
      } finally {
        setIsProcessing(false);
      }
    };

    useEffect(() => {
      fetchEpisodes();
      fetchStatus();
    }, [fetchEpisodes, fetchStatus]);

    useImperativeHandle(ref, () => ({
      refresh: () => {
        fetchEpisodes();
        fetchStatus();
      },
    }));

    const handleEpisodeClick = (uuid: string) => {
      const params = new URLSearchParams();
      params.set("bonfireId", bonfireId);
      params.set("agentId", agentId);
      params.set("centerNode", uuid);
      router.push(`/graph?${params.toString()}`);
    };

    function formatDate(dateStr?: string): string {
      if (!dateStr) return "";
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "";
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch {
        return "";
      }
    }

    function truncate(str: string, max: number): string {
      if (str.length <= max) return str;
      return str.slice(0, max).trimEnd() + "...";
    }

    return (
      <div className="bg-[#22252B]/50 border border-white/5 rounded-xl p-5 flex flex-col h-full">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider">
            Knowledge Graph
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { fetchEpisodes(); fetchStatus(); }}
              className="text-[10px] text-[#64748B] hover:text-[var(--brand-primary)] transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className="text-[10px] text-[#64748B] hover:text-[var(--brand-primary)] transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Flame className="w-3 h-3" />
              )}
              Process
            </button>
          </div>
        </div>

        {/* Status bar */}
        {status && (
          <div className="flex items-center gap-3 text-[10px] text-[#64748B] mb-3 pb-3 border-b border-white/5">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {status.message_count} queued
            </span>
            {status.is_ready_for_processing && (
              <span className="text-[var(--brand-primary)]">Ready to process</span>
            )}
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div
            className={`mb-3 text-xs ${
              feedback.type === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Episodes feed */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-[#64748B]" />
            </div>
          ) : episodes.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#64748B]">
              No episodes yet. Add entries and process them to build the graph.
            </div>
          ) : (
            episodes.map((ep) => {
              const episodeText = ep.name || ep.content || "";
              const shareText = `${truncate(episodeText, 200)}\n\nFrom the ZABAL x ETH Boulder knowledge graph #onchaincreators`;
              const castUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(SITE_URL + "/graph?centerNode=" + ep.uuid)}`;

              return (
                <div
                  key={ep.uuid}
                  className="bg-[#1a1d22] border border-white/5 rounded-lg p-3 hover:border-[var(--brand-primary)]/30 transition-colors"
                >
                  <button
                    onClick={() => handleEpisodeClick(ep.uuid)}
                    className="w-full text-left cursor-pointer"
                  >
                    {ep.name && (
                      <p className="text-xs font-medium text-white/90 mb-1">
                        {truncate(ep.name, 80)}
                      </p>
                    )}
                    {ep.content && (
                      <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                        {truncate(ep.content, 120)}
                      </p>
                    )}
                  </button>
                  <div className="flex items-center justify-between mt-2">
                    {ep.valid_at ? (
                      <span className="text-[10px] text-[#64748B]">
                        {formatDate(ep.valid_at)}
                      </span>
                    ) : (
                      <span />
                    )}
                    <a
                      href={castUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#8A63D2]/10 text-[#8A63D2] hover:bg-[#8A63D2]/20 transition-colors text-[9px] font-medium"
                      title="Share on Farcaster"
                    >
                      <Image
                        src="/icons/farcaster.svg"
                        alt=""
                        width={9}
                        height={9}
                        style={{
                          filter:
                            "brightness(0) saturate(100%) invert(45%) sepia(50%) saturate(1000%) hue-rotate(230deg)",
                        }}
                      />
                      Cast
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }
);
