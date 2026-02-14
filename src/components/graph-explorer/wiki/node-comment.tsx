"use client";

import React, { useState } from "react";

import Image from "next/image";

import { Loader2, MessageSquarePlus, CheckCircle, AlertCircle } from "lucide-react";

const SITE_URL = "https://ethboulderjournal.vercel.app";

interface NodeCommentProps {
  nodeName: string;
  nodeId: string;
}

export function NodeComment({ nodeName, nodeId }: NodeCommentProps) {
  const [comment, setComment] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    setIsSubmitting(true);
    setFeedback(null);
    setSubmittedText("");

    try {
      const res = await fetch("/api/journal/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `[Note on "${nodeName}" (${nodeId})] ${comment.trim()}`,
          userId: "zabal-community",
        }),
      });

      if (res.ok) {
        setSubmittedText(comment.trim());
        setFeedback({
          type: "success",
          message: "Note added to the knowledge graph!",
        });
        setComment("");
      } else {
        setFeedback({ type: "error", message: "Failed to add note." });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareText = submittedText
    ? `${submittedText}\n\nNote on "${nodeName}" — ZABAL x ETH Boulder`
    : "";

  const farcasterUrl = shareText
    ? `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(SITE_URL + "/graph")}`
    : "";

  const xUrl = shareText
    ? `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(SITE_URL + "/graph")}`
    : "";

  return (
    <section className="pt-3 border-t border-[#37393F]">
      <h3 className="font-medium mb-2 flex items-center gap-1.5">
        <MessageSquarePlus className="w-3.5 h-3.5" />
        Add a Note
      </h3>

      <div className="flex gap-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={`What do you think about ${nodeName}?`}
          className="flex-1 bg-[#1a1d22] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[var(--brand-primary)]/50"
        />
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !comment.trim()}
          className="px-3 py-2 rounded-lg bg-[var(--brand-primary)] text-white text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-1 shrink-0"
        >
          {isSubmitting ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            "Add"
          )}
        </button>
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`mt-2 flex items-center gap-1.5 text-xs ${
            feedback.type === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <AlertCircle className="w-3 h-3" />
          )}
          {feedback.message}
        </div>
      )}

      {/* Share buttons after success */}
      {feedback?.type === "success" && submittedText && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[10px] text-[#64748B]">Share:</span>
          <a
            href={farcasterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#8A63D2]/10 border border-[#8A63D2]/20 text-[#8A63D2] hover:bg-[#8A63D2]/20 transition-colors text-[10px] font-medium"
          >
            <Image src="/icons/farcaster.svg" alt="" width={10} height={10} style={{ filter: "brightness(0) saturate(100%) invert(45%) sepia(50%) saturate(1000%) hue-rotate(230deg)" }} />
            Farcaster
          </a>
          <a
            href={xUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-colors text-[10px] font-medium"
          >
            <Image src="/icons/twitter.svg" alt="" width={10} height={10} className="opacity-70" />
            X
          </a>
        </div>
      )}
    </section>
  );
}
