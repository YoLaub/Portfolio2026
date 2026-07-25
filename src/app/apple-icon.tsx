import { ImageResponse } from "next/og"

// Icone iOS (ecran d'accueil) generee a la demande, memes couleurs que icon.tsx.
export const size = { width: 180, height: 180 }
export const contentType = "image/png"

const ACCENT = "#f59e0b"
const BG = "#0a0a0a"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: ACCENT,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            color: BG,
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          YL
        </div>
      </div>
    ),
    { ...size }
  )
}
