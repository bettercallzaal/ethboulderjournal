"use client";

import { useState } from "react";

import Image from "next/image";

import { Flame, Loader2, Send, CheckCircle, AlertCircle, Activity } from "lucide-react";

import { Button } from "../ui/button";

const SITE_URL = "https://ethboulderjournal.vercel.app";

interface StackStatus {
  message_count: number;
  is_ready_for_processing: boolean;
  last_message_at: string | null;
}

export default function AddToMap() {
  const [text, setText] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [userId, setUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [status, setStatus] = useState<StackStatus | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/journal/status");
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch {
      // silently fail
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setIsSubmitting(true);
    setFeedback(null);
    setSubmittedText("");

    try {
      const res = await fetch("/api/journal/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          userId: userId.trim() || "zabal-community",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmittedText(text.trim());
        setFeedback({
          type: "success",
          message: `Added to the map! (${data.stack_count ?? 0} messages queued)`,
        });
        setText("");
        fetchStatus();
      } else {
        setFeedback({ type: "error", message: "Failed to add. Try again." });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error. Try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/journal/process", { method: "POST" });
      if (res.ok) {
        setFeedback({
          type: "success",
          message: "Processing queued messages into the knowledge graph...",
        });
        fetchStatus();
      } else {
        setFeedback({ type: "error", message: "Processing failed. Try again." });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const shareText = submittedText
    ? `${submittedText}\n\nAdded to the ZABAL x ETH Boulder knowledge graph`
    : "";

  const farcasterShareUrl = shareText
    ? `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(SITE_URL)}`
    : "";

  const xShareUrl = shareText
    ? `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(SITE_URL)}`
    : "";

  return (
    <div className="flex flex-col items-center justify-center px-6 lg:px-20 py-12 lg:py-24">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center mb-4">
            <Flame className="w-6 h-6 text-[var(--brand-primary)]" />
          </div>
          <h2 className="text-2xl lg:text-4xl font-black font-montserrat">
            Add to the Map
          </h2>
          <p className="text-sm lg:text-base text-[#94A3B8] mt-2 max-w-md">
            Share what you&apos;re building, learning, or discovering. Your
            contributions feed the ZABAL knowledge graph.
          </p>
        </div>

        {/* Input form */}
        <div className="bg-[#22252B]/50 border border-white/5 rounded-xl p-6">
          {/* Name input */}
          <input
            type="text"
            placeholder="Your name (optional)"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full bg-[#1a1d22] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[var(--brand-primary)]/50 mb-3"
          />

          {/* Message input */}
          <textarea
            placeholder="What are you building? What did you learn? Who did you meet? Share anything..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={4}
            className="w-full bg-[#1a1d22] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[var(--brand-primary)]/50 resize-none"
          />

          {/* Actions row */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-[#64748B]">
              {"\u2318"}+Enter to submit
            </span>

            <div className="flex items-center gap-3">
              {/* Status button */}
              <button
                onClick={fetchStatus}
                className="text-xs text-[#64748B] hover:text-[var(--brand-primary)] transition-colors flex items-center gap-1"
              >
                <Activity className="w-3 h-3" />
                Status
              </button>

              {/* Process button */}
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="text-xs text-[#64748B] hover:text-[var(--brand-primary)] transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Flame className="w-3 h-3" />
                )}
                Process
              </button>

              {/* Submit button */}
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !text.trim()}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Add to Map
              </Button>
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`mt-4 flex items-center gap-2 text-sm ${
                feedback.type === "success"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {feedback.message}
            </div>
          )}

          {/* Share buttons — appear after successful submission */}
          {feedback?.type === "success" && submittedText && (
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs text-[#64748B]">Share your insight:</span>
              <a
                href={farcasterShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8A63D2]/10 border border-[#8A63D2]/20 text-[#8A63D2] hover:bg-[#8A63D2]/20 transition-colors text-xs font-medium"
              >
                <Image src="/icons/farcaster.svg" alt="" width={14} height={14} className="brightness-0 invert opacity-70" style={{ filter: "brightness(0) saturate(100%) invert(45%) sepia(50%) saturate(1000%) hue-rotate(230deg)" }} />
                Farcaster
              </a>
              <a
                href={xShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-colors text-xs font-medium"
              >
                <Image src="/icons/twitter.svg" alt="" width={14} height={14} className="opacity-70" />
                Post on X
              </a>
            </div>
          )}

          {/* Stack status */}
          {status && (
            <div className="mt-4 flex items-center gap-4 text-xs text-[#64748B]">
              <span>
                {status.message_count} message{status.message_count !== 1 ? "s" : ""}{" "}
                queued
              </span>
              {status.is_ready_for_processing && (
                <span className="text-[var(--brand-primary)]">
                  Ready to process
                </span>
              )}
              {status.last_message_at && (
                <span>
                  Last:{" "}
                  {new Date(status.last_message_at).toLocaleTimeString()}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
