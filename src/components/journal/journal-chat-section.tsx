"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Image from "next/image";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Check,
  Copy,
  FileText,
  Linkedin,
  Loader2,
  MessageSquare,
  RefreshCw,
  Send,
  Sparkles,
} from "lucide-react";

import { siteCopy } from "@/content";
import type { ChatResponse } from "@/types";
import { apiClient } from "@/lib/api/client";

const SITE_URL = "https://ethboulderjournal.vercel.app";

const AGENT_ID = siteCopy.staticGraph.staticAgentId;
const BONFIRE_ID = siteCopy.staticGraph.staticBonfireId;

const CHAT_STORAGE_KEY = "delve.journal.chat";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const PRESET_PROMPTS = [
  "What happened at ETH Boulder?",
  "Who were the key builders?",
  "What were the main topics?",
  "Summarize the highlights",
];

const LINKEDIN_PROMPT = `You are a content writer helping someone create a LinkedIn post about their ETH Boulder 2026 experience. Based on everything in the knowledge graph about ETH Boulder — the people, projects, conversations, and activities — write a compelling LinkedIn post.

Requirements:
- Professional but authentic tone
- 150-300 words
- Include specific details (people met, projects discussed, insights gained)
- Use 2-3 relevant hashtags at the end (#ETHBoulder #Web3 etc.)
- Start with a hook that grabs attention
- End with a call to action or reflection`;

const BLOG_PROMPT = `You are a content writer helping someone create a blog post recap of their ETH Boulder 2026 experience for publishing on Paragraph (a web3 blogging platform). Based on everything in the knowledge graph about ETH Boulder — the people, projects, conversations, and activities — write a detailed blog post.

Requirements:
- Use markdown formatting with headers (##), bold, bullet points
- 500-1000 words
- Include sections for: Introduction, Key Highlights, People & Projects, Takeaways, What's Next
- Reference specific conversations, people, and projects from the knowledge graph
- Authentic, first-person narrative tone
- Suitable for the web3 community audience`;

type RecapFormat = "linkedin" | "blog";

function loadChatHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

function saveChatHistory(messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  try {
    // Keep last 50 messages
    const trimmed = messages.slice(-50);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Ignore quota errors
  }
}

export function JournalChatSection() {
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Recap state
  const [recapFormat, setRecapFormat] = useState<RecapFormat>("linkedin");
  const [recapContext, setRecapContext] = useState("");
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load chat history on mount
  useEffect(() => {
    setChatMessages(loadChatHistory());
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return;

      const userMsg: ChatMessage = { role: "user", content: message.trim() };
      const updated = [...chatMessages, userMsg];
      setChatMessages(updated);
      saveChatHistory(updated);
      setChatInput("");
      setIsChatLoading(true);

      try {
        const response = await apiClient.post<ChatResponse>(
          `/api/agents/${AGENT_ID}/chat`,
          {
            message: message.trim(),
            agent_id: AGENT_ID,
            bonfire_id: BONFIRE_ID,
            graph_mode: "adaptive",
            chat_history: updated.slice(-10).map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }
        );

        const assistantMsg: ChatMessage = {
          role: "assistant",
          content: response.reply || "No response from agent.",
        };
        const withReply = [...updated, assistantMsg];
        setChatMessages(withReply);
        saveChatHistory(withReply);
      } catch {
        const errorMsg: ChatMessage = {
          role: "assistant",
          content: "Failed to get a response. Try again.",
        };
        const withError = [...updated, errorMsg];
        setChatMessages(withError);
        saveChatHistory(withError);
      } finally {
        setIsChatLoading(false);
      }
    },
    [chatMessages]
  );

  const handleChatKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(chatInput);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedContent(null);

    const basePrompt =
      recapFormat === "linkedin" ? LINKEDIN_PROMPT : BLOG_PROMPT;
    const contextAddition = recapContext.trim()
      ? `\n\nAdditional context from the author: ${recapContext.trim()}`
      : "";
    const prompt = basePrompt + contextAddition + "\n\nWrite the content now:";

    try {
      const response = await apiClient.post<ChatResponse>(
        `/api/agents/${AGENT_ID}/chat`,
        {
          message: prompt,
          agent_id: AGENT_ID,
          bonfire_id: BONFIRE_ID,
          graph_mode: "adaptive",
          chat_history: [],
        }
      );
      setGeneratedContent(response.reply || "No content generated.");
    } catch {
      setGeneratedContent("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const shareText = generatedContent ?? "";
  const farcasterUrl = shareText
    ? `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText.slice(0, 300))}%0A%0A&embeds[]=${encodeURIComponent(SITE_URL + "/journal")}`
    : "";
  const xUrl = shareText
    ? `https://x.com/intent/tweet?text=${encodeURIComponent(shareText.slice(0, 250))}&url=${encodeURIComponent(SITE_URL + "/journal")}`
    : "";
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL)}`;

  return (
    <div className="bg-[#22252B]/50 border border-white/5 rounded-xl p-5 flex flex-col h-full">
      {/* Chat section */}
      <h2 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <MessageSquare className="w-3.5 h-3.5" />
        Ask the Graph
      </h2>

      {/* Chat messages */}
      <div className="flex-1 min-h-0 max-h-[250px] overflow-y-auto space-y-2 mb-3 pr-1">
        {chatMessages.length === 0 ? (
          <div className="space-y-1.5">
            {PRESET_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="w-full text-left text-xs text-[#94A3B8] hover:text-white bg-[#1a1d22] border border-white/5 rounded-lg px-3 py-2 hover:border-[var(--brand-primary)]/30 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        ) : (
          chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`text-xs rounded-lg px-3 py-2 ${
                msg.role === "user"
                  ? "bg-[var(--brand-primary)]/10 text-white ml-8"
                  : "bg-[#1a1d22] text-[#94A3B8] mr-4"
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => (
                    <p className="mb-1 last:mb-0 leading-relaxed">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-4 mb-1">{children}</ul>
                  ),
                  li: ({ children }) => <li className="mb-0.5">{children}</li>,
                  strong: ({ children }) => (
                    <strong className="font-semibold text-white">
                      {children}
                    </strong>
                  ),
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          ))
        )}
        {isChatLoading && (
          <div className="flex items-center gap-2 text-xs text-[#64748B] px-3 py-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            Thinking...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Chat input */}
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={handleChatKeyDown}
          placeholder="Ask about ETH Boulder..."
          className="flex-1 bg-[#1a1d22] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[var(--brand-primary)]/50"
        />
        <button
          onClick={() => sendMessage(chatInput)}
          disabled={isChatLoading || !chatInput.trim()}
          className="px-3 py-2 rounded-lg bg-[var(--brand-primary)] text-white text-xs hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-white/5 pt-4 mb-3">
        <h2 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Generate Recap
        </h2>
      </div>

      {/* Format toggle */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setRecapFormat("linkedin")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            recapFormat === "linkedin"
              ? "bg-[var(--brand-primary)] text-black"
              : "bg-[#1a1d22] border border-white/10 text-[#94A3B8] hover:text-white"
          }`}
        >
          <Linkedin className="w-3.5 h-3.5" />
          LinkedIn Post
        </button>
        <button
          onClick={() => setRecapFormat("blog")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            recapFormat === "blog"
              ? "bg-[var(--brand-primary)] text-black"
              : "bg-[#1a1d22] border border-white/10 text-[#94A3B8] hover:text-white"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Blog Post
        </button>
      </div>

      {/* Optional context */}
      <input
        type="text"
        value={recapContext}
        onChange={(e) => setRecapContext(e.target.value)}
        placeholder="Add topics or themes to highlight (optional)..."
        className="w-full bg-[#1a1d22] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[var(--brand-primary)]/50 mb-3"
      />

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--brand-primary)] text-white text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating {recapFormat === "linkedin" ? "LinkedIn post" : "blog post"}...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate {recapFormat === "linkedin" ? "LinkedIn Post" : "Blog Post"}
          </>
        )}
      </button>

      {/* Generated content preview */}
      {generatedContent && (
        <div className="mt-4">
          <div className="bg-[#1a1d22] border border-white/10 rounded-xl p-4 max-h-[300px] overflow-y-auto">
            <div className="text-xs text-[#A9A9A9] leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => (
                    <p className="mb-2 last:mb-0">{children}</p>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-sm font-bold text-white mt-3 mb-1">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xs font-semibold text-white mt-2 mb-1">
                      {children}
                    </h3>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-4 mb-2">{children}</ul>
                  ),
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  strong: ({ children }) => (
                    <strong className="font-semibold text-white">
                      {children}
                    </strong>
                  ),
                }}
              >
                {generatedContent}
              </ReactMarkdown>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {/* Copy */}
            <button
              onClick={() => handleCopy(generatedContent)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-colors text-[10px] font-medium"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>

            {/* LinkedIn */}
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleCopy(generatedContent)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0077B5]/10 border border-[#0077B5]/20 text-[#0077B5] hover:bg-[#0077B5]/20 transition-colors text-[10px] font-medium"
            >
              <Linkedin className="w-3 h-3" />
              LinkedIn
            </a>

            {/* Paragraph */}
            <a
              href="https://paragraph.xyz"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleCopy(generatedContent)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-colors text-[10px] font-medium"
            >
              <FileText className="w-3 h-3" />
              Paragraph
            </a>

            {/* Farcaster */}
            <a
              href={farcasterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#8A63D2]/10 border border-[#8A63D2]/20 text-[#8A63D2] hover:bg-[#8A63D2]/20 transition-colors text-[10px] font-medium"
            >
              <Image
                src="/icons/farcaster.svg"
                alt=""
                width={10}
                height={10}
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(45%) sepia(50%) saturate(1000%) hue-rotate(230deg)",
                }}
              />
              Farcaster
            </a>

            {/* X */}
            <a
              href={xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-colors text-[10px] font-medium"
            >
              <Image
                src="/icons/twitter.svg"
                alt=""
                width={10}
                height={10}
                className="opacity-70"
              />
              X
            </a>

            {/* Regenerate */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-colors text-[10px] font-medium disabled:opacity-40"
            >
              <RefreshCw className="w-3 h-3" />
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
