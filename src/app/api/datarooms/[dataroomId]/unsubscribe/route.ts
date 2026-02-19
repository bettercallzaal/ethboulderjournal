/**
 * DataRoom Unsubscribe API Route
 *
 * POST /api/datarooms/[dataroomId]/unsubscribe - Cancel a subscription
 */
import { NextRequest } from "next/server";

import {
  createErrorResponse,
  handleCorsOptions,
  handleProxyRequest,
  parseJsonBody,
} from "@/lib/api/server-utils";

interface RouteParams {
  params: Promise<{ dataroomId: string }>;
}

/**
 * POST /api/datarooms/[dataroomId]/unsubscribe
 *
 * Cancel a subscription to a dataroom.
 *
 * Request Body:
 * - wallet_address: string (required) - Wallet address to unsubscribe
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { dataroomId } = await params;

  if (!dataroomId) {
    return createErrorResponse("DataRoom ID is required", 400);
  }

  const { data: body, error } = await parseJsonBody<{
    wallet_address?: string;
  }>(request);

  if (error) {
    return createErrorResponse(error, 400);
  }

  if (!body?.wallet_address) {
    return createErrorResponse("wallet_address is required", 400);
  }

  return handleProxyRequest(`/datarooms/${dataroomId}/unsubscribe`, {
    method: "POST",
    body,
  });
}

/**
 * OPTIONS /api/datarooms/[dataroomId]/unsubscribe
 */
export function OPTIONS() {
  return handleCorsOptions();
}
