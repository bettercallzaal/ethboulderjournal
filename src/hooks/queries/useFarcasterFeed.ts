"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { FarcasterFeedResponse } from "@/types/farcaster";

export function farcasterFeedQueryKey() {
  return ["farcaster-feed"] as const;
}

export function useFarcasterFeed() {
  return useQuery({
    queryKey: farcasterFeedQueryKey(),
    queryFn: () =>
      apiClient.get<FarcasterFeedResponse>("/api/farcaster/feed"),
    staleTime: 5 * 60 * 1000,
  });
}
