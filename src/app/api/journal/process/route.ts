/**
 * Journal Process API Route
 *
 * POST /api/journal/process - Trigger stack processing into episodes
 */
import {
  handleCorsOptions,
  handleProxyRequest,
} from "@/lib/api/server-utils";

const AGENT_ID =
  process.env["NEXT_PUBLIC_AGENT_ID"] ?? "698b70742849d936f4259849";

export async function POST() {
  return handleProxyRequest(`/agents/${AGENT_ID}/stack/process`, {
    method: "POST",
  });
}

export function OPTIONS() {
  return handleCorsOptions();
}
