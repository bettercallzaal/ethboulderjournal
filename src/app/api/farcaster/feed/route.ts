import { NextRequest } from "next/server";

import {
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/api/server-utils";
import type {
  FarcasterCastItem,
  FarcasterFeedResponse,
  NeynarSearchResponse,
} from "@/types/farcaster";

const NEYNAR_API_KEY = process.env["NEYNAR_API_KEY"];
const SEARCH_QUERY = "ZABAL OR ethboulder OR onchaincreators";

function normalizeCast(
  cast: NeynarSearchResponse["result"]["casts"][number],
): FarcasterCastItem {
  return {
    hash: cast.hash,
    authorFid: cast.author.fid,
    authorUsername: cast.author.username,
    authorDisplayName: cast.author.display_name,
    authorAvatarUrl: cast.author.pfp_url,
    text: cast.text,
    timestamp: cast.timestamp,
    likes: cast.reactions.likes_count,
    recasts: cast.reactions.recasts_count,
    replies: cast.replies.count,
    warpcastUrl: `https://warpcast.com/${cast.author.username}/${cast.hash.slice(0, 10)}`,
  };
}

export async function GET(request: NextRequest) {
  if (!NEYNAR_API_KEY) {
    return createSuccessResponse<FarcasterFeedResponse>({
      casts: [],
      source: "unavailable",
    });
  }

  try {
    const cursor = request.nextUrl.searchParams.get("cursor");
    const url = new URL("https://api.neynar.com/v2/farcaster/cast/search");
    url.searchParams.set("q", SEARCH_QUERY);
    url.searchParams.set("limit", "25");
    if (cursor) url.searchParams.set("cursor", cursor);

    const response = await fetch(url.toString(), {
      headers: {
        "x-api-key": NEYNAR_API_KEY,
        accept: "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error(
        `[Farcaster Feed] Neynar API error: ${response.status}`,
      );
      return createSuccessResponse<FarcasterFeedResponse>({
        casts: [],
        source: "unavailable",
      });
    }

    const data = (await response.json()) as NeynarSearchResponse;
    const casts = (data.result?.casts ?? []).map(normalizeCast);

    return createSuccessResponse<FarcasterFeedResponse>({
      casts,
      source: "neynar",
      nextCursor: data.result?.next?.cursor,
    });
  } catch (error) {
    console.error("[Farcaster Feed] Error:", error);
    return createErrorResponse("Failed to fetch Farcaster feed", 500);
  }
}
