/**
 * Microsubs API Route
 *
 * GET  /api/microsubs - List user's microsub subscriptions
 * POST /api/microsubs - Create a new microsub subscription
 */
import { NextRequest } from "next/server";

import {
  createErrorResponse,
  extractQueryParams,
  handleCorsOptions,
  handleProxyRequest,
  parseJsonBody,
} from "@/lib/api/server-utils";

/**
 * GET /api/microsubs
 *
 * List microsub subscriptions for a wallet address.
 *
 * Query Parameters:
 * - wallet_address: string (required) - Wallet address to look up
 * - only_data_rooms?: "true" - Filter to data room subscriptions only
 */
export async function GET(request: NextRequest) {
  const queryParams = extractQueryParams(request, [
    "wallet_address",
    "only_data_rooms",
  ]);

  if (!queryParams["wallet_address"]) {
    return createErrorResponse("wallet_address is required", 400);
  }

  return handleProxyRequest("/microsubs", {
    method: "GET",
    queryParams: {
      wallet_address: queryParams["wallet_address"],
      ...(queryParams["only_data_rooms"]
        ? { only_data_rooms: queryParams["only_data_rooms"] }
        : {}),
    },
  });
}

/**
 * POST /api/microsubs
 *
 * Create a new microsub subscription (requires x402 payment).
 *
 * Request Body:
 * - dataroom_id: string (required)
 * - payment_header: string (required) - x402 payment header
 * - expected_amount?: string
 */
export async function POST(request: NextRequest) {
  const { data: body, error } = await parseJsonBody<{
    dataroom_id?: string;
    payment_header?: string;
    expected_amount?: string;
  }>(request);

  if (error) {
    return createErrorResponse(error, 400);
  }

  if (!body?.dataroom_id) {
    return createErrorResponse("dataroom_id is required", 400);
  }
  if (!body?.payment_header) {
    return createErrorResponse("payment_header is required", 400);
  }

  const paymentHeader =
    typeof body.payment_header === "string"
      ? body.payment_header
      : JSON.stringify(body.payment_header);

  return handleProxyRequest(
    "/microsubs",
    {
      method: "POST",
      body,
      headers: {
        "X-Payment-Header": paymentHeader,
      },
    },
    201
  );
}

/**
 * OPTIONS /api/microsubs
 */
export function OPTIONS() {
  return handleCorsOptions();
}
