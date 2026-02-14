/**
 * Journal Add API Route
 *
 * POST /api/journal/add - Add a message to the agent's stack
 * Uses API_KEY auth (public endpoint, no Clerk required)
 */
import { NextRequest, NextResponse } from "next/server";

import { CORS_HEADERS } from "@/lib/api/server-utils";

const DELVE_API_URL =
  process.env["DELVE_API_URL"] ??
  process.env["NEXT_PUBLIC_DELVE_API_URL"] ??
  "https://tnt-v2.api.bonfires.ai";

const API_KEY = process.env["API_KEY"] ?? "";
const AGENT_ID = process.env["NEXT_PUBLIC_AGENT_ID"] ?? "698b70742849d936f4259849";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, userId = "zabal-community" } = body as {
      text?: string;
      userId?: string;
    };

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const timestamp = new Date().toISOString();

    const response = await fetch(
      `${DELVE_API_URL}/agents/${AGENT_ID}/stack/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          message: {
            text: `[ZABAL Journal - ${timestamp}] ${text.trim()}`,
            userId,
            chatId: "zabal-web",
            timestamp,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Failed to add to stack", details: errorText },
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
