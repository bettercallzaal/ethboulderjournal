'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSiteConfig } from '@/contexts';

interface NavItem {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
  badge?: string;
}

export function NavigationHub() {
  const router = useRouter();
  const { features } = useSiteConfig();
  const [activeFilter, setActiveFilter] = useState<'all' | 'featured' | 'tools'>('all');

  const navItems: NavItem[] = [
    // Featured/Primary
    {
      title: 'Knowledge Graph',
      description: 'Explore connections between ideas, people & projects',
      href: '/graph',
      icon: '🧠',
      color: 'from-purple-500 to-pink-500',
      badge: 'Main Hub'
    },
    {
      title: 'Journal',
      description: 'Capture thoughts, tag entities & generate recaps',
      href: '/journal',
      icon: '📓',
      color: 'from-blue-500 to-cyan-500',
      badge: 'Brain Dump'
    },
    {
      title: 'Farcaster Feed',
      description: 'Follow ETH Boulder live on Farcaster',
      href: '/feed',
      icon: '🎯',
      color: 'from-orange-500 to-red-500',
      badge: 'Social'
    },
    {
      title: 'HyperBlogs',
      description: 'AI-generated articles from the knowledge graph',
      href: '/hyperblogs',
      icon: '✍️',
      color: 'from-green-500 to-emerald-500',
      badge: 'Content'
    },
    {
      title: 'Explore',
      description: 'Discover new topics & curated collections',
      href: '/explore',
      icon: '🔍',
      color: 'from-indigo-500 to-purple-500',
      badge: 'Discovery'
    },
    {
      title: 'Dashboard',
      description: 'Track events, votes & community activity',
      href: '/dashboard',
      icon: '📊',
      color: 'from-yellow-500 to-orange-500',
      badge: 'Analytics'
    },
    {
      title: 'Bonfire Settings',
      description: 'Configure your knowledge graph & preferences',
      href: '/bonfire-settings',
      icon: '⚙️',
      color: 'from-slate-500 to-gray-500',
      badge: 'Config'
    },
    {
      title: 'Documents',
      description: 'Manage & organize event documents & notes',
      href: '/documents',
      icon: '📁',
      color: 'from-pink-500 to-rose-500',
      badge: 'Files'
    },
    {
      title: 'Knowledge Base',
      description: 'Quick reference & how-to guides',
      href: '/knowledge',
      icon: '📚',
      color: 'from-teal-500 to-cyan-500',
      badge: 'Help'
    },
    {
      title: 'Profile',
      description: 'Manage your account & public profile',
      href: '/profile',
      icon: '👤',
      color: 'from-violet-500 to-purple-500',
      badge: 'Account'
    },
  ];

  const filteredItems = navItems.filter(item => {
    if (activeFilter === 'featured') {
      return ['Knowledge Graph', 'Journal', 'Farcaster Feed'].includes(item.title);
    }
    if (activeFilter === 'tools') {
      return ['Dashboard', 'Bonfire Settings', 'Documents', 'Knowledge Base', 'Profile'].includes(item.title);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-700 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ZABAL ETH Boulder
              </h1>
              <p className="text-sm text-slate-400">Knowledge Graph & Community Hub</p>
            </div>
            <div className="flex gap-2">
              {features.signIn && (
                <Link href="/sign-in" className="px-4 py-2 text-sm rounded-lg border border-slate-600 hover:border-slate-500 hover:bg-slate-800 transition">
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Filter Tabs - Mobile Friendly */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(['all', 'featured', 'tools'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {filter === 'all' ? 'All' : filter === 'featured' ? '⭐ Featured' : '🛠️ Tools'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Quick Start for Mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {navItems.slice(0, 4).map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative overflow-hidden rounded-lg p-4 bg-slate-800 border border-slate-700 hover:border-slate-600 transition hover:bg-slate-700 text-center"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-sm font-medium line-clamp-1">{item.title}</div>
                <div className="text-xs text-slate-400 mt-1">{item.badge}</div>
              </Link>
            ))}
          </div>

          {/* Full Grid Navigation */}
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-white mt-8">
              {activeFilter === 'all' ? 'All Features' : activeFilter === 'featured' ? '⭐ Featured' : '🛠️ Tools'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-slate-600 transition hover:shadow-xl hover:shadow-blue-500/20"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition`} />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-4xl">{item.icon}</div>
                      {item.badge && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-700 text-slate-200">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-400 group-hover:text-slate-300 transition line-clamp-2">
                      {item.description}
                    </p>

                    {/* Arrow */}
                    <div className="mt-4 flex items-center text-blue-400 text-sm font-medium group-hover:translate-x-1 transition">
                      Explore →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-12 mb-6 p-6 rounded-lg bg-slate-800/50 border border-slate-700">
            <h3 className="font-bold text-white mb-2">💡 Quick Tips</h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>✨ Start with <strong>Journal</strong> to capture your ETH Boulder experience</li>
              <li>🧠 Use <strong>Knowledge Graph</strong> to see all connections & relationships</li>
              <li>🎯 Check <strong>Farcaster Feed</strong> to stay in the social loop</li>
              <li>📓 Generate <strong>HyperBlogs</strong> from your journal entries</li>
              <li>⚙️ Configure your experience in <strong>Bonfire Settings</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}