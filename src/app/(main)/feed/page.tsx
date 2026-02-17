"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Heart, Repeat2, MessageCircle, Share } from "lucide-react";

interface Cast {
  hash: string;
  author: {
    username: string;
    displayName: string;
    pfpUrl: string;
  };
  text: string;
  timestamp: string;
  likeCount: number;
  recastCount: number;
  replyCount: number;
  embedsCount?: number;
  embeds?: Array<{
    castId?: { hash: string };
    url?: string;
  }>;
}

export default function FeedPage() {
  const [casts, setCasts] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/farcaster/feed");
        if (!response.ok) throw new Error("Failed to fetch feed");
        const data = await response.json();
        setCasts(data.casts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
    const interval = setInterval(fetchFeed, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading && casts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-300">Loading feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-black p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🔥 ETH Boulder Live Feed</h1>
          <p className="text-slate-400">Latest conversations from the community</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {casts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No casts found. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {casts.map((cast) => (
              <div
                key={cast.hash}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-4 hover:border-slate-600 transition-all"
              >
                {/* Author */}
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={cast.author.pfpUrl}
                    alt={cast.author.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-white">{cast.author.displayName}</p>
                    <p className="text-xs text-slate-400">@{cast.author.username}</p>
                  </div>
                </div>

                {/* Text */}
                <p className="text-slate-200 mb-3 text-sm leading-relaxed">{cast.text}</p>

                {/* Embeds */}
                {cast.embeds && cast.embeds.length > 0 && (
                  <div className="mb-3 text-xs text-slate-400">
                    📎 {cast.embeds.length} attachment{cast.embeds.length > 1 ? "s" : ""}
                  </div>
                )}

                {/* Timestamp & Stats */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-700/50">
                  <span>{new Date(cast.timestamp).toLocaleDateString()}</span>
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" /> {cast.likeCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Repeat2 className="w-3 h-3" /> {cast.recastCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" /> {cast.replyCount}
                    </span>
                  </div>
                </div>

                {/* Action */}
                <Link
                  href={`https://warpcast.com/${cast.author.username}/${cast.hash.slice(0, 8)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View on Warpcast <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
