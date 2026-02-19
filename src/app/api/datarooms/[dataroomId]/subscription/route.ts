/**
 * DataRoom Subscription Status API Route
 *
 * GET /api/datarooms/[dataroomId]/subscription - Check subscription status
 */
import { NextRequest } from "next/server";

import {
  createErrorResponse,
  extractQueryParams,
  handleCorsOptions,
  handleProxyRequest,
} from "@/lib/api/server-utils";

interface RouteParams {
  params: Promise<{ dataroomId: string }>;
}

/**
 * GET /api/datarooms/[dataroomId]/subscription
 *
 * Check if a wallet has an active subscription to a dataroom.
 *
 * Query Parameters:
 * - wallet: string (required) - Wallet address to check
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { dataroomId } = await params;

  if (!dataroomId) {
    return createErrorResponse("DataRoom ID is required", 400);
  }

  const queryParams = extractQueryParams(request, ["wallet"]);

  if (!queryParams["wallet"]) {
    return createErrorResponse("wallet query parameter is required", 400);
  }

  return handleProxyRequest(`/datarooms/${dataroomId}/subscription`, {
    method: "GET",
    queryParams: { wallet: queryParams["wallet"] },
  });
}

/**
 * OPTIONS /api/datarooms/[dataroomId]/subscription
 */
export function OPTIONS() {
  return handleCorsOptions();
}
