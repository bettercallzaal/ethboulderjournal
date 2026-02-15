# ZABAL Bonfires

Community hub for the ZABAL community at ETH Boulder 2026 — capture thoughts, explore the knowledge graph, and share your experience. Built on the [Bonfires/Delve](https://bonfires.ai) platform.

**Live:** [ethboulderjournal.vercel.app](https://ethboulderjournal.vercel.app)

**Farcaster Mini App:** Search "ZABAL at ETH Boulder" on Warpcast

## Features

### Builder Journal (`/journal`)

A three-column workspace for capturing and synthesizing your ETH Boulder experience:

- **Write** — Brain-dump thoughts, tag entities from the knowledge graph, and submit entries to the agent stack. Entries persist in localStorage and sync to the graph.
- **Knowledge Graph** — See recent episodes, process queued entries into structured knowledge, and click any episode to explore it in the graph.
- **Ask the Graph + Recap Generator** — Chat with the AI agent about ETH Boulder, then generate polished LinkedIn posts or blog posts (for Paragraph) from everything in the knowledge graph. Share directly to Farcaster, X, LinkedIn, or copy to clipboard.

### Knowledge Graph Explorer (`/graph`)

Interactive force-directed graph (Sigma.js + WebGL) showing how people, projects, topics, and conversations connect. Click any node to expand its relationships, read episode content, and add comments.

### HyperBlogs (`/hyperblogs`)

AI-generated blog posts synthesized from the knowledge graph.

### Farcaster Mini App

Verified Farcaster Mini App with:
- `.well-known/farcaster.json` manifest (FID 19640)
- Dynamic OG images via Next.js ImageResponse (`/api/og`, `/api/og/frame`)
- `fc:miniapp` + `fc:frame` meta tags
- All social shares include `#onchaincreators`

## How It Works

### Adding to the Knowledge Graph

1. Go to the **Journal** page (or the landing page "Add to Map")
2. Type what you're building, who you met, what talk you attended
3. Click **Add Entry** — this queues your message in the agent stack
4. Click **Process** to trigger the AI to extract entities and relationships

### Under the Hood

```
Your Note → Agent Stack → AI Processing → Episodes → Entities & Relationships → Knowledge Graph
```

- **Stack**: Messages queue up via `POST /agents/{agentId}/stack/add`
- **Process**: AI reads queued messages and extracts structured knowledge via `POST /agents/{agentId}/stack/process`
- **Graph**: Entities (people, topics, projects) and relationships appear in the interactive graph explorer

### Navigation

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | ZABAL landing with "Add to Map" |
| Graph | `/graph` | Interactive knowledge graph |
| Journal | `/journal` | Builder journal workspace |
| HyperBlogs | `/hyperblogs` | AI-generated posts |

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5.9+
- **Styling**: Tailwind CSS 4 + DaisyUI 5
- **Graph Viz**: Sigma.js 3 + Graphology
- **Web3**: RainbowKit + Wagmi + Viem (Base chain)
- **State**: React Query 5 (server) + Zustand 5 (client)
- **Auth**: Clerk (optional — app works without it)
- **Deployment**: Vercel
- **Social**: Farcaster Mini App, X/LinkedIn sharing

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm

### Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Environment Variables

**Required:**

| Variable | Description |
|----------|-------------|
| `API_KEY` | Bonfires/Delve API key |
| `DELVE_API_URL` | Backend API URL (server-side) |
| `NEXT_PUBLIC_DELVE_API_URL` | Backend API URL (client-side) |
| `NEXT_PUBLIC_BONFIRE_ID` | Your bonfire ID |
| `NEXT_PUBLIC_AGENT_ID` | Your agent ID |

**Optional:**

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk auth (leave unset to disable) |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | WalletConnect for wallet connections |

## API Routes

### Journal (Public — no auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/journal/add` | Add a message to the agent stack |
| `POST` | `/api/journal/process` | Trigger AI processing of queued messages |
| `GET` | `/api/journal/status` | Get stack status |

### Graph

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/graph/query` | Query the knowledge graph |
| `POST` | `/api/graph/expand` | Expand a node's connections |
| `POST` | `/api/graph/search` | Search for entities |

### OG Images

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/og` | Dynamic OG image (1200x630) |
| `GET` | `/api/og/frame` | Farcaster frame embed image (1200x800) |

### Bonfires & Agents

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/bonfires` | List bonfires |
| `GET` | `/api/bonfires/[id]` | Get bonfire details |
| `POST` | `/api/agents/[id]/chat` | Chat with an agent |
| `POST` | `/api/agents/[id]/episodes/search` | Search episodes |

## Project Structure

```
src/
├── app/
│   ├── (main)/
│   │   ├── graph/                # Graph explorer page
│   │   ├── journal/              # Builder journal workspace
│   │   ├── hyperblogs/           # HyperBlogs pages
│   │   └── dashboard/            # Dashboard
│   └── api/
│       ├── journal/              # Stack add/process/status
│       ├── graph/                # Graph query endpoints
│       ├── og/                   # OG image generation
│       ├── bonfires/             # Bonfire management
│       └── agents/               # Agent interactions
├── components/
│   ├── journal/                  # Builder journal components
│   │   ├── journal-write-section.tsx
│   │   ├── journal-graph-feed.tsx
│   │   ├── journal-chat-section.tsx
│   │   └── journal-header.tsx
│   ├── landing-page/             # Landing page sections
│   ├── graph-explorer/           # Sigma.js graph components
│   ├── navbar/                   # Navigation bar
│   └── ui/                       # Shared UI components
├── config/
│   └── sites/                    # Site configuration
├── content/                      # Site copy and branding
├── lib/
│   ├── api/                      # API utilities
│   └── storage/                  # localStorage persistence
│       ├── journalEntries.ts     # Journal entry CRUD
│       └── chatHistory.ts        # Chat history
├── hooks/                        # Custom hooks
├── contexts/                     # React contexts
└── types/                        # TypeScript types
public/
└── .well-known/
    └── farcaster.json            # Farcaster Mini App manifest
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm format` | Format with Prettier |

## License

MIT

## Credits

- Built on [Bonfires/Delve](https://bonfires.ai) by [NERDDAO](https://github.com/NERDDAO)
- ZABAL customization by [@bettercallzaal](https://x.com/bettercallzaal)
- Part of the [#onchaincreators](https://warpcast.com/~/channel/onchaincreators) challenge at ETH Boulder 2026
