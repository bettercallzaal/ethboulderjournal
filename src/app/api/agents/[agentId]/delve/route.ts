/**
 * Paid Agent Delve API Route
 *
 * POST /api/agents/[agentId]/delve - Execute a paid delve search
 */
import { NextRequest } from "next/server";

import {
  createErrorResponse,
  handleCorsOptions,
  handleProxyRequest,
  parseJsonBody,
} from "@/lib/api/server-utils";

interface RouteParams {
  params: Promise<{ agentId: string }>;
}

/**
 * POST /api/agents/[agentId]/delve
 *
 * Execute a paid delve search against an agent's knowledge graph.
 * Requires either a microsub tx_hash or an x402 payment_header.
 *
 * Request Body:
 * - query: string (required) - Search query
 * - num_results?: number - Maximum results to return
 * - bonfire_id?: string - Bonfire context
 * - tx_hash?: string - Microsub transaction hash (for subscription access)
 * - payment_header?: string - x402 payment header (for pay-per-query)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { agentId } = await params;

  if (!agentId) {
    return createErrorResponse("Agent ID is required", 400);
  }

  const { data: body, error } = await parseJsonBody<{
    query?: string;
    num_results?: number;
    bonfire_id?: string;
    tx_hash?: string;
    payment_header?: string;
  }>(request);

  if (error) {
    return createErrorResponse(error, 400);
  }

  if (!body?.query) {
    return createErrorResponse("query is required", 400);
  }

  const headers: Record<string, string> = {};
  if (body.payment_header) {
    headers["X-Payment-Header"] =
      typeof body.payment_header === "string"
        ? body.payment_header
        : JSON.stringify(body.payment_header);
  }

  return handleProxyRequest(`/paid/agents/${agentId}/delve`, {
    method: "POST",
    body,
    headers,
  });
}

/**
 * OPTIONS /api/agents/[agentId]/delve
 */
export function OPTIONS() {
  return handleCorsOptions();
}
