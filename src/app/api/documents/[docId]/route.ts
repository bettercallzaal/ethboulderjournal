/**
 * Single Document API Route
 *
 * GET    /api/documents/[docId] - Get document/entity details
 * DELETE /api/documents/[docId] - Delete a document/entity
 */
import { NextRequest } from "next/server";

import {
  createErrorResponse,
  extractQueryParams,
  handleCorsOptions,
  handleProxyRequest,
} from "@/lib/api/server-utils";

interface RouteParams {
  params: Promise<{ docId: string }>;
}

/**
 * GET /api/documents/[docId]
 *
 * Get details of a specific document/entity by UUID.
 *
 * Query Parameters:
 * - bonfire_id?: string - Filter by bonfire context
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { docId } = await params;

  if (!docId) {
    return createErrorResponse("Document ID is required", 400);
  }

  const queryParams = extractQueryParams(request, ["bonfire_id"]);

  return handleProxyRequest(`/knowledge_graph/entity/${docId}`, {
    method: "GET",
    queryParams: queryParams["bonfire_id"]
      ? { bonfire_id: queryParams["bonfire_id"] }
      : undefined,
  });
}

/**
 * DELETE /api/documents/[docId]
 *
 * Delete a document/entity by UUID.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { docId } = await params;

  if (!docId) {
    return createErrorResponse("Document ID is required", 400);
  }

  return handleProxyRequest(`/knowledge_graph/entity/${docId}`, {
    method: "DELETE",
  });
}

/**
 * OPTIONS /api/documents/[docId]
 *
 * Handle CORS preflight requests.
 */
export function OPTIONS() {
  return handleCorsOptions();
}
