import { siteCopy } from "./site";
import { LINKS_DATA, NODES_DATA } from "./static-graph";

export const heroCopy = {
  logo: "/eth-boulder-logo.svg",
  logoAlt: "ZABAL x ETH Boulder",
  title: "ZABAL x ETH Boulder",
  description:
    "Your window into ETH Boulder 2026 — who's building, what they're talking about, and how to be part of it.",
  primaryCta: "Explore the Graph",
  primaryCtaHref: "/graph",
  secondaryCta: "Join ZABAL Community",
  secondaryCtaMobile: "Join ZABAL",
  secondaryCtaHref: siteCopy.telegramGroupUrl,
};

export const staticGraphNodes = {
  NODES_DATA,
  LINKS_DATA,
};

export const knowledgeGraphSectionCopy = {
  title: "People & Conversations",
  subtitle: "The ZABAL Knowledge Graph.",
  description:
    "Navigate the people, ideas, and conversations happening at ETH Boulder through an interactive knowledge graph. See who's here, what they're building, and how it all connects.",
  paragraphs: [
    {
      heading: "Live Updates",
      description:
        "The graph is built from live conversations, sessions, and builder updates happening throughout ETH Boulder. Every 20 minutes, new activity is captured and woven into the collective story.",
    },
    {
      heading: "People & Projects",
      description:
        "The ZABAL community and ETH Boulder builders are extracted as entities — people, projects, topics, and ideas — so you can see who's working on what and find your people.",
    },
    {
      heading: "Connections",
      description:
        "People are connected to projects, projects to ideas, and ideas to each other. The graph reveals the hidden relationships across the community, helping you discover collaborators and opportunities.",
    },
  ],
  cta: "Explore ZABAL Graph",
  ctaHref: "/graph",
};

export const hyperblogsPreviewSectionCopy = {
  title: "Hyperblogs",
  tooltipIcon: "/icons/tooltip.svg",
  tooltipAlt: "Hyperblogs Info",
  cta: "Create your own",
  ctaHref: "/hyperblogs",
  tooltipContent: [
    "Hyperblogs are AI-generated long-form content from the ZABAL knowledge graph. They turn dynamic conversations into shareable stories.",
    "Choose a topic from the graph and a writing prompt. The system pulls relevant context from ETH Boulder conversations to generate a rich blog post.",
    "Hyperblogs cost $0.25 and are payable in USDC on Base using x402 payments.",
  ],
  description:
    "Hyperblogs turn the live ETH Boulder conversations into shareable long-form content. Pick a topic, give it a prompt, and let the knowledge graph generate a story from the community's collective intelligence.",
  featuredBlogTitle: "Featured Hyperblog",
  latestBlogsTitle: "Latest Hyperblogs",
  viewMoreCtaTitle: "View More",
  viewMoreCtaHref: "/hyperblogs",
};

export const howItWorksSectionCopy = {
  title: "How ZABAL Works",
  description:
    "From conversations to collective intelligence — ZABAL captures what's happening at ETH Boulder and makes it explorable.",
  steps: [
    {
      icon: "icons/search.svg",
      title: "Capture",
      description:
        "Conversations, builder updates, session notes, and community messages flow into the ZABAL Bonfire from ETH Boulder.",
    },
    {
      icon: "icons/upload-file.svg",
      title: "Structure",
      description:
        "Raw conversations are processed into episodes and entities — people, projects, ideas, and their relationships form a living knowledge graph.",
    },
    {
      icon: "icons/cottage.svg",
      title: "Explore",
      description:
        "Navigate the graph to discover who's building what, find collaborators, and understand the full picture of ETH Boulder through ZABAL's lens.",
    },
    {
      icon: "icons/auto-awesome.svg",
      title: "Share",
      description:
        "Generate Hyperblogs, share insights, and bring the ETH Boulder experience to the wider ZABAL community — even if you can't be there in person.",
    },
  ],
};

export const peopleSectionCopy = {
  title: "Who's at ETH Boulder",
  subtitle: "The ZABAL Community",
  description:
    "Meet the builders, musicians, and creators in the ZABAL community. See what they're working on and what they're talking about at ETH Boulder 2026.",
  cta: "See Everyone",
  ctaHref: "/graph",
};

export const footerCopy = {
  title: "Ready to Explore?",
  mobileTitle: "Join ZABAL",
  subtitle:
    "Dive into the ETH Boulder knowledge graph, discover what people are building, or generate your own Hyperblog from the community's collective intelligence.",
  mobileSubtitle:
    "Follow along with ETH Boulder through ZABAL — questions, collabs, or just vibes, we're here.",
  primaryCta: "Explore the Graph",
  primaryCtaHref: "/graph",
  secondaryCta: "Join ZABAL Community",
  secondaryCtaHref: siteCopy.telegramGroupUrl,
  logo: "/eth-boulder-logo.svg",
  logoAlt: "ZABAL x ETH Boulder",
  socialLinks: [
    {
      icon: "/icons/twitter.svg",
      href: siteCopy.twitterUrl,
    },
    {
      icon: "/icons/telegram.svg",
      href: siteCopy.telegramGroupUrl,
    },
  ],
};
