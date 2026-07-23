"use client"

import { useState, useId } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"

interface BrowserMockupProps {
  screens: string[]
  appName: string
}

export function BrowserMockup({ screens, appName }: BrowserMockupProps) {
  const prefersReduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const regionId = useId()
  const count = screens.length

  const go = (next: number) => setIndex(((next % count) + count) % count)

  if (count === 0) return null

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <div id={regionId} className="relative w-full aspect-16/10 rounded-xl border border-border bg-bg-primary overflow-hidden shadow-lg">
        <div className="h-7 flex items-center gap-1.5 px-3 border-b border-border bg-bg-elevated">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
        </div>
        <motion.div
          key={index}
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReduced ? 0 : 0.25 }}
          className="absolute inset-0 top-7"
        >
          <Image
            src={screens[index]}
            alt={`Capture d'écran ${index + 1} du site ${appName}`}
            fill
            sizes="400px"
            className="object-cover object-top"
          />
        </motion.div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Écran précédent"
          onClick={() => go(index - 1)}
          className="p-2 rounded-full border border-border text-text-secondary hover:border-accent hover:text-accent transition-colors cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div role="radiogroup" aria-label={`Écrans de ${appName}`} className="flex gap-2">
          {screens.map((_, i) => (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={i === index}
              aria-controls={regionId}
              aria-label={`Aller à l'écran ${i + 1}`}
              onClick={() => go(i)}
              className={`h-2.5 w-2.5 rounded-full transition-colors cursor-pointer ${
                i === index ? "bg-accent" : "bg-border hover:bg-text-secondary"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Écran suivant"
          onClick={() => go(index + 1)}
          className="p-2 rounded-full border border-border text-text-secondary hover:border-accent hover:text-accent transition-colors cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
