"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Zap, Share2, BookOpen, Sparkles, Code, Users, Lightbulb, Settings, TrendingUp, Github, Network } from "lucide-react";

const FEATURES = [
  {
    id: "feed",
    name: "Live Feed",
    description: "ETH Boulder casts in real-time",
    icon: "Zap",
    href: "/feed",
    category: "Featured",
    badge: "New",
  },
  {
    id: "graph",
    name: "Knowledge Graph",
    description: "Interactive Bonfire visualization",
    icon: "Network",
    href: "/graph",
    category: "Featured",
    badge: "Core",
  },
  {
    id: "hyperblogs",
    name: "Hyperblogs",
    description: "Write & share rich content",
    icon: "BookOpen",
    href: "/hyperblogs",
    category: "Featured",
    badge: "New",
  },
  {
    id: "journal",
    name: "Journal",
    description: "Personal notes & insights",
    icon: "Sparkles",
    href: "/journal",
    category: "Featured",
  },
  {
    id: "ai-builder",
    name: "AI Builder",
    description: "Generate content with AI",
    icon: "Lightbulb",
    href: "/ai-builder",
    category: "Tools",
  },
  {
    id: "share",
    name: "Share Card",
    description: "Create shareable preview",
    icon: "Share2",
    href: "/share",
    category: "Tools",
  },
  {
    id: "settings",
    name: "Settings",
    description: "Customize your experience",
    icon: "Settings",
    href: "/settings",
    category: "Tools",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Browse the source code",
    icon: "Github",
    href: "https://github.com/bettercallzaal/ethboulderjournal",
    external: true,
    category: "Tools",
  },
  {
    id: "farcaster",
    name: "Farcaster",
    description: "Share & discover on Farcaster",
    icon: "Users",
    href: "https://warpcast.com",
    external: true,
    category: "Tools",
  },
  {
    id: "trending",
    name: "Trending",
    description: "Popular topics & discussions",
    icon: "TrendingUp",
    href: "/trending",
    category: "Tools",
  },
  {
    id: "code",
    name: "Developer Docs",
    description: "API & integration guide",
    icon: "Code",
    href: "/docs",
    category: "Tools",
  },
  {
    id: "insights",
    name: "Insights",
    description: "Analytics & data views",
    icon: "TrendingUp",
    href: "/insights",
    category: "Tools",
  },
];

const QUICK_ACCESS = FEATURES.filter((f) => f.category === "Featured");
const ICON_MAP = {
  Zap,
  Share2,
  BookOpen,
  Sparkles,
  Code,
  Users,
  Lightbulb,
  Settings,
  TrendingUp,
  Github,
  Network,
};

export function NavigationHub() {
  const [filter, setFilter] = useState("All");
  const filteredFeatures = filter === "All" ? FEATURES : FEATURES.filter((f) => f.category === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">🔗 ZABAL Bonfire</h1>
        <p className="text-xl text-slate-400 mb-8">ETH Boulder Knowledge Graph + Farcaster</p>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {QUICK_ACCESS.map((feature) => {
            const Icon = ICON_MAP[feature.icon as keyof typeof ICON_MAP] || Zap;
            return (
              <Link
                key={feature.id}
                href={feature.href}
                target={feature.external ? "_blank" : undefined}
                rel={feature.external ? "noopener noreferrer" : undefined}
                className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 p-4 hover:from-slate-700 hover:to-slate-800 transition-all duration-300 border border-slate-700 hover:border-slate-600"
              >
                <div className="flex flex-col gap-2">
                  <Icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <span className="font-semibold text-white text-sm">{feature.name}</span>
                  {feature.badge && (
                    <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded w-fit">
                      {feature.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {["All", "Featured", "Tools"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                filter === tab
                  ? "bg-blue-500 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Full Feature Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredFeatures.map((feature) => {
            const Icon = ICON_MAP[feature.icon as keyof typeof ICON_MAP] || Zap;
            return (
              <Link
                key={feature.id}
                href={feature.href}
                target={feature.external ? "_blank" : undefined}
                rel={feature.external ? "noopener noreferrer" : undefined}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-slate-700/50 hover:border-slate-600 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="flex flex-col gap-4 h-full">
                  <div className="flex items-start justify-between">
                    <Icon className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
                    {feature.badge && (
                      <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {feature.name}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">{feature.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-blue-400 text-sm font-medium group-hover:gap-3 transition-all">
                    Explore <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Tips Footer */}
      <div className="max-w-7xl mx-auto mt-16 p-6 rounded-xl bg-slate-800/30 border border-slate-700/30">
        <h3 className="font-semibold text-white mb-3">💡 Quick Tips</h3>
        <ul className="text-sm text-slate-300 space-y-2">
          <li>✨ Start with <strong>Live Feed</strong> to see ETH Boulder conversations</li>
          <li>🔗 Explore the <strong>Knowledge Graph</strong> to visualize connections</li>
          <li>📝 Write hyperblogs & share directly to Farcaster</li>
          <li>📊 Check <strong>Insights</strong> for analytics & trending topics</li>
        </ul>
      </div>
    </div>
  );
}
