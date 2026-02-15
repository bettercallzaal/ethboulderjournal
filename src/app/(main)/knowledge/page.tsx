"use client";

import { KnowledgeExplorer } from "@/components/knowledge";

export default function KnowledgePage() {
  return (
    <main className="flex flex-col px-4 lg:px-12 py-6 lg:py-12 min-h-screen max-w-screen-2xl mx-auto">
      <KnowledgeExplorer />
    </main>
  );
}
