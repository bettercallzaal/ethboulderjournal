/**
 * Single DataRoom API Route
 *
 * GET    /api/datarooms/[dataroomId] - Get dataroom details
 * PUT    /api/datarooms/[dataroomId] - Update a dataroom
 * DELETE /api/datarooms/[dataroomId] - Delete a dataroom
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
 * GET /api/datarooms/[dataroomId]
 *
 * Get details of a specific dataroom.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { dataroomId } = await params;

  if (!dataroomId) {
    return createErrorResponse("DataRoom ID is required", 400);
  }

  return handleProxyRequest(`/datarooms/${dataroomId}`, {
    method: "GET",
  });
}

/**
 * PUT /api/datarooms/[dataroomId]
 *
 * Update a dataroom's configuration.
 *
 * Request Body: Partial dataroom fields to update
 * - description?: string
 * - system_prompt?: string
 * - price_usd?: number
 * - query_limit?: number
 * - expiration_days?: number
 * - is_active?: boolean
 * - dynamic_pricing_enabled?: boolean
 * - price_step_usd?: number
 * - price_decay_rate?: number
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { dataroomId } = await params;

  if (!dataroomId) {
    return createErrorResponse("DataRoom ID is required", 400);
  }

  const { data: body, error } = await parseJsonBody(request);

  if (error) {
    return createErrorResponse(error, 400);
  }

  return handleProxyRequest(`/datarooms/${dataroomId}`, {
    method: "PUT",
    body,
  });
}

/**
 * DELETE /api/datarooms/[dataroomId]
 *
 * Delete a dataroom.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { dataroomId } = await params;

  if (!dataroomId) {
    return createErrorResponse("DataRoom ID is required", 400);
  }

  return handleProxyRequest(`/datarooms/${dataroomId}`, {
    method: "DELETE",
  });
}

/**
 * OPTIONS /api/datarooms/[dataroomId]
 *
 * Handle CORS preflight requests.
 */
export function OPTIONS() {
  return handleCorsOptions();
}
