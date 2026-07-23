"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { skills, SkillData } from "@/data/skills"
import { SkillBadge } from "@/components/SkillBadge"
import { AnimatedSection } from "@/components/AnimatedSection"

const grouped = skills.reduce<Record<string, SkillData[]>>((acc, skill) => {
  if (!acc[skill.category]) acc[skill.category] = []
  acc[skill.category].push(skill)
  return acc
}, {})

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}

const badgeVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
}

const CONTENT_ID = "competences-detail"

export function SkillsSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [animating, setAnimating] = useState(false)
  const prefersReduced = useReducedMotion()

  return (
    <section id="competences" aria-label="Compétences" className="py-20">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-text-primary text-center mb-4">
            Mes Compétences
          </h2>
          <p className="text-text-secondary text-center mb-8 max-w-xl mx-auto">
            Pas besoin de connaître ces outils pour en profiter, mais si vous voulez vérifier
            mon sérieux, voici le détail technique.
          </p>
          <div className="flex justify-center mb-2">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-controls={CONTENT_ID}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary hover:border-accent transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {isOpen ? "Masquer le détail technique" : "Voir le détail technique"}
              <svg
                width="14"
                height="14"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </AnimatedSection>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={CONTENT_ID}
              role="region"
              aria-label="Détail des compétences techniques"
              initial={prefersReduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ overflow: animating ? "hidden" : "visible" }}
              onAnimationStart={() => setAnimating(true)}
              onAnimationComplete={() => setAnimating(false)}
            >
              <div className="space-y-10 pt-6">
                {Object.entries(grouped).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold text-text-primary mb-4">{category}</h3>
                    <motion.div
                      className="flex flex-wrap gap-3"
                      variants={prefersReduced ? undefined : containerVariants}
                      initial={prefersReduced ? undefined : "hidden"}
                      animate={prefersReduced ? undefined : "show"}
                    >
                      {categorySkills.map((skill) => (
                        <motion.span key={skill.id} variants={prefersReduced ? undefined : badgeVariants}>
                          <SkillBadge skill={skill} />
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
