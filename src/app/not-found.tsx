import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[#0a0a0f]">
      <h1 className="text-6xl font-black font-montserrat text-white mb-4">
        404
      </h1>
      <p className="text-lg text-white/60 mb-8 max-w-md">
        This page doesn&apos;t exist yet. We&apos;re building fast at ETH
        Boulder — check back soon.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 rounded-lg bg-[var(--color-brand-primary,#ff6b2b)] text-black font-semibold text-sm hover:opacity-90 transition-opacity no-underline"
        >
          Go Home
        </Link>
        <Link
          href="/graph"
          className="px-6 py-3 rounded-lg border border-white/10 text-white/80 font-semibold text-sm hover:border-white/20 transition-colors no-underline"
        >
          Explore Graph
        </Link>
      </div>
    </div>
  );
}
