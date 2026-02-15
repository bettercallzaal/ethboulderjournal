import { ImageResponse } from "next/og";

export const runtime = "edge";

/**
 * Frame embed image — 3:2 aspect ratio (1200x800) as required by Farcaster Mini Apps.
 */
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200",
          height: "800",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0f 0%, #1a1020 50%, #0a0a0f 100%)",
          fontFamily: "sans-serif",
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

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: "80px",
              fontWeight: 900,
              color: "white",
              letterSpacing: "-2px",
            }}
          >
            ZABAL
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 600,
              color: "#ff6b2b",
              letterSpacing: "6px",
              textTransform: "uppercase",
            }}
          >
            × ETH Boulder
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#94A3B8",
              marginTop: "16px",
              maxWidth: "650px",
              textAlign: "center",
              lineHeight: "1.6",
            }}
          >
            Explore the knowledge graph, add your insights, and share what&apos;s happening at ETH Boulder 2026
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 800,
    }
  );
}
