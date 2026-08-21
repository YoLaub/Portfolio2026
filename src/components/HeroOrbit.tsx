"use client"

import { type ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

// Graphique decoratif du hero "Nuit" (cf docs/bugs&correction/design_handoff_hero_nuit) :
// un hub central entoure de deux orbites de "noeuds outils" en rotation continue,
// chaque noeud contre-tournant pour rester droit. Purement decoratif -> aria-hidden.
// Icones reelles (style Lucide/Phosphor) a la place des glyphes typographiques
// du prototype, comme demande dans le handoff.

const ICON: Record<string, ReactNode> = {
  code: (
    <>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </>
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </>
  ),
  fileText: (
    <>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z" />
      <path d="M14 2v6h6" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </>
  ),
  message: (
    <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.4 8.4 0 0 1-3.8-.9L3 20.5l1.9-5.2a8.4 8.4 0 0 1-.9-3.8 8.4 8.4 0 0 1 8.4-8.4h.1a8.4 8.4 0 0 1 8.4 8.4z" />
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14a9 3 0 0 0 18 0V5" />
      <path d="M3 12a9 3 0 0 0 18 0" />
    </>
  ),
  monitor: (
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </>
  ),
  activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14" />
    </>
  ),
  cursor: (
    <>
      <path d="m3 3 7.1 17 2.5-7.4 7.4-2.5z" />
      <path d="m13 13 6 6" />
    </>
  ),
  sparkle: (
    <path d="M12 2 13.8 9.2 21 11l-7.2 1.8L12 20l-1.8-7.2L3 11l7.2-1.8z" />
  ),
  shuffle: (
    <>
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </>
  ),
}

// Positions en % (cf handoff) : 8 noeuds sur l'orbite externe, tous les 45°.
const OUTER_NODES = [
  { icon: "code", left: "100%", top: "50%" },
  { icon: "mail", left: "85.36%", top: "85.36%" },
  { icon: "fileText", left: "50%", top: "100%" },
  { icon: "message", left: "14.64%", top: "85.36%" },
  { icon: "settings", left: "0%", top: "50%" },
  { icon: "database", left: "14.64%", top: "14.64%" },
  { icon: "monitor", left: "50%", top: "0%" },
  { icon: "activity", left: "85.36%", top: "14.64%" },
] as const

// 4 noeuds sur l'orbite interne, aux diagonales.
const INNER_NODES = [
  { icon: "clock", left: "85.36%", top: "14.64%" },
  { icon: "cursor", left: "14.64%", top: "85.36%" },
  { icon: "sparkle", left: "85.36%", top: "85.36%" },
  { icon: "settings", left: "14.64%", top: "14.64%" },
] as const

function IconGlyph({ name, size, color }: { name: string; size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICON[name]}
    </svg>
  )
}

export function HeroOrbit() {
  const prefersReduced = useReducedMotion()
  const animate = !prefersReduced
  const spin = (duration: number, reverse = false) =>
    animate
      ? {
          animate: { rotate: reverse ? -360 : 360 },
          transition: { duration, repeat: Infinity, ease: "linear" as const },
        }
      : { animate: { rotate: 0 }, transition: { duration: 0 } }

  return (
    <div
      aria-hidden="true"
      className="relative flex h-[320px] items-center justify-center sm:h-[380px] lg:h-[520px]"
    >
      <div className="relative h-[404px] w-[404px] scale-[0.64] sm:scale-[0.8] lg:scale-100">
        {/* Liens : croix de 4 filets en rotation lente */}
        <motion.div className="absolute inset-0" {...spin(60)}>
          {[0, 45, 90, 135].map((deg) => (
            <span
              key={deg}
              className="absolute left-0 right-0 top-1/2 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(232,124,10,.3), transparent)",
                transform: `rotate(${deg}deg)`,
              }}
            />
          ))}
        </motion.div>

        {/* Orbite externe : 8 noeuds outils */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: "1px dashed rgba(232,124,10,.22)" }}
          {...spin(60)}
        >
          {OUTER_NODES.map((node, i) => (
            <motion.div
              key={i}
              className="absolute flex h-14 w-14 items-center justify-center rounded-[18px]"
              style={{
                left: node.left,
                top: node.top,
                marginLeft: "-28px",
                marginTop: "-28px",
                background: "rgba(255,255,255,.06)",
                border: "1px solid rgba(255,255,255,.14)",
              }}
              {...spin(60, true)}
            >
              <IconGlyph name={node.icon} size={22} color="#ffb266" />
            </motion.div>
          ))}
        </motion.div>

        {/* Orbite interne : 4 noeuds */}
        <motion.div
          className="absolute rounded-full"
          style={{
            left: "76px",
            top: "76px",
            width: "252px",
            height: "252px",
            border: "1px solid rgba(255,255,255,.1)",
          }}
          {...spin(38, true)}
        >
          {INNER_NODES.map((node, i) => (
            <motion.div
              key={i}
              className="absolute flex h-[46px] w-[46px] items-center justify-center rounded-2xl"
              style={{
                left: node.left,
                top: node.top,
                marginLeft: "-23px",
                marginTop: "-23px",
                background: "rgba(232,124,10,.14)",
                border: "1px solid rgba(232,124,10,.35)",
              }}
              {...spin(38)}
            >
              <IconGlyph name={node.icon} size={18} color="#E87C0A" />
            </motion.div>
          ))}
        </motion.div>

        {/* Coeur */}
        <motion.div
          className="absolute flex flex-col items-center justify-center gap-1.5 rounded-[40px]"
          style={{
            left: "50%",
            top: "50%",
            marginLeft: "-68px",
            marginTop: "-68px",
            width: "136px",
            height: "136px",
            background: "linear-gradient(150deg, #ff9d33, #D2700A)",
            boxShadow: "0 30px 80px rgba(232,124,10,.42)",
          }}
          animate={animate ? { y: [0, -14, 0] } : { y: 0 }}
          transition={
            animate
              ? { duration: 6, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0 }
          }
        >
          <IconGlyph name="shuffle" size={32} color="#100f0e" />
          <span
            className="font-mono text-[11px] font-bold tracking-[.1em]"
            style={{ color: "rgba(16,15,14,.65)" }}
          >
            TOUT CONNECTÉ
          </span>
        </motion.div>
      </div>
    </div>
  )
}
