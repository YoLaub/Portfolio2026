"use client"

import type { ProjectData } from "@/data/projects"
import { ProjectCard } from "@/components/ProjectCard"
import { AnimatedSection } from "@/components/AnimatedSection"

interface ProjectsSectionProps {
  projects: ProjectData[]
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const orderedProjects = [...projects].sort((a, b) => {
    const featuredDiff = Number(b.featured ?? false) - Number(a.featured ?? false)
    if (featuredDiff !== 0) return featuredDiff
    return (a.order ?? Infinity) - (b.order ?? Infinity)
  })

  return (
    <section id="projets" aria-label="Projets" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-text-primary mb-12 text-center">
            Mes Projets
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {orderedProjects.map((project, index) => (
            <AnimatedSection
              key={project.id}
              delay={index * 0.08}
              className={`h-full ${project.featured ? "sm:col-span-2" : ""}`}
            >
              <ProjectCard project={project} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
