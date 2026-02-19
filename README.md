# ZABAL Bonfires

Community hub for the ZABAL community at ETH Boulder 2026 — capture thoughts, explore the knowledge graph, generate AI-powered blogs, and share your experience. Built on the [Bonfires/Delve](https://bonfires.ai) platform.

**Live:** [ethboulderjournal.vercel.app](https://ethboulderjournal.vercel.app)

**Farcaster Mini App:** Search "ZABAL at ETH Boulder" on Warpcast

## Features

### Knowledge Explorer (`/knowledge`)

Browse everything in the ZABAL knowledge graph across multiple visual formats:

- **Feed** — Unified chronological stream of entities and episodes with date grouping, search, and type filters
- **Entities** — Card grid, list, or table view with sort (most connected, A-Z, by type) and relationship counts
- **Episodes** — Timeline, card grid, or list view with parsed content and timestamps
- **Connections** — Table of relationship triples (Source → Relationship → Target) with facts
- **Analytics** — Graph statistics dashboard with:
  - Stat cards (entities, episodes, connections, avg connections/entity)
  - Entity type distribution (donut chart)
  - Relationship type breakdown (bar chart)
  - Episode activity over time (D3 area chart)
  - Most connected entities ranking
  - Taxonomy/topic breakdown
- **ZABAL's Connections** — Highlighted section showing ZABAL's direct graph connections
- **Detail Panel** — Slide-in panel with full entity/episode content, share buttons, and "Write a Hyperblog" CTA

### Graph Explorer (`/graph`)

Interactive force-directed graph (Sigma.js + WebGL) showing how people, projects, topics, and conversations connect. Click any node to expand relationships, read episode content, and add comments.

### Builder Journal (`/journal`)

A three-column workspace for capturing and synthesizing your ETH Boulder experience:

- **Write** — Brain-dump thoughts, tag entities from the knowledge graph, and submit entries to the agent stack
- **Knowledge Graph** — See recent episodes, process queued entries into structured knowledge
- **Ask the Graph + Recap Generator** — Chat with the AI agent, then generate polished LinkedIn posts or blog posts from the knowledge graph. Share to Farcaster, X, LinkedIn, or clipboard.

### HyperBlogs (`/hyperblogs`)

AI-generated blog posts synthesized from the knowledge graph:

- **ZABAL Stories** — Quick-start section with 6 pre-written ZABAL-themed prompts (ZABAL x ETH Boulder, Web3 Music Revolution, Knowledge Graph Story, Builder Spotlight, Community Impact, Onchain Creators)
- **Create Blog Modal** — Clickable prompt chips that pre-fill the description, blog length selector, USDC payment on Base via x402
- **DataRoom Topics** — Browse and create blogs from topic-focused data rooms

### Data Room Marketplace (`/datarooms`)

Browse and subscribe to community-created data rooms:

- **Marketplace Grid** — Card layout with pricing, query limits, expiration, and subscriber counts
- **Create Wizard** — 3-step guided flow: configure bonfire + node, set pricing (static/dynamic), review & create
- **Subscribe** — Connect wallet, pay with USDC via x402, get subscription with query quota
- **Dynamic Pricing** — Optional price steps and decay rates per data room

### x402 Paid Chat (`/x402-chat`)

Payment-gated AI chat using microsub subscriptions:

- Agent selector with bonfire context
- Microsub selection (pick active subscription or pay per query)
- Full chat interface with message history and graph context

### x402 Paid Delve (`/x402-delve`)

Payment-gated semantic search:

- Agent selector with bonfire context
- Advanced search with result count configuration
- Microsub or pay-per-query access
- Tabbed results view (episodes, entities, edges)

### Document Manager (`/documents`)

Upload and manage documents in the knowledge graph:

- **Upload** — Drag-and-drop file upload (PDF, TXT, MD, DOCX) with progress tracking
- **Document List** — Browse uploaded documents with status (pending, processing, completed, failed)
- **Taxonomy Labels** — View and browse taxonomy labels assigned to document chunks
- **Delete** — Remove documents from the knowledge graph

### Dashboard (`/dashboard`)

Unified dashboard showing user activity across all features:

- Created data rooms with edit/delete actions
- Active subscriptions with usage tracking
- Recent chat history
- Document upload summary
- Payment history
- Quick actions for common tasks

### Bonfire Graph Switcher

Global toggle in the navbar to switch between knowledge graphs:

- Pill-shaped selector showing active bonfire name + color dot
- Currently configured with ZABAL (extensible — add new bonfires to `BONFIRE_OPTIONS` in `src/contexts/BonfireSelectionContext.tsx`)
- Selection persists via localStorage
- All pages (Knowledge Explorer, landing page, graph explorer) react to the active selection

### Farcaster Social Feed

Live Farcaster casts mentioning ZABAL, ETH Boulder, and #onchaincreators:

- Server-side Neynar API proxy (`/api/farcaster/feed`) with 5-minute cache
- Cast cards with author avatar, username, engagement stats, and Warpcast links
- "What People Are Saying" section on the landing page
- Graceful empty state when no API key configured

### Farcaster Mini App

Verified Farcaster Mini App with:
- `.well-known/farcaster.json` manifest (FID 19640)
- Dynamic OG images via Next.js ImageResponse (`/api/og`, `/api/og/frame`)
- Native `composeCast()` inside Farcaster client with Warpcast fallback
- `fc:miniapp` + `fc:frame` meta tags
- All social shares include `#onchaincreators`

### Landing Page

- **Hero** — Scroll-capture animation with graph CTA centered on ZABAL
- **Add to Map** — Quick journal entry submission
- **People Section** — Dynamic ZABAL network pulled from the knowledge graph with connection counts
- **Farcaster Feed** — Live community casts
- **Knowledge Graph** — Static graph visualization preview
- **HyperBlogs Preview** — Featured + latest AI-generated posts
- **How It Works** — Step-by-step explanation

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
- **Graph**: Entities (people, topics, projects) and relationships appear across all views

### Navigation

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | ZABAL landing with social feed & graph preview |
| Graph | `/graph` | Interactive knowledge graph |
| Knowledge | `/knowledge` | Multi-format data explorer with analytics |
| Journal | `/journal` | Builder journal workspace |
| Hyperblogs | `/hyperblogs` | AI-generated posts with ZABAL Stories |
| Data Rooms | `/datarooms` | Data room marketplace |
| Documents | `/documents` | Document upload & management |
| Dashboard | `/dashboard` | Unified user dashboard |
| x402 Chat | `/x402-chat` | Payment-gated AI chat |
| x402 Delve | `/x402-delve` | Payment-gated semantic search |

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5.9+
- **Styling**: Tailwind CSS 4 + DaisyUI 5
- **Graph Viz**: Sigma.js 3 + Graphology + D3.js 7
- **Charts**: D3 area charts + CSS bar/donut charts
- **Web3**: RainbowKit + Wagmi + Viem (Base chain, USDC payments via x402)
- **State**: React Query 5 (server) + Zustand 5 (client)
- **Auth**: Clerk (optional — app works without it)
- **Social**: Farcaster Mini App SDK + Neynar API
- **Deployment**: Vercel

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
| `NEYNAR_API_KEY` | Neynar API key for Farcaster social feed (free at neynar.com) |

## API Routes

All routes are thin proxies to the Bonfires/Delve backend using `proxyToBackend()` from `src/lib/api/server-utils.ts`. Authentication is handled via Clerk JWT or server-side API key fallback.

### Agents

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/agents` | List all agents |
| `POST` | `/api/agents` | Create a new agent |
| `GET` | `/api/agents/[agentId]` | Get agent details |
| `PUT` | `/api/agents/[agentId]` | Update an agent |
| `POST` | `/api/agents/[agentId]/chat` | Chat with an agent (access-controlled) |
| `POST` | `/api/agents/[agentId]/delve` | Paid delve search (x402 / microsub) |
| `POST` | `/api/agents/[agentId]/episodes/search` | Search agent episodes |

### Bonfires

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/bonfires` | List all bonfires |
| `GET` | `/api/bonfires/[bonfireId]` | Get bonfire details |
| `GET` | `/api/bonfires/[bonfireId]/agents` | List bonfire's agents |
| `GET` | `/api/bonfires/[bonfireId]/taxonomy-stats` | Get taxonomy statistics |
| `GET` | `/api/bonfires/[bonfireId]/resolve-org` | Resolve org for bonfire |
| `GET` | `/api/bonfires/resolve-subdomain/[subdomain]` | Resolve bonfire by subdomain |

### Data Rooms

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/datarooms` | List data rooms |
| `POST` | `/api/datarooms` | Create a data room |
| `GET` | `/api/datarooms/[dataroomId]` | Get data room details |
| `PUT` | `/api/datarooms/[dataroomId]` | Update a data room |
| `DELETE` | `/api/datarooms/[dataroomId]` | Delete a data room |
| `POST` | `/api/datarooms/[dataroomId]/subscribe` | Subscribe (x402 payment) |
| `GET` | `/api/datarooms/[dataroomId]/subscription` | Check subscription status |
| `POST` | `/api/datarooms/[dataroomId]/unsubscribe` | Cancel subscription |

### Microsubs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/microsubs` | List wallet's subscriptions |
| `POST` | `/api/microsubs` | Create subscription (x402 payment) |

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/documents` | List documents |
| `POST` | `/api/documents/ingest` | Upload/ingest a document |
| `GET` | `/api/documents/[docId]` | Get document details |
| `DELETE` | `/api/documents/[docId]` | Delete a document |

### Graph / Delve

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/graph/query` | Semantic graph search (with advanced Delve params) |
| `POST` | `/api/graph/expand` | Expand node connections |
| `POST` | `/api/graph/search` | Text search for entities |

**Advanced Delve Parameters** (supported in query & expand):
- `search_recipe` — Search strategy (e.g., "hybrid", "vector", "keyword")
- `min_fact_rating` — Minimum fact quality rating filter
- `mmr_lambda` — Maximal Marginal Relevance diversity parameter
- `window_start` / `window_end` — Time window for temporal filtering
- `relationship_types` — Filter by specific relationship types

### HyperBlogs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/hyperblogs` | List public hyperblogs |
| `POST` | `/api/hyperblogs/purchase` | Create a hyperblog (x402 payment) |
| `GET` | `/api/hyperblogs/[hyperblogId]` | Get hyperblog details |
| `GET` | `/api/hyperblogs/[hyperblogId]/view` | Get view count |
| `POST` | `/api/hyperblogs/[hyperblogId]/view` | Increment view count |
| `POST` | `/api/hyperblogs/[hyperblogId]/vote` | Upvote/downvote |

### HTN Templates

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/htn-templates` | List HTN blog templates |
| `POST` | `/api/htn-templates` | Create a new template |

### Journal (Public — no auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/journal/add` | Add a message to the agent stack |
| `POST` | `/api/journal/process` | Trigger AI processing of queued messages |
| `GET` | `/api/journal/status` | Get stack status |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/payments/verify` | Verify an x402 payment |
| `GET` | `/api/payments/status` | Check payment status by tx hash |
| `GET` | `/api/payments/history` | Get payment history for a wallet |

### Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/jobs/[jobId]` | Poll async job status |

### Farcaster

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/farcaster/feed` | Farcaster casts mentioning ZABAL/ETH Boulder |

### OG Images

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/og` | Dynamic OG image (1200x630) |
| `GET` | `/api/og/frame` | Farcaster frame embed image (1200x800) |
| `GET` | `/api/og/entity` | Entity-specific OG image |

### Organizations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orgs/[orgId]/bonfire-mapping` | Get org-to-bonfire mapping |

## Architecture

### API Proxy Pattern

All API routes follow the same pattern using shared utilities from `src/lib/api/server-utils.ts`:

```typescript
import { handleProxyRequest, createErrorResponse, parseJsonBody } from "@/lib/api/server-utils";

export async function POST(request: NextRequest) {
  const { data: body, error } = await parseJsonBody(request);
  if (error) return createErrorResponse(error, 400);

  return handleProxyRequest("/backend-endpoint", {
    method: "POST",
    body,
    headers: { "X-Payment-Header": body.payment_header }, // for x402
  });
}
```

Key utilities:
- `proxyToBackend()` — Core proxy with timeout, auth, error handling
- `handleProxyRequest()` — Convenience wrapper that returns NextResponse
- `getAuthHeaders()` — Clerk JWT → API key fallback chain
- `extractQueryParams()` — Extract query params from request URL

### x402 Payment Flow

1. Client builds ERC-3009 `TransferWithAuthorization` signature (EIP-712)
2. Signature is encoded as `X-Payment-Header`
3. API route forwards header to backend
4. Backend verifies signature and settles USDC payment on Base

### Bonfire Access Control

Routes like `/api/graph/query` and `/api/agents/[agentId]/chat` check bonfire access via `checkBonfireAccess()` from `src/lib/api/bonfire-access.ts`. Public bonfires allow unauthenticated access; private bonfires require a valid Clerk session.

## Project Structure

```
src/
├── app/
│   ├── (main)/
│   │   ├── graph/                # Graph explorer page
│   │   ├── knowledge/            # Knowledge explorer page
│   │   ├── journal/              # Builder journal workspace
│   │   ├── hyperblogs/           # HyperBlogs pages
│   │   ├── documents/            # Document manager
│   │   ├── dashboard/            # Unified dashboard
│   │   ├── datarooms/            # Data rooms redirect
│   │   ├── (web3)/
│   │   │   ├── datarooms-old/    # Data room marketplace
│   │   │   ├── x402-chat/        # Payment-gated AI chat
│   │   │   └── x402-delve/       # Payment-gated delve search
│   │   └── (graph)/
│   │       └── ...               # Legacy graph routes (redirected)
│   └── api/
│       ├── agents/               # Agent CRUD + chat + delve
│       ├── bonfires/             # Bonfire management + taxonomy
│       ├── datarooms/            # DataRoom CRUD + subscribe/unsubscribe
│       ├── documents/            # Document CRUD + ingest
│       ├── farcaster/            # Farcaster social feed proxy
│       ├── graph/                # Graph query/expand/search
│       ├── htn-templates/        # HTN blog template CRUD
│       ├── hyperblogs/           # HyperBlog CRUD + purchase + vote
│       ├── jobs/                 # Async job polling
│       ├── journal/              # Stack add/process/status
│       ├── microsubs/            # Microsub subscription management
│       ├── og/                   # OG image generation
│       ├── orgs/                 # Organization mapping
│       └── payments/             # Payment verify/status/history
├── components/
│   ├── analytics/                # Chart components (bar, donut, activity, stat)
│   ├── farcaster/                # Social feed components
│   ├── hyperblogs/               # Hyperblog creation + ZABAL Stories
│   ├── knowledge/                # Knowledge explorer views + analytics
│   ├── journal/                  # Builder journal components
│   ├── landing-page/             # Landing page sections
│   ├── graph-explorer/           # Sigma.js graph components
│   ├── navbar/                   # Navigation bar + bonfire toggle
│   ├── web3/                     # Web3 components (DataRoom, PaidChat, PaidDelve)
│   ├── documents/                # Document upload + taxonomy labels
│   └── ui/                       # Shared UI components (Badge, Button, Modal, etc.)
├── config/
│   └── sites/                    # Site configuration + navigation
├── content/                      # Site copy, branding, prompt suggestions
├── contexts/                     # React contexts (BonfireSelection, Subdomain, SiteConfig)
├── lib/
│   ├── api/                      # API client + server utilities
│   ├── farcaster.ts              # Farcaster SDK wrapper
│   ├── payment/                  # x402 payment header builder
│   ├── wallet/                   # Web3 wallet utilities
│   ├── utils/                    # Graph analytics + helpers
│   └── storage/                  # localStorage persistence
├── hooks/
│   ├── queries/                  # React Query hooks (knowledge, farcaster, taxonomy, etc.)
│   └── web3/                     # Web3 hooks (useMicrosubSelection, useAuth, etc.)
└── types/                        # TypeScript types (graph, API, web3, dashboard, auth)
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

## Adding a New Bonfire/Graph

To add another knowledge graph (e.g., ETH Boulder):

1. Get the bonfire ID and agent ID from the Bonfires platform
2. Add a new entry to `BONFIRE_OPTIONS` in `src/contexts/BonfireSelectionContext.tsx`:
   ```typescript
   {
     id: "ethboulder",
     label: "ETH Boulder",
     bonfireId: "your-bonfire-id",
     agentId: "your-agent-id",
     color: "#4fc5ff",
   }
   ```
3. The navbar toggle, knowledge explorer, graph page, and landing page will automatically support switching.

## Next Steps / Roadmap

### High Priority

- [ ] **Decompose GraphExplorer** — The main `GraphExplorer.tsx` (1,400+ lines) should be split: extract episode hydration into a custom hook, move graph merge logic into a utility, and separate the toolbar/status overlay into their own components
- [ ] **Move Data Rooms to `/datarooms`** — Currently lives at `/datarooms-old` inside the `(web3)` route group. Rename the directory to `datarooms` and remove the proxy re-export
- [ ] **Wire `useCreateDataRoom` + `useSubscribeDataRoom` hooks** — These React Query mutation hooks exist but the Data Rooms page uses raw `fetch` calls. Migrate to the hooks for cache invalidation and optimistic updates
- [ ] **Expose advanced Delve params in UI** — The API now forwards `search_recipe`, `min_fact_rating`, `mmr_lambda`, `window_start/end`, and `relationship_types`, but no UI controls exist for them yet. Add an "Advanced Search" panel to the Graph Explorer

### Medium Priority

- [ ] **Split `DataRoomWizard`** (734 lines) — Extract each wizard step into its own component
- [ ] **Unify Farcaster feed page** — `src/app/(main)/feed/page.tsx` uses hardcoded styles and raw `fetch` instead of the existing `useFarcasterFeed` hook and DaisyUI theme. Refactor to match the rest of the app
- [ ] **Add taxonomy label editing** — `TaxonomyLabelsPanel` component displays labels but the labeling/editing flow is stubbed. Wire up to the backend taxonomy endpoints
- [ ] **Configurable Farcaster search terms** — The Neynar search query (`"ZABAL OR ethboulder OR onchaincreators"`) is hardcoded in the feed route. Make it an env var (`FARCASTER_SEARCH_QUERY`)
- [ ] **Stronger API response types** — `AgentLatestEpisodesResponse` uses `Record<string, unknown>[]` for episodes/entities/edges. Add precise types matching the actual backend schema to eliminate `asRecord()` casts

### Low Priority

- [ ] **Remove `onHyperBlogCreated` dead prop** — `DataRoomMarketplaceCard` defines this prop but it's never passed or used
- [ ] **Add tests** — The old `WikiPanel.test.tsx` was removed with the legacy graph stack. Add tests for the active graph-explorer components and the new API routes
- [ ] **Settings page** — Currently a Coming Soon placeholder. Add theme customization, notification preferences, and bonfire management
- [ ] **Share card page** — Currently a Coming Soon placeholder. Generate shareable OG image cards from graph entities/episodes

### Done (This Session)

- [x] Created 4 new API routes (microsubs, delve, subscription, unsubscribe)
- [x] Added PUT/DELETE to datarooms and DELETE to documents routes
- [x] Forwarded 6 advanced Delve params through graph/query and graph/expand
- [x] Added "More" dropdown to navigation (Hyperblogs, Documents, Data Rooms, Dashboard)
- [x] Redirected placeholder pages (ai-builder, live-feed, graph-old, search, hyperblogs-old)
- [x] Deleted legacy `src/components/graph/` stack (~3,000 lines of dead code)
- [x] Extracted shared graph normalizers to `src/lib/utils/graph-normalizers.ts`
- [x] Migrated journal routes to `proxyToBackend` pattern (removed hardcoded backend URL)
- [x] Made bonfire/agent IDs read from env vars with fallback
- [x] Removed orphaned files (NavigationButton, useLatestEpisodesGraph, WikiPanel test)
- [x] Fixed `console.log` in client code, cleaned up unused imports

## License

MIT

## Credits

- Built on [Bonfires/Delve](https://bonfires.ai) by [NERDDAO](https://github.com/NERDDAO)
- ZABAL customization by [@bettercallzaal](https://x.com/bettercallzaal)
- Part of the [#onchaincreators](https://warpcast.com/~/channel/onchaincreators) challenge at ETH Boulder 2026
