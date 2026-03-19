"use client"

import { useState } from "react"
import { projects } from "@/data/projects"
import { ProjectCard } from "@/components/ProjectCard"
import { AnimatedSection } from "@/components/AnimatedSection"

export function ProjectsSection() {
  const [openId, setOpenId] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section id="projets" aria-label="Projets" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-text-primary mb-12 text-center">
            Mes Projets
          </h2>
        </AnimatedSection>
        <div className="flex flex-col gap-6">
          {projects.map((project, index) => (
            <AnimatedSection key={project.id} delay={index * 0.08}>
              <ProjectCard
                project={project}
                isOpen={openId === project.id}
                onToggle={() => handleToggle(project.id)}
              />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
