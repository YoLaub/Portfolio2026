"use client"

import { useMemo, useState, type ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

const SIZE = 400
const CENTER = SIZE / 2
const RING_R = 140
const NODE_R = 30
const HUB_R = 44
const ICON = 24 // boîte de dessin des icônes (0..24)

// Arrondit les coordonnées : le dernier bit de Math.cos/sin peut différer entre
// le V8 serveur (SSR) et celui du navigateur, ce qui casse l'hydratation sur des
// coordonnées SVG en pleine précision.
function round(n: number): number {
  return Math.round(n * 1000) / 1000
}

// --- Icônes (traits, style Feather/Lucide), dessinées dans une boîte 24x24.
// Elles héritent stroke/fill du <g> parent, donc aucun style ici.
const ICONS: Record<string, ReactNode> = {
  code: (
    <>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14a9 3 0 0 0 18 0V5" />
      <path d="M3 12a9 3 0 0 0 18 0" />
    </>
  ),
  activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
  bars: (
    <>
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="12" y1="20" x2="12" y2="8" />
      <line x1="18" y1="20" x2="18" y2="4" />
    </>
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </>
  ),
  message: (
    <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.4 8.4 0 0 1-3.8-.9L3 20.5l1.9-5.2a8.4 8.4 0 0 1-.9-3.8 8.4 8.4 0 0 1 8.4-8.4h.1a8.4 8.4 0 0 1 8.4 8.4z" />
  ),
  phone: (
    <>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </>
  ),
  monitor: (
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </>
  ),
  cursor: (
    <>
      <path d="m3 3 7.1 17 2.5-7.4 7.4-2.5z" />
      <path d="m13 13 6 6" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),
  // Icône centrale : un hub / puce (interconnexion).
  cpu: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </>
  ),
}

// Ordre des outils autour du hub (10 noeuds).
const NODE_ICONS = [
  "code",
  "database",
  "activity",
  "bars",
  "mail",
  "message",
  "phone",
  "monitor",
  "cursor",
  "settings",
] as const

type Node = {
  key: string
  icon: string
  x: number
  y: number
  bob: number // amplitude d'oscillation verticale
  delay: number
}

function buildNodes(): Node[] {
  const start = -Math.PI / 2 // premier noeud en haut
  const step = (Math.PI * 2) / NODE_ICONS.length
  return NODE_ICONS.map((icon, i) => {
    const a = start + i * step
    return {
      key: `n${i}`,
      icon,
      x: round(CENTER + Math.cos(a) * RING_R),
      y: round(CENTER + Math.sin(a) * RING_R),
      bob: 3 + (i % 3),
      delay: round((i / NODE_ICONS.length) * 2),
    }
  })
}

type Edge = { x1: number; y1: number; x2: number; y2: number }

function buildEdges(nodes: Node[]): Edge[] {
  const n = nodes.length
  const edges: Edge[] = []
  // Rayons hub -> noeud
  for (const node of nodes) {
    edges.push({ x1: CENTER, y1: CENTER, x2: node.x, y2: node.y })
  }
  // Anneau : noeud i -> i+1
  for (let i = 0; i < n; i++) {
    const a = nodes[i]
    const b = nodes[(i + 1) % n]
    edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y })
  }
  // Cordes : noeud i -> i+2 (un sur deux) pour densifier la toile
  for (let i = 0; i < n; i += 2) {
    const a = nodes[i]
    const b = nodes[(i + 2) % n]
    edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y })
  }
  return edges
}

function iconTransform(cx: number, cy: number, scale: number): string {
  const off = round((ICON / 2) * scale)
  return `translate(${round(cx - off)} ${round(cy - off)}) scale(${scale})`
}

export function HeroHalo() {
  const nodes = useMemo(() => buildNodes(), [])
  const edges = useMemo(() => buildEdges(nodes), [nodes])
  const prefersReduced = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)
  const animate = !prefersReduced
  const pulseDuration = isHovered ? 1.6 : 2.6

  return (
    <div
      className="relative w-full max-w-[220px] aspect-square sm:max-w-[270px] md:max-w-[320px] lg:max-w-[420px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label="Réseau d'outils interconnectés : sites, applications, automatisations et intelligence artificielle"
        className="h-full w-full overflow-visible"
      >
        <motion.g
          initial={false}
          animate={animate ? { scale: [1, 1.02, 1] } : { scale: 1 }}
          transition={
            animate
              ? { duration: 6, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0 }
          }
          style={{ transformOrigin: "50% 50%" }}
        >
          {/* Arêtes du réseau */}
          <g className="stroke-accent" strokeWidth={1.25} opacity={0.28}>
            {edges.map((e, i) => (
              <line
                key={`e${i}`}
                x1={e.x1}
                y1={e.y1}
                x2={e.x2}
                y2={e.y2}
                strokeLinecap="round"
              />
            ))}
          </g>

          {/* Impulsions de données le long des rayons (données qui circulent) */}
          {animate &&
            nodes.map((node, i) => {
              const outward = i % 2 === 0
              const from = outward ? { x: CENTER, y: CENTER } : { x: node.x, y: node.y }
              const to = outward ? { x: node.x, y: node.y } : { x: CENTER, y: CENTER }
              return (
                <motion.circle
                  key={`pulse-${node.key}`}
                  r={2.6}
                  className="fill-accent"
                  cx={from.x}
                  cy={from.y}
                  initial={false}
                  animate={{
                    cx: [from.x, to.x],
                    cy: [from.y, to.y],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: pulseDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: node.delay,
                    times: [0, 0.1, 0.9, 1],
                  }}
                />
              )
            })}

          {/* Noeud central : le hub */}
          <circle cx={CENTER} cy={CENTER} r={HUB_R} className="fill-accent" />
          <g
            className="stroke-bg-primary"
            fill="none"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={iconTransform(CENTER, CENTER, (HUB_R * 1.05) / ICON)}
          >
            {ICONS.cpu}
          </g>

          {/* Noeuds d'outils autour du hub */}
          {nodes.map((node) => (
            <motion.g
              key={node.key}
              initial={false}
              animate={animate ? { y: [0, -node.bob, 0] } : { y: 0 }}
              transition={
                animate
                  ? {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: node.delay,
                    }
                  : { duration: 0 }
              }
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={NODE_R}
                className="fill-accent-soft stroke-accent"
                strokeWidth={1.5}
              />
              <g
                className="stroke-accent"
                fill="none"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                transform={iconTransform(node.x, node.y, (NODE_R * 1.15) / ICON)}
              >
                {ICONS[node.icon]}
              </g>
            </motion.g>
          ))}
        </motion.g>
      </svg>
    </div>
  )
}
