// Static nodes: ZABAL community at ETH Boulder — people, projects, topics
export const NODES_DATA: { id: string; label: string; size: number }[] = [
  // Core hubs
  { id: "zabal", label: "ZABAL", size: 5 },
  { id: "eth-boulder", label: "ETH Boulder", size: 5 },
  { id: "bonfires", label: "Bonfires", size: 4 },
  { id: "web3-music", label: "Web3 Music", size: 4 },

  // People
  { id: "bettercallzaal", label: "bettercallzaal", size: 4 },
  { id: "builders", label: "Builders", size: 3 },
  { id: "musicians", label: "Musicians", size: 3 },
  { id: "creators", label: "Creators", size: 3 },
  { id: "speakers", label: "Speakers", size: 2 },
  { id: "attendees", label: "Attendees", size: 2 },

  // Music x Web3 topics
  { id: "music-nfts", label: "Music NFTs", size: 3 },
  { id: "tokenized-royalties", label: "Tokenized Royalties", size: 3 },
  { id: "on-chain-audio", label: "On-Chain Audio", size: 2 },
  { id: "artist-daos", label: "Artist DAOs", size: 2 },
  { id: "streaming", label: "Decentralized Streaming", size: 2 },
  { id: "sound-xyz", label: "Sound.xyz", size: 2 },
  { id: "music-collabs", label: "Music Collabs", size: 2 },

  // ETH Boulder topics
  { id: "hackathon", label: "Hackathon", size: 3 },
  { id: "knowledge-graph", label: "Knowledge Graph", size: 3 },
  { id: "ai-agents", label: "AI Agents", size: 3 },
  { id: "base", label: "Base", size: 3 },
  { id: "x402", label: "x402 Payments", size: 2 },
  { id: "hyperblogs", label: "Hyperblogs", size: 2 },
  { id: "data-rooms", label: "Data Rooms", size: 2 },

  // Web3 fundamentals
  { id: "ethereum", label: "Ethereum", size: 3 },
  { id: "smart-contracts", label: "Smart Contracts", size: 2 },
  { id: "defi", label: "DeFi", size: 2 },
  { id: "daos", label: "DAOs", size: 2 },
  { id: "usdc", label: "USDC", size: 2 },
  { id: "nfts", label: "NFTs", size: 2 },

  // Community
  { id: "boulder-co", label: "Boulder, CO", size: 2 },
  { id: "community", label: "Community", size: 3 },
  { id: "open-source", label: "Open Source", size: 2 },
  { id: "collaboration", label: "Collaboration", size: 2 },
  { id: "virtual-events", label: "Virtual Events", size: 2 },

  // Creative
  { id: "generative-art", label: "Generative Art", size: 2 },
  { id: "creative-coding", label: "Creative Coding", size: 1 },
  { id: "live-performance", label: "Live Performance", size: 1 },
  { id: "producer-tools", label: "Producer Tools", size: 1 },
];

// Links connecting the ZABAL ecosystem
export const LINKS_DATA: { source: string; target: string }[] = [
  // ZABAL core connections
  { source: "zabal", target: "eth-boulder" },
  { source: "zabal", target: "bettercallzaal" },
  { source: "zabal", target: "web3-music" },
  { source: "zabal", target: "community" },
  { source: "zabal", target: "bonfires" },
  { source: "zabal", target: "virtual-events" },

  // ETH Boulder connections
  { source: "eth-boulder", target: "hackathon" },
  { source: "eth-boulder", target: "boulder-co" },
  { source: "eth-boulder", target: "builders" },
  { source: "eth-boulder", target: "speakers" },
  { source: "eth-boulder", target: "attendees" },
  { source: "eth-boulder", target: "bonfires" },
  { source: "eth-boulder", target: "ethereum" },

  // bettercallzaal connections
  { source: "bettercallzaal", target: "web3-music" },
  { source: "bettercallzaal", target: "musicians" },
  { source: "bettercallzaal", target: "eth-boulder" },
  { source: "bettercallzaal", target: "builders" },

  // Web3 Music ecosystem
  { source: "web3-music", target: "music-nfts" },
  { source: "web3-music", target: "tokenized-royalties" },
  { source: "web3-music", target: "on-chain-audio" },
  { source: "web3-music", target: "artist-daos" },
  { source: "web3-music", target: "streaming" },
  { source: "web3-music", target: "sound-xyz" },
  { source: "web3-music", target: "musicians" },
  { source: "web3-music", target: "music-collabs" },
  { source: "web3-music", target: "live-performance" },

  // Music NFTs
  { source: "music-nfts", target: "nfts" },
  { source: "music-nfts", target: "smart-contracts" },
  { source: "music-nfts", target: "creators" },
  { source: "music-nfts", target: "sound-xyz" },

  // Tokenized royalties
  { source: "tokenized-royalties", target: "smart-contracts" },
  { source: "tokenized-royalties", target: "defi" },
  { source: "tokenized-royalties", target: "usdc" },

  // Artist DAOs
  { source: "artist-daos", target: "daos" },
  { source: "artist-daos", target: "musicians" },
  { source: "artist-daos", target: "community" },

  // Bonfires platform
  { source: "bonfires", target: "knowledge-graph" },
  { source: "bonfires", target: "ai-agents" },
  { source: "bonfires", target: "hyperblogs" },
  { source: "bonfires", target: "data-rooms" },
  { source: "bonfires", target: "x402" },

  // Knowledge graph
  { source: "knowledge-graph", target: "ai-agents" },
  { source: "knowledge-graph", target: "community" },

  // Payments
  { source: "x402", target: "usdc" },
  { source: "x402", target: "base" },

  // Base chain
  { source: "base", target: "ethereum" },
  { source: "base", target: "usdc" },
  { source: "base", target: "smart-contracts" },

  // Ethereum ecosystem
  { source: "ethereum", target: "smart-contracts" },
  { source: "ethereum", target: "defi" },
  { source: "ethereum", target: "daos" },
  { source: "ethereum", target: "nfts" },

  // People connections
  { source: "builders", target: "hackathon" },
  { source: "builders", target: "open-source" },
  { source: "builders", target: "collaboration" },
  { source: "musicians", target: "creators" },
  { source: "musicians", target: "live-performance" },
  { source: "musicians", target: "music-collabs" },
  { source: "creators", target: "generative-art" },
  { source: "creators", target: "creative-coding" },
  { source: "speakers", target: "community" },
  { source: "attendees", target: "community" },
  { source: "attendees", target: "collaboration" },

  // Community
  { source: "community", target: "collaboration" },
  { source: "community", target: "open-source" },
  { source: "community", target: "virtual-events" },

  // Creative
  { source: "generative-art", target: "nfts" },
  { source: "creative-coding", target: "generative-art" },
  { source: "producer-tools", target: "on-chain-audio" },
  { source: "producer-tools", target: "musicians" },
  { source: "live-performance", target: "virtual-events" },
  { source: "streaming", target: "on-chain-audio" },

  // Cross-connections
  { source: "hackathon", target: "collaboration" },
  { source: "hyperblogs", target: "creators" },
  { source: "data-rooms", target: "knowledge-graph" },
  { source: "sound-xyz", target: "base" },
  { source: "music-collabs", target: "collaboration" },
  { source: "defi", target: "usdc" },
  { source: "daos", target: "community" },
];
