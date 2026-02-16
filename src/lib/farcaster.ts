"use client";

import { sdk } from "@farcaster/miniapp-sdk";

const SITE_URL = "https://ethboulderjournal.vercel.app";

let _isMiniApp: boolean | null = null;
let _initialized = false;

/**
 * Initialize the Farcaster Mini App SDK. Safe to call multiple times.
 * Must be called before using native SDK actions.
 */
export async function initFarcasterSdk(): Promise<void> {
  if (_initialized || typeof window === "undefined") return;
  _initialized = true;
  try {
    await sdk.actions.ready();
  } catch {
    // Not in a Farcaster client — safe to ignore
  }
}

/**
 * Check if we're running inside a Farcaster client (Mini App context).
 * Caches the result after first check.
 */
export function isFarcasterMiniApp(): boolean {
  if (_isMiniApp !== null) return _isMiniApp;
  try {
    _isMiniApp = typeof window !== "undefined" && !!sdk.context;
  } catch {
    _isMiniApp = false;
  }
  return _isMiniApp;
}

/**
 * Get the current Farcaster user context (username, fid, etc.)
 * Returns null if not in a Farcaster client.
 */
export async function getFarcasterUser(): Promise<{
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
} | null> {
  if (!isFarcasterMiniApp()) return null;
  try {
    const ctx = await sdk.context;
    if (ctx?.user) {
      return {
        fid: ctx.user.fid,
        username: ctx.user.username,
        displayName: ctx.user.displayName,
        pfpUrl: ctx.user.pfpUrl,
      };
    }
  } catch {
    // Not available
  }
  return null;
}

/**
 * Share content to Farcaster. Uses native composeCast() inside the Farcaster
 * client, falls back to opening Warpcast compose URL in a new tab.
 */
export async function shareToFarcaster(opts: {
  text: string;
  embedUrl?: string;
  channelKey?: string;
}): Promise<void> {
  const { text, embedUrl, channelKey } = opts;

  if (isFarcasterMiniApp()) {
    try {
      await sdk.actions.composeCast({
        text,
        embeds: embedUrl ? [embedUrl] : undefined,
        channelKey,
      });
      return;
    } catch {
      // Fall through to URL-based sharing
    }
  }

  // Fallback: open Warpcast compose URL
  const params = new URLSearchParams();
  params.set("text", text);
  if (embedUrl) params.append("embeds[]", embedUrl);
  if (channelKey) params.set("channelKey", channelKey);
  window.open(
    `https://warpcast.com/~/compose?${params.toString()}`,
    "_blank",
    "noopener,noreferrer",
  );
}

/**
 * Build a share text for a knowledge graph item.
 */
export function buildShareText(
  itemName: string,
  itemType: "entity" | "episode" | "connection",
): string {
  const typeLabel =
    itemType === "entity"
      ? "entity"
      : itemType === "episode"
        ? "episode"
        : "connection";
  return `${itemName}\n\nFrom the ZABAL x ETH Boulder knowledge graph (${typeLabel}) #onchaincreators`;
}

/**
 * Build a rich embed URL that shows dynamic OG/Farcaster previews.
 * Uses /share/[id] which has per-entity metadata and a dynamic OG image.
 */
export function buildEmbedUrl(opts?: {
  uuid?: string;
  name?: string;
  type?: "entity" | "episode";
  summary?: string;
  connections?: number;
}): string {
  if (!opts?.uuid) return `${SITE_URL}/knowledge`;

  const params = new URLSearchParams();
  if (opts.name) params.set("name", opts.name.slice(0, 100));
  if (opts.type) params.set("type", opts.type);
  if (opts.summary) params.set("summary", opts.summary.slice(0, 200));
  if (opts.connections) params.set("connections", String(opts.connections));

  return `${SITE_URL}/share/${opts.uuid}?${params.toString()}`;
}

/**
 * Simple embed URL (just links to graph centered on a node).
 */
export function buildGraphUrl(uuid?: string): string {
  if (uuid) return `${SITE_URL}/graph?centerNode=${uuid}`;
  return `${SITE_URL}/knowledge`;
}
