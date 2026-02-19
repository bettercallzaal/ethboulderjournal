/**
 * Journal Add API Route
 *
 * POST /api/journal/add - Add a message to the agent's stack
 * Uses API_KEY auth (public endpoint, no Clerk required)
 */
import { NextRequest } from "next/server";

import {
  createErrorResponse,
  handleCorsOptions,
  handleProxyRequest,
  parseJsonBody,
} from "@/lib/api/server-utils";

const AGENT_ID =
  process.env["NEXT_PUBLIC_AGENT_ID"] ?? "698b70742849d936f4259849";

export async function POST(request: NextRequest) {
  const { data: body, error } = await parseJsonBody<{
    text?: string;
    userId?: string;
  }>(request);

  if (error) {
    return createErrorResponse(error, 400);
  }

  if (!body?.text || body.text.trim().length === 0) {
    return createErrorResponse("Text is required", 400);
  }

  const timestamp = new Date().toISOString();

  return handleProxyRequest(`/agents/${AGENT_ID}/stack/add`, {
    method: "POST",
    body: {
      message: {
        text: `[ZABAL Journal - ${timestamp}] ${body.text.trim()}`,
        userId: body.userId ?? "zabal-community",
        chatId: "zabal-web",
        timestamp,
      },
    },
  });
}

export function OPTIONS() {
  return handleCorsOptions();
}
