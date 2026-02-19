/**
 * Journal Status API Route
 *
 * GET /api/journal/status - Get agent stack status
 * Falls back to recent episodes if stack/status endpoint is unavailable.
 */
import {
  createSuccessResponse,
  handleCorsOptions,
  proxyToBackend,
} from "@/lib/api/server-utils";

const AGENT_ID =
  process.env["NEXT_PUBLIC_AGENT_ID"] ?? "698b70742849d936f4259849";

export async function GET() {
  // Try stack/status first
  const statusResult = await proxyToBackend(
    `/agents/${AGENT_ID}/stack/status`,
    { method: "GET" }
  );

  if (statusResult.success) {
    return createSuccessResponse(statusResult.data);
  }

  // Fallback: get recent episodes to show activity
  const episodesResult = await proxyToBackend(
    `/agents/${AGENT_ID}/episodes/search`,
    {
      method: "POST",
      body: { query: "", limit: 5 },
    }
  );

  if (episodesResult.success) {
    const episodes = episodesResult.data;
    const episodeCount = Array.isArray(episodes)
      ? episodes.length
      : 0;
    return createSuccessResponse({
      message_count: 0,
      is_ready_for_processing: false,
      last_message_at: null,
      episode_count: episodeCount,
      status: "active",
    });
  }

  // Both failed — return safe defaults
  return createSuccessResponse({
    message_count: 0,
    is_ready_for_processing: false,
    status: "unknown",
  });
}

export function OPTIONS() {
  return handleCorsOptions();
}
