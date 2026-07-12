import { ImageResponse } from "next/og"

// Image de partage (Open Graph / Twitter) generee a la demande par Next.js.
// Convention de fichier : Next injecte automatiquement les balises
// og:image / twitter:image pointant vers cette route. Couleurs alignees sur
// la palette du site (globals.css) : fond sombre, accent ambre.
export const alt =
  "Yoann Laubert, concepteur d'applications et agents IA, developpeur freelance a Vannes"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const BG = "#0a0a0a"
const ACCENT = "#f59e0b"
const TEXT = "#f5f5f5"
const MUTED = "#a3a3a3"
const FAINT = "#525252"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Bandeau d'accent en haut */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "10px",
            background: ACCENT,
            display: "flex",
          }}
        />

        {/* En-tete : marque */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 9999,
              background: ACCENT,
              display: "flex",
            }}
          />
          <div
            style={{
              display: "flex",
              color: MUTED,
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: "0.18em",
            }}
          >
            YL-SOLUTION
          </div>
        </div>

        {/* Bloc central : nom + positionnement */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              display: "flex",
              color: TEXT,
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.02,
            }}
          >
            Yoann Laubert
          </div>
          <div
            style={{
              display: "flex",
              color: ACCENT,
              fontSize: 46,
              fontWeight: 600,
              lineHeight: 1.1,
            }}
          >
            Concepteur d&apos;applications &amp; agents IA
          </div>
          <div
            style={{
              display: "flex",
              color: MUTED,
              fontSize: 32,
              lineHeight: 1.2,
            }}
          >
            Sites, applications, automatisations sur mesure - Vannes
          </div>
        </div>

        {/* Pied : domaine + accroche metier */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              color: TEXT,
              fontSize: 34,
              fontWeight: 600,
            }}
          >
            yl-solution.fr
          </div>
          <div style={{ display: "flex", color: FAINT, fontSize: 26 }}>
            Developpeur freelance en Bretagne
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
