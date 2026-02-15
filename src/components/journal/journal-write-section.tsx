"use client";

import { useCallback, useEffect, useState } from "react";

import {
  CheckCircle,
  AlertCircle,
  Loader2,
  Send,
  Trash2,
} from "lucide-react";

import { siteCopy } from "@/content";
import {
  type JournalEntry,
  addJournalEntry,
  clearEntries,
  getJournalEntries,
  getSavedUserId,
  saveUserId,
  updateEntryStatus,
} from "@/lib/storage/journalEntries";

interface JournalWriteSectionProps {
  onEntryAdded?: () => void;
  entitySuggestions?: string[];
}

export function JournalWriteSection({
  onEntryAdded,
  entitySuggestions = [],
}: JournalWriteSectionProps) {
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Load persisted data on mount
  useEffect(() => {
    setEntries(getJournalEntries());
    setUserId(getSavedUserId());
  }, []);

  const handleUserIdChange = (value: string) => {
    setUserId(value);
    saveUserId(value);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = useCallback(async () => {
    if (!text.trim()) return;
    setIsSubmitting(true);
    setFeedback(null);

    // Build text with entity context
    const tagPrefix =
      selectedTags.length > 0
        ? `[About: ${selectedTags.join(", ")}] `
        : "";
    const fullText = tagPrefix + text.trim();

    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      text: text.trim(),
      timestamp: new Date().toISOString(),
      userId: userId.trim() || "zabal-community",
      status: "pending",
      tags: selectedTags.length > 0 ? [...selectedTags] : undefined,
    };

    // Optimistically add to local state
    addJournalEntry(entry);
    setEntries(getJournalEntries());
    setText("");
    setSelectedTags([]);

    try {
      const res = await fetch("/api/journal/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: fullText,
          userId: userId.trim() || "zabal-community",
        }),
      });

      if (res.ok) {
        updateEntryStatus(entry.id, "submitted");
        setFeedback({ type: "success", message: "Added to the knowledge graph!" });
        onEntryAdded?.();
      } else {
        updateEntryStatus(entry.id, "error");
        setFeedback({ type: "error", message: "Failed to add. Try again." });
      }
    } catch {
      updateEntryStatus(entry.id, "error");
      setFeedback({ type: "error", message: "Network error. Try again." });
    } finally {
      setIsSubmitting(false);
      setEntries(getJournalEntries());
    }
  }, [text, userId, selectedTags, onEntryAdded]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClear = () => {
    clearEntries();
    setEntries([]);
  };

  return (
    <div className="bg-[#22252B]/50 border border-white/5 rounded-xl p-5 flex flex-col h-full">
      <h2 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider mb-4">
        Write
      </h2>

      {/* Name input */}
      <input
        type="text"
        placeholder="Your name (optional)"
        value={userId}
        onChange={(e) => handleUserIdChange(e.target.value)}
        className="w-full bg-[#1a1d22] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[var(--brand-primary)]/50 mb-3"
      />

      {/* Textarea */}
      <textarea
        placeholder="Brain-dump your thoughts about ETH Boulder — who you met, what you learned, what inspired you..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={5}
        className="w-full bg-[#1a1d22] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[var(--brand-primary)]/50 resize-none"
      />

      {/* Entity tags */}
      {entitySuggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="text-[10px] text-[#64748B] self-center mr-1">
            Tag:
          </span>
          {entitySuggestions.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                selectedTags.includes(tag)
                  ? "bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] border border-[var(--brand-primary)]/40"
                  : "bg-[#1a1d22] text-[#64748B] border border-white/10 hover:text-white"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Submit row */}
      <div className="flex items-center justify-between mt-3">
        <span className="text-[10px] text-[#64748B]">{"\u2318"}+Enter</span>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !text.trim()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--brand-primary)] text-white text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {isSubmitting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          Add Entry
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

      {/* Entry feed */}
      {entries.length > 0 && (
        <div className="mt-4 flex-1 min-h-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-[#64748B] uppercase tracking-wider">
              Your entries ({entries.length})
            </span>
            <button
              onClick={handleClear}
              className="text-[10px] text-[#64748B] hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-2.5 h-2.5" />
              Clear
            </button>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {[...entries].reverse().map((entry) => (
              <div
                key={entry.id}
                className="bg-[#1a1d22] border border-white/5 rounded-lg p-3"
              >
                <p className="text-xs text-white/90 whitespace-pre-wrap leading-relaxed">
                  {entry.text}
                </p>
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex gap-1 mt-1.5">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-[#64748B]">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                  <span
                    className={`text-[10px] flex items-center gap-1 ${
                      entry.status === "submitted"
                        ? "text-green-400"
                        : entry.status === "error"
                          ? "text-red-400"
                          : "text-[#64748B]"
                    }`}
                  >
                    {entry.status === "submitted" ? (
                      <>
                        <CheckCircle className="w-2.5 h-2.5" /> Added
                      </>
                    ) : entry.status === "error" ? (
                      <>
                        <AlertCircle className="w-2.5 h-2.5" /> Failed
                      </>
                    ) : (
                      <>
                        <Loader2 className="w-2.5 h-2.5 animate-spin" /> Sending
                      </>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
