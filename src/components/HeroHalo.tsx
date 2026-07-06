"use client"

import { useMemo, useState } from "react"
import { motion, useReducedMotion } from "motion/react"

const SIZE = 400
const CENTER = SIZE / 2
const RAYS = 40
const DOTS_PER_RAY = 4
const RING_INNER = 128
const RING_OUTER = 178
const CORE_RADIUS = 108

type Dot = {
  id: string
  targetX: number
  targetY: number
  scatteredX: number
  scatteredY: number
  size: number
  opacity: number
  delay: number
}

// Arrondit les résultats de Math.cos/sin : leur dernier bit peut différer entre le V8
// serveur (Node/SSR) et celui du navigateur, ce qui casse l'hydratation sur des coordonnées
// SVG en pleine précision (ex. 110.89426920926509 vs ...508).
function round(n: number): number {
  return Math.round(n * 10000) / 10000
}

// PRNG déterministe pour éviter les mismatchs d'hydratation SSR/client
function mulberry32(seed: number) {
  return function random() {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildDots(): Dot[] {
  const random = mulberry32(42)
  const dots: Dot[] = []

  for (let ray = 0; ray < RAYS; ray++) {
    const angle = (ray / RAYS) * Math.PI * 2
    for (let d = 0; d < DOTS_PER_RAY; d++) {
      const t = d / (DOTS_PER_RAY - 1)
      const radius = RING_INNER + t * (RING_OUTER - RING_INNER)
      const targetX = round(CENTER + Math.cos(angle) * radius)
      const targetY = round(CENTER + Math.sin(angle) * radius)

      const scatterAngle = random() * Math.PI * 2
      const scatterRadius = Math.min(RING_OUTER + 15, radius + (random() - 0.2) * 90)
      const scatteredX = round(CENTER + Math.cos(scatterAngle) * scatterRadius)
      const scatteredY = round(CENTER + Math.sin(scatterAngle) * scatterRadius)

      dots.push({
        id: `${ray}-${d}`,
        targetX,
        targetY,
        scatteredX,
        scatteredY,
        size: 3.4 - t * 1.6,
        opacity: 1 - t * 0.55,
        delay: random() * 0.35,
      })
    }
  }

  return dots
}

export function HeroHalo() {
  const dots = useMemo(() => buildDots(), [])
  const prefersReduced = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)
  const assembled = prefersReduced || isHovered

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
        aria-label="Yoann Laubert"
        className="h-full w-full overflow-visible"
      >
        <motion.circle
          cx={CENTER}
          cy={CENTER}
          r={CORE_RADIUS}
          className="fill-accent-soft stroke-accent"
          strokeWidth={2}
          initial={false}
          animate={{ scale: assembled ? 1.03 : 1 }}
          style={{ transformOrigin: "50% 50%" }}
          transition={
            prefersReduced ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 20 }
          }
        />
        <text
          x={CENTER}
          y={CENTER}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-accent font-bold text-[96px]"
        >
          YL
        </text>

        {dots.map((dot) => (
          <motion.circle
            key={dot.id}
            r={dot.size}
            className="fill-accent"
            initial={false}
            animate={
              assembled
                ? { cx: dot.targetX, cy: dot.targetY, opacity: dot.opacity }
                : { cx: dot.scatteredX, cy: dot.scatteredY, opacity: 0 }
            }
            transition={
              prefersReduced
                ? { duration: 0 }
                : { type: "spring", stiffness: 260, damping: 20, delay: assembled ? dot.delay : 0 }
            }
          />
        ))}
      </svg>
    </div>
  )
}
