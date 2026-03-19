"use client"

import { motion, useReducedMotion } from "motion/react"

export function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      {...(prefersReduced
        ? {}
        : {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: {
              duration: 0.5,
              ease: [0.25, 0.1, 0.25, 1],
              delay,
            },
          })}
    >
      {children}
    </motion.div>
  )
}
