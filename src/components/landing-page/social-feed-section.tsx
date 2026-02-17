"use client";

import { MessageCircle } from "lucide-react";

import { SocialFeed } from "@/components/farcaster/social-feed";

export default function SocialFeedSection() {
  return (
    <div className="flex flex-col items-center px-6 lg:px-20 py-12 lg:py-24">
      <div className="z-10 flex flex-col items-start lg:items-center gap-2 lg:gap-4 mb-8 lg:mb-16">
        <p className="text-sm font-montserrat uppercase tracking-widest text-[var(--brand-primary)] flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          Community
        </p>
        <h2 className="text-2xl lg:text-5xl font-black font-montserrat">
          What People Are Saying
        </h2>
        <p className="max-w-[600px] text-sm lg:text-base text-[#94A3B8] lg:text-center">
          Live casts from Farcaster mentioning ZABAL and ETH Boulder.
        </p>
      </div>
      <div className="w-full max-w-5xl">
        <SocialFeed maxItems={6} />
      </div>
    </div>
  );
}
