import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * Dynamic OG image for a specific entity or episode.
 * Query params: ?name=...&type=entity|episode&summary=...&connections=5
 * Returns a 1200x630 image with the item details branded with ZABAL.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const name = searchParams.get("name") || "ZABAL Knowledge Graph";
  const type = searchParams.get("type") || "entity";
  const summary = searchParams.get("summary") || "";
  const connections = searchParams.get("connections") || "";

  const typeColor = type === "episode" ? "#4fc5ff" : "#ff6b2b";
  const typeLabel = type === "episode" ? "EPISODE" : "ENTITY";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200",
          height: "630",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0a0a0f 0%, #1a1020 50%, #0a0a0f 100%)",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        {/* Brand accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #ff6b2b, #ff9a5c, #4fc5ff)",
          }}
        />

        {/* Type badge + ZABAL branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                padding: "6px 16px",
                borderRadius: "20px",
                background: `${typeColor}20`,
                color: typeColor,
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "2px",
              }}
            >
              {typeLabel}
            </div>
            {connections && (
              <div
                style={{
                  color: "#64748B",
                  fontSize: "14px",
                }}
              >
                {connections} connections
              </div>
            )}
          </div>
          <div
            style={{
              color: "#64748B",
              fontSize: "14px",
              letterSpacing: "1px",
            }}
          >
            ZABAL × ETH Boulder
          </div>
        </div>

        {/* Entity name */}
        <div
          style={{
            fontSize: name.length > 40 ? "42px" : "56px",
            fontWeight: 900,
            color: "white",
            letterSpacing: "-1px",
            lineHeight: 1.2,
            marginBottom: "20px",
            maxWidth: "1000px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {name}
        </div>

        {/* Summary */}
        {summary && (
          <div
            style={{
              fontSize: "20px",
              color: "#94A3B8",
              lineHeight: 1.6,
              maxWidth: "900px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {summary}
          </div>
        )}

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "60px",
            right: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#64748B",
              fontSize: "15px",
            }}
          >
            ethboulderjournal.vercel.app/knowledge
          </div>
          <div
            style={{
              color: "#ff6b2b",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            #onchaincreators
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
