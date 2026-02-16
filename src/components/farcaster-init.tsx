"use client";

import { useEffect } from "react";

import { initFarcasterSdk } from "@/lib/farcaster";

/**
 * Initializes the Farcaster Mini App SDK on mount.
 * Drop this anywhere in the component tree — it's a no-op outside Farcaster.
 */
export function FarcasterInit() {
  useEffect(() => {
    initFarcasterSdk();
  }, []);
  return null;
}
