"use client";

import Link from "next/link";

import { Construction } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
        <Construction className="w-8 h-8 text-[var(--brand-primary)]" />
      </div>
      <h1 className="text-3xl lg:text-4xl font-black font-montserrat text-white mb-3">
        {title}
      </h1>
      <p className="text-white/50 text-sm lg:text-base max-w-md mb-8">
        {description ?? "This feature is coming soon. We're building it right now at ETH Boulder."}
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-lg border border-white/10 text-white/70 text-sm hover:border-white/20 transition-colors no-underline"
      >
        Back to Home
      </Link>
    </div>
  );
}
