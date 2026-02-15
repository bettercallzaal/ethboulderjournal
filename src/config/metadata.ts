import { Metadata } from "next";

import { siteCopy } from "@/content";

const { title, template, description, keywords, author, siteName } = siteCopy;

const SITE_URL = "https://ethboulderjournal.vercel.app";

const miniAppEmbed = JSON.stringify({
  version: "1",
  imageUrl: `${SITE_URL}/api/og/frame`,
  button: {
    title: "Explore ZABAL",
    action: {
      type: "launch_frame",
      name: "ZABAL at ETH Boulder",
      url: SITE_URL,
      splashImageUrl: `${SITE_URL}/logo-square.svg`,
      splashBackgroundColor: "#0a0a0f",
    },
  },
});

export const metadata: Metadata = {
  title: {
    default: title,
    template,
  },
  description: description.default,
  keywords: [...keywords],
  authors: [{ name: author }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteName,
    title,
    description: description.short,
    images: [{ url: `${SITE_URL}/api/og`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: description.short,
    images: [`${SITE_URL}/api/og`],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
  },
  other: {
    "fc:miniapp": miniAppEmbed,
    "fc:frame": miniAppEmbed,
  },
};
