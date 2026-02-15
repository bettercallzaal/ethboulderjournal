"use client";

import { BookOpen } from "lucide-react";

export function JournalHeader() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center mb-4">
        <BookOpen className="w-6 h-6 text-[var(--brand-primary)]" />
      </div>
      <h1 className="text-2xl lg:text-4xl font-black font-montserrat">
        Builder Journal
      </h1>
      <p className="text-sm lg:text-base text-[#94A3B8] mt-2 max-w-lg">
        Brain-dump your ETH Boulder experience, explore the knowledge graph, and
        generate recaps to share.
      </p>
    </div>
  );
}
