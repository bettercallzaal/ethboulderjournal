"use client";

import { Users, Music, Code, Mic } from "lucide-react";

import { peopleSectionCopy } from "@/content/landing-page";

import { Button } from "../ui/button";

const COMMUNITY_HIGHLIGHTS = [
  {
    icon: Users,
    label: "Builders",
    description: "Developers and hackers shipping at ETH Boulder",
  },
  {
    icon: Music,
    label: "Musicians",
    description: "Artists exploring Web3 music, NFTs, and tokenized royalties",
  },
  {
    icon: Code,
    label: "Creators",
    description: "Generative artists, creative coders, and digital makers",
  },
  {
    icon: Mic,
    label: "Speakers",
    description: "Thought leaders sharing insights on Web3 and music",
  },
];

export default function PeopleSection() {
  const { title, subtitle, description, cta, ctaHref } = peopleSectionCopy;

  return (
    <div className="flex flex-col items-center justify-center px-6 lg:px-20 py-12 lg:py-24">
      <div className="z-10 flex flex-col items-start lg:items-center justify-center gap-2 lg:gap-4 mb-8 lg:mb-16">
        <p className="text-sm font-montserrat uppercase tracking-widest text-[var(--brand-primary)]">
          {subtitle}
        </p>
        <h2 className="text-2xl lg:text-5xl font-black font-montserrat">
          {title}
        </h2>
        <p className="max-w-full lg:max-w-[600px] mx-auto font-laro-soft text-left lg:text-center text-sm lg:text-base text-[#94A3B8]">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
        {COMMUNITY_HIGHLIGHTS.map((item) => (
          <div
            key={item.label}
            className="group relative flex flex-col items-center text-center p-6 rounded-xl bg-[#22252B]/50 border border-white/5 hover:border-[var(--brand-primary)]/30 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--brand-primary)]/20 transition-colors">
              <item.icon className="w-7 h-7 text-[var(--brand-primary)]" />
            </div>
            <h3 className="text-lg font-bold font-montserrat mb-2">
              {item.label}
            </h3>
            <p className="text-sm text-[#94A3B8]">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Button variant="outline" href={ctaHref}>
          {cta}
        </Button>
      </div>
    </div>
  );
}
