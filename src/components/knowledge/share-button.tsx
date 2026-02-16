"use client";

import Image from "next/image";

import { shareToFarcaster } from "@/lib/farcaster";

interface ShareButtonProps {
  text: string;
  embedUrl?: string;
  /** Visual size: "sm" for inline on cards, "md" for detail panel */
  size?: "sm" | "md";
  className?: string;
}

export function CastButton({
  text,
  embedUrl,
  size = "sm",
  className = "",
}: ShareButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    shareToFarcaster({ text, embedUrl });
  };

  if (size === "sm") {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#8A63D2]/10 text-[#8A63D2] hover:bg-[#8A63D2]/20 transition-colors text-[9px] font-medium ${className}`}
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
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8A63D2]/10 border border-[#8A63D2]/20 text-[#8A63D2] hover:bg-[#8A63D2]/20 transition-colors text-xs font-medium ${className}`}
    >
      <Image
        src="/icons/farcaster.svg"
        alt=""
        width={12}
        height={12}
        style={{
          filter:
            "brightness(0) saturate(100%) invert(45%) sepia(50%) saturate(1000%) hue-rotate(230deg)",
        }}
      />
      Cast on Farcaster
    </button>
  );
}

interface XShareButtonProps {
  text: string;
  url?: string;
  size?: "sm" | "md";
  className?: string;
}

export function XShareButton({
  text,
  url,
  size = "sm",
  className = "",
}: XShareButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const params = new URLSearchParams();
    params.set("text", text.slice(0, 250));
    if (url) params.set("url", url);
    window.open(
      `https://x.com/intent/tweet?${params.toString()}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  if (size === "sm") {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/5 text-white/50 hover:bg-white/10 transition-colors text-[9px] font-medium ${className}`}
        title="Post on X"
      >
        <Image
          src="/icons/twitter.svg"
          alt=""
          width={9}
          height={9}
          className="opacity-50"
        />
        X
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-colors text-xs font-medium ${className}`}
    >
      <Image
        src="/icons/twitter.svg"
        alt=""
        width={12}
        height={12}
        className="opacity-70"
      />
      Post on X
    </button>
  );
}
