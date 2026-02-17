'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface FarcasterCast {
  hash: string;
  author: {
    username: string;
    displayName: string;
    pfp: string;
    fid: number;
  };
  text: string;
  timestamp: string;
  likes?: number;
  recasts?: number;
  replies?: number;
}

export default function FarcasterFeedPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['farcaster-feed'],
    queryFn: async () => {
      const res = await fetch('/api/farcaster/feed');
      if (!res.ok) throw new Error('Failed to fetch feed');
      return res.json();
    },
    enabled: mounted,
  });

  const casts = data?.casts || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-700 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            🎯 Farcaster Feed
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Live updates from ZABAL, ETH Boulder & Creator Community
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="text-slate-400">Loading casts...</div>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
              Failed to load feed. Please try again.
            </div>
          ) : casts.length === 0 ? (
            <div className="p-6 bg-slate-800 border border-slate-700 rounded-lg text-center text-slate-400">
              No casts found yet. Check back soon!
            </div>
          ) : (
            casts.map((cast: FarcasterCast) => (
              <a
                key={cast.hash}
                href={`https://warpcast.com/${cast.author.username}/${cast.hash.slice(0, 8)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-blue-500 hover:bg-slate-750 transition"
              >
                <div className="flex gap-3">
                  {/* Avatar */}
                  <img
                    src={cast.author.pfp || '/default-avatar.png'}
                    alt={cast.author.username}
                    className="w-12 h-12 rounded-full bg-slate-700"
                  />

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">
                          {cast.author.displayName || cast.author.username}
                        </div>
                        <div className="text-sm text-slate-400">
                          @{cast.author.username}
                        </div>
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(cast.timestamp).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Cast Text */}
                    <p className="mt-3 text-slate-200 leading-relaxed whitespace-pre-wrap break-words">
                      {cast.text}
                    </p>

                    {/* Stats */}
                    <div className="mt-3 flex gap-4 text-xs text-slate-500">
                      {cast.replies !== undefined && (
                        <span>💬 {cast.replies}</span>
                      )}
                      {cast.recasts !== undefined && (
                        <span>🔄 {cast.recasts}</span>
                      )}
                      {cast.likes !== undefined && (
                        <span>❤️ {cast.likes}</span>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}