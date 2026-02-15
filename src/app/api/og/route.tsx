import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200",
          height: "630",
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
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: 900,
              color: "white",
              letterSpacing: "-2px",
            }}
          >
            ZABAL
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#ff6b2b",
              letterSpacing: "4px",
              textTransform: "uppercase",
            }}
          >
            × ETH Boulder 2026
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#94A3B8",
              marginTop: "12px",
              maxWidth: "600px",
              textAlign: "center",
              lineHeight: "1.5",
            }}
          >
            Knowledge graph · Builder journal · Live conversations
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#64748B",
            fontSize: "16px",
          }}
        >
          ethboulderjournal.vercel.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
