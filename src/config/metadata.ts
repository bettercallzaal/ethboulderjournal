import { Metadata } from "next";

import { siteCopy } from "@/content";

const { title, template, description, keywords, author, siteName } = siteCopy;

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
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: description.short,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
  },
  other: {
    "fc:frame": JSON.stringify({
      version: "1",
      imageUrl: "https://ethboulderjournal.vercel.app/eth-boulder-logo.svg",
      button: {
        title: "Explore ZABAL",
        action: {
          type: "launch_frame",
          name: "ZABAL x ETH Boulder",
          url: "https://ethboulderjournal.vercel.app",
          splashImageUrl: "https://ethboulderjournal.vercel.app/logo-square.svg",
          splashBackgroundColor: "#0a0a0f",
        },
      },
    }),
  },
};
