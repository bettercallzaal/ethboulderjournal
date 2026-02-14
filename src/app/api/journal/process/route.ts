/**
 * Journal Process API Route
 *
 * POST /api/journal/process - Trigger stack processing into episodes
 */
import { NextResponse } from "next/server";

import { CORS_HEADERS } from "@/lib/api/server-utils";

const DELVE_API_URL =
  process.env["DELVE_API_URL"] ??
  process.env["NEXT_PUBLIC_DELVE_API_URL"] ??
  "https://tnt-v2.api.bonfires.ai";

const API_KEY = process.env["API_KEY"] ?? "";
const AGENT_ID = process.env["NEXT_PUBLIC_AGENT_ID"] ?? "698b70742849d936f4259849";

export async function POST() {
  try {
    const response = await fetch(
      `${DELVE_API_URL}/agents/${AGENT_ID}/stack/process`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Failed to process stack", details: errorText },
        { status: response.status, headers: CORS_HEADERS }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200, headers: CORS_HEADERS });
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
