"use client"

import { skills, SkillData } from "@/data/skills"
import { SkillBadge } from "@/components/SkillBadge"
import { AnimatedSection } from "@/components/AnimatedSection"

const grouped = skills.reduce<Record<string, SkillData[]>>((acc, skill) => {
  if (!acc[skill.category]) acc[skill.category] = []
  acc[skill.category].push(skill)
  return acc
}, {})

// Ancienne section "Compétences" (accordéon dédié), redescendue en bannière
// juste au-dessus du footer, dans le même esprit visuel que le hero
// (mêmes tokens --color-hero-* : suit le thème clair/sombre du site).
export function SkillsBanner() {
  return (
    <section id="competences" aria-label="Compétences" className="px-4 pb-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="relative overflow-hidden rounded-[28px] border border-hero-border bg-hero-bg text-hero-text px-6 py-12 sm:px-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-hero-grid) 1px, transparent 1px), linear-gradient(90deg, var(--color-hero-grid) 1px, transparent 1px)",
              backgroundSize: "88px 88px",
            }}
          />

          <div className="relative">
            <AnimatedSection>
              <p className="font-mono text-xs uppercase tracking-wider text-[#E87C0A] mb-2 text-center">
                Sous le capot
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-hero-text text-center mb-10">
                Mes compétences techniques
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
              {Object.entries(grouped).map(([category, categorySkills], index) => (
                <AnimatedSection key={category} delay={index * 0.06}>
                  <h3 className="font-mono text-xs uppercase tracking-wider text-hero-text-tertiary mb-3">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <SkillBadge key={skill.id} skill={skill} size="sm" />
                    ))}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
