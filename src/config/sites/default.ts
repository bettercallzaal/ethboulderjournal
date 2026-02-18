/**
 * Default site config -- used as the baseline for this ZABAL deployment.
 */
import BonfireLanding from "@/components/landing-page/bonfire-landing";

import type { SiteConfig } from "./types";

export const defaultSiteConfig: SiteConfig = {
  navigation: [
    { label: "Home", href: "/" },
    {
      label: "Graph",
      dropdownItems: [
        { label: "ZABAL Graph", href: "/graph" },
        { label: "ETH Boulder Graph", href: "/graph" },
      ],
    },
    { label: "Knowledge", href: "/knowledge" },
    { label: "Journal", href: "/journal" },
    { label: "Hyperblogs", href: "/hyperblogs" },
  ],

  theme: {
    brandPrimary: "#ff6b2b",
    brandSecondary: "#ff9a5c",
    brandBlack: "#0a0a0f",
    brandSkyblue: "#4fc5ff",
  },

  landing: BonfireLanding,

  features: {
    graphExplorer: true,
    exploreBonfires: false,
    homePage: true,
  },
};
