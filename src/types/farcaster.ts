/** Neynar API cast search response (simplified) */
export interface NeynarCast {
  hash: string;
  author: {
    fid: number;
    username: string;
    display_name: string;
    pfp_url: string;
  };
  text: string;
  timestamp: string;
  reactions: {
    likes_count: number;
    recasts_count: number;
  };
  replies: {
    count: number;
  };
  embeds?: { url?: string }[];
}

export interface NeynarSearchResponse {
  result: {
    casts: NeynarCast[];
    next?: { cursor: string };
  };
}

/** Normalized cast for UI display */
export interface FarcasterCastItem {
  hash: string;
  authorFid: number;
  authorUsername: string;
  authorDisplayName: string;
  authorAvatarUrl: string;
  text: string;
  timestamp: string;
  likes: number;
  recasts: number;
  replies: number;
  warpcastUrl: string;
}

export interface FarcasterFeedResponse {
  casts: FarcasterCastItem[];
  source: "neynar" | "unavailable";
  nextCursor?: string;
}
