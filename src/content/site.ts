/**
 * Site-wide copy for metadata and SEO only.
 * For UI labels (buttons, dropdowns, etc.) use the `common` or feature-specific content modules.
 */
export const siteCopy = {
  siteName: "ZABAL Bonfires",
  title: "ZABAL",
  template: "%s | ZABAL Bonfires",
  description: {
    default:
      "ZABAL community hub — follow ETH Boulder 2026 live through knowledge graphs, people, and conversations. Powered by Bonfires.",
    short:
      "ZABAL community hub — follow ETH Boulder 2026 live through knowledge graphs and AI.",
  },
  keywords: [
    "ZABAL",
    "ETH Boulder",
    "knowledge graph",
    "web3 musicians",
    "community",
    "AI agents",
    "bonfires",
  ],
  author: "bettercallzaal",
  telegramGroupUrl: "https://t.me/+1MwB50azWsE3MTRh",
  twitterUrl: "https://x.com/bettercallzaal",
  discordUrl: "https://discord.gg/bonfiresai",
  staticGraph: {
    staticBonfireId: "698b70002849d936f4259848",
    staticAgentId: "698b70742849d936f4259849",
  },
  docsUrl: "https://docs.bonfires.ai/bonfires/docs/files/Welcome",
} as const;
