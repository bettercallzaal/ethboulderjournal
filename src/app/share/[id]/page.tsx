import { redirect } from "next/navigation";
import type { Metadata } from "next";

const SITE_URL = "https://ethboulderjournal.vercel.app";

interface SharePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    name?: string;
    type?: string;
    summary?: string;
    connections?: string;
  }>;
}

/**
 * Dynamic metadata for Farcaster/OG previews.
 * When someone shares a link like /share/uuid?name=ETH+Boulder&type=entity&summary=...
 * Farcaster fetches this page's metadata and shows a rich card with the entity details.
 */
export async function generateMetadata({
  searchParams,
}: SharePageProps): Promise<Metadata> {
  const sp = await searchParams;
  const name = sp.name || "ZABAL Knowledge Graph";
  const type = sp.type || "entity";
  const summary = sp.summary || "Explore the ZABAL x ETH Boulder knowledge graph";
  const connections = sp.connections || "";

  const title = `${name} — ZABAL × ETH Boulder`;
  const description = summary.slice(0, 200);

  // Dynamic OG image with the entity/episode details
  const ogParams = new URLSearchParams();
  ogParams.set("name", name);
  ogParams.set("type", type);
  if (summary) ogParams.set("summary", summary.slice(0, 150));
  if (connections) ogParams.set("connections", connections);
  const ogImage = `${SITE_URL}/api/og/entity?${ogParams.toString()}`;

  // Farcaster Mini App embed
  const miniAppEmbed = JSON.stringify({
    version: "1",
    imageUrl: ogImage,
    button: {
      title: `Explore ${type === "episode" ? "Episode" : "Entity"}`,
      action: {
        type: "launch_frame",
        name: "ZABAL at ETH Boulder",
        url: `${SITE_URL}/knowledge`,
        splashImageUrl: `${SITE_URL}/logo-square.svg`,
        splashBackgroundColor: "#0a0a0f",
      },
    },
  });

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      siteName: "ZABAL × ETH Boulder",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    other: {
      "fc:miniapp": miniAppEmbed,
      "fc:frame": miniAppEmbed,
    },
  };
}

/**
 * The share page immediately redirects to the knowledge explorer.
 * Its only purpose is to provide dynamic metadata for Farcaster/OG embeds.
 */
export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  redirect(`/graph?centerNode=${id}`);
}
