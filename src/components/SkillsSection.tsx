"use client"

import { skills, SkillData } from "@/data/skills"
import { SkillBadge } from "@/components/SkillBadge"
import { AnimatedSection } from "@/components/AnimatedSection"

const grouped = skills.reduce<Record<string, SkillData[]>>((acc, skill) => {
  if (!acc[skill.category]) acc[skill.category] = []
  acc[skill.category].push(skill)
  return acc
}, {})

export function SkillsSection() {
  return (
    <section id="competences" aria-label="Compétences" className="py-20">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
            Mes Compétences
          </h2>
        </AnimatedSection>
        <div className="space-y-10">
          {Object.entries(grouped).map(([category, categorySkills], groupIndex) => (
            <AnimatedSection key={category} delay={groupIndex * 0.1}>
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                {category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {categorySkills.map((skill) => (
                  <SkillBadge key={skill.id} skill={skill} />
                ))}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
