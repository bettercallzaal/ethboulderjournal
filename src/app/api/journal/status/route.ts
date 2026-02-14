/**
 * Journal Status API Route
 *
 * GET /api/journal/status - Get agent stack status
 * Falls back to recent episodes if stack/status endpoint is unavailable.
 */
import { NextResponse } from "next/server";

import { CORS_HEADERS } from "@/lib/api/server-utils";

const DELVE_API_URL =
  process.env["DELVE_API_URL"] ??
  process.env["NEXT_PUBLIC_DELVE_API_URL"] ??
  "https://tnt-v2.api.bonfires.ai";

const API_KEY = process.env["API_KEY"] ?? "";
const AGENT_ID = process.env["NEXT_PUBLIC_AGENT_ID"] ?? "698b70742849d936f4259849";

export async function GET() {
  try {
    // Try stack/status first
    const response = await fetch(
      `${DELVE_API_URL}/agents/${AGENT_ID}/stack/status`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: 200, headers: CORS_HEADERS });
    }

    // Fallback: get recent episodes to show activity
    const episodesRes = await fetch(
      `${DELVE_API_URL}/agents/${AGENT_ID}/episodes/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({ query: "", limit: 5 }),
      }
    );

    if (episodesRes.ok) {
      const episodes = await episodesRes.json();
      const episodeCount = Array.isArray(episodes) ? episodes.length : 0;
      return NextResponse.json(
        {
          message_count: 0,
          is_ready_for_processing: false,
          last_message_at: null,
          episode_count: episodeCount,
          status: "active",
        },
        { status: 200, headers: CORS_HEADERS }
      );
    }

    // Both failed
    return NextResponse.json(
      { message_count: 0, is_ready_for_processing: false, status: "unknown" },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}
