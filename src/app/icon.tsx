import { ImageResponse } from "next/og"

// Favicon genere a la demande par Next.js (convention de fichier App Router).
// Memes couleurs que opengraph-image.tsx : fond ambre, initiales sombres.
export const size = { width: 32, height: 32 }
export const contentType = "image/png"

const ACCENT = "#f59e0b"
const BG = "#0a0a0a"

export default function Icon() {
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
          borderRadius: 6,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            color: BG,
            fontSize: 18,
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
