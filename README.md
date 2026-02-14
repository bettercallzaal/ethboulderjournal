# ZABAL Bonfires

Community hub for the ZABAL community to follow ETH Boulder 2026 live through knowledge graphs, people, and conversations. Built on the [Bonfires/Delve](https://bonfires.ai) platform.

**Live:** [ethboulderjournal.vercel.app](https://ethboulderjournal.vercel.app)

## What Is This?

ZABAL Bonfires is a fork of the [Bonfires webapp](https://github.com/NERDDAO/bonfires-webapp) customized for the ZABAL community. It lets anyone:

- **Add notes** about what's happening at ETH Boulder — talks, people, projects, ideas
- **Explore the knowledge graph** to see how topics, people, and projects connect
- **Read HyperBlogs** — AI-generated summaries from the knowledge graph
- **Dive deeper** into any node to see related entities and conversations

## How It Works

### Adding to the Knowledge Graph

1. Go to the landing page and find the **"Add to Map"** section
2. Type what you're building, who you met, what talk you attended
3. Click **"Add to Map"** — this queues your message in the agent stack
4. Click **"Process"** to trigger the AI to extract entities and relationships (20-min cooldown between processes)

### Under the Hood

The Delve/Bonfires platform uses an **agent stack pattern**:

```
Your Note → Agent Stack → AI Processing → Episodes → Entities & Relationships → Knowledge Graph
```

- **Stack**: Messages queue up via `POST /agents/{agentId}/stack/add`
- **Process**: AI reads queued messages and extracts structured knowledge via `POST /agents/{agentId}/stack/process`
- **Graph**: Entities (people, topics, projects) and relationships appear in the interactive graph explorer

### Key Pages

| Page | URL | Description |
|------|-----|-------------|
| Landing | `/` | ZABAL homepage with "Add to Map" input |
| Graph Explorer | `/graph` | Interactive knowledge graph (Sigma.js + WebGL) |
| HyperBlogs | `/hyperblogs` | AI-generated blog posts from the graph |
| Explore | `/explore` | Browse bonfires and agents |

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5.9+
- **Styling**: Tailwind CSS 4 + DaisyUI 5
- **Graph Viz**: Sigma.js 3 + Graphology
- **Web3**: RainbowKit + Wagmi + Viem (Base chain)
- **State**: React Query 5 (server) + Zustand 5 (client)
- **Auth**: Clerk (optional — app works without it)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development server
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

See `.env.example` for all variables.

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

### Bonfires & Agents

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/bonfires` | List bonfires |
| `GET` | `/api/bonfires/[id]` | Get bonfire details |
| `GET` | `/api/bonfires/[id]/agents` | List agents for a bonfire |
| `GET` | `/api/agents` | List agents |
| `POST` | `/api/agents/[id]/chat` | Chat with an agent |
| `POST` | `/api/agents/[id]/episodes/search` | Search episodes |

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (main)/                   # Main layout (navbar, background)
│   │   ├── graph/                # Graph explorer page
│   │   ├── hyperblogs/           # HyperBlogs pages
│   │   ├── explore/              # Explore page
│   │   └── dashboard/            # Dashboard
│   └── api/                      # API route handlers
│       ├── journal/              # Add to Map endpoints
│       ├── graph/                # Graph query endpoints
│       ├── bonfires/             # Bonfire management
│       └── agents/               # Agent interactions
├── components/
│   ├── landing-page/             # Landing page sections
│   │   ├── add-to-map.tsx        # Public input form
│   │   ├── people-section.tsx    # Community highlights
│   │   └── bonfire-landing.tsx   # Landing page layout
│   ├── graph-explorer/           # Sigma.js graph components
│   ├── navbar/                   # Navigation bar
│   └── ui/                       # Shared UI components
├── content/                      # Site copy and config
│   ├── site.ts                   # Global branding
│   ├── landing-page.ts           # Landing page copy
│   └── static-graph.ts           # Decorative graph nodes
├── config/                       # App configuration
│   └── sites/                    # Multi-tenant site configs
├── contexts/                     # React contexts
├── hooks/                        # Custom hooks
├── lib/
│   └── api/                      # Server-side API utilities
│       ├── server-utils.ts       # Proxy to Delve backend
│       └── bonfire-access.ts     # Access control
└── types/                        # TypeScript types
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
