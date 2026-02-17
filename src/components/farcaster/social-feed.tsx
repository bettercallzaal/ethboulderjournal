"use client";

import Image from "next/image";

import { Heart, Loader2, MessageCircle, Repeat2, ExternalLink } from "lucide-react";

import { useFarcasterFeed } from "@/hooks/queries/useFarcasterFeed";
import { shareToFarcaster } from "@/lib/farcaster";
import type { FarcasterCastItem } from "@/types/farcaster";

function timeAgo(timestamp: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(timestamp).getTime()) / 1000,
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function CastCard({ cast }: { cast: FarcasterCastItem }) {
  return (
    <div className="bg-[#1a1d22] border border-white/5 rounded-xl p-4 hover:border-[var(--brand-primary)]/20 transition-colors">
      {/* Author */}
      <div className="flex items-center gap-2.5 mb-2.5">
        <Image
          src={cast.authorAvatarUrl || "/icons/farcaster.svg"}
          alt={cast.authorDisplayName}
          width={28}
          height={28}
          className="rounded-full"
          unoptimized
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-white truncate">
            {cast.authorDisplayName}
          </p>
          <p className="text-[10px] text-[#64748B]">
            @{cast.authorUsername}
          </p>
        </div>
        <span className="text-[10px] text-[#64748B] shrink-0">
          {timeAgo(cast.timestamp)}
        </span>
      </div>

      {/* Text */}
      <p className="text-[12px] text-[#94A3B8] leading-relaxed line-clamp-4 mb-3">
        {cast.text}
      </p>

      {/* Engagement + link */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-[#64748B]">
          <Heart className="w-3 h-3" />
          <span className="text-[10px]">{cast.likes}</span>
        </div>
        <div className="flex items-center gap-1 text-[#64748B]">
          <Repeat2 className="w-3 h-3" />
          <span className="text-[10px]">{cast.recasts}</span>
        </div>
        <div className="flex items-center gap-1 text-[#64748B]">
          <MessageCircle className="w-3 h-3" />
          <span className="text-[10px]">{cast.replies}</span>
        </div>
        <a
          href={cast.warpcastUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1 text-[10px] text-[#64748B] hover:text-[var(--brand-primary)] transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Warpcast
        </a>
      </div>
    </div>
  );
}

interface SocialFeedProps {
  maxItems?: number;
}

export function SocialFeed({ maxItems = 25 }: SocialFeedProps) {
  const { data, isLoading } = useFarcasterFeed();
  const casts = (data?.casts ?? []).slice(0, maxItems);
  const isUnavailable = data?.source === "unavailable";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-[#64748B]" />
      </div>
    );
  }

  if (isUnavailable || casts.length === 0) {
    return (
      <div className="text-center py-12 bg-[#1a1d22] border border-white/5 rounded-xl">
        <p className="text-sm text-[#64748B] mb-3">
          {isUnavailable
            ? "Farcaster feed coming soon!"
            : "No casts found yet — be the first to share!"}
        </p>
        <button
          onClick={() =>
            shareToFarcaster({
              text: "Check out the ZABAL community at ETH Boulder 2026! #onchaincreators",
            })
          }
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/30 rounded-lg text-sm text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/20 transition-colors"
        >
          Share on Farcaster
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {casts.map((cast) => (
        <CastCard key={cast.hash} cast={cast} />
      ))}
    </div>
  );
}
