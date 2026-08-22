"use client"

import type { ProjectData } from "@/data/projects"
import { AnimatedSection } from "@/components/AnimatedSection"
import { ProjectShowcaseCard, type ShowcaseVariant } from "@/components/ProjectShowcaseCard"

interface ProjectsSectionProps {
  projects: ProjectData[]
}

// Index 0 -> carte "phare" (grande, verticale). Index 1-2 -> cartes standard
// (vignette + texte). Le reste -> cartes "bandeau" pleine largeur : avec un
// nombre impair d'entrees, la derniere rejoint aussi ce gabarit (cf handoff
// docs/bugs&correction/design_handoff_projets_4b).
function variantFor(index: number): ShowcaseVariant {
  if (index === 0) return "feature"
  if (index === 1 || index === 2) return "standard"
  return "wide"
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const orderedProjects = [...projects].sort((a, b) => {
    const featuredDiff = Number(b.featured ?? false) - Number(a.featured ?? false)
    if (featuredDiff !== 0) return featuredDiff
    return (a.order ?? Infinity) - (b.order ?? Infinity)
  })

  return (
    <section id="projets" aria-label="Projets" className="px-4 py-10">
      <div className="mx-auto max-w-[1440px]">
        <div
          className="relative overflow-hidden rounded-[28px] border border-hero-border bg-hero-bg px-5 py-10 text-hero-text sm:px-8 sm:py-12 lg:px-11 lg:py-[84px]"
          style={{ fontFamily: "var(--font-manrope, ui-sans-serif, system-ui, sans-serif)" }}
        >
          {/* Decors : halo + grille technique, meme esprit que le hero */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-55 -left-35 h-[620px] w-[620px] rounded-full opacity-70 blur-[10px] motion-safe:animate-[hero-pulse-glow_10s_ease-in-out_infinite] motion-reduce:animate-none"
            style={{
              background: "radial-gradient(circle, rgba(232,124,10,.28), rgba(232,124,10,0) 64%)",
            }}
          />
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
              <div className="flex flex-col gap-8 pb-9 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-3.5 font-mono text-[13px] tracking-[.1em] text-hero-text-tertiary">
                    <span className="h-px w-[34px] bg-[#E87C0A]" aria-hidden="true" />
                    MES PROJETS
                  </div>
                  <h2 className="m-0 text-[clamp(38px,10vw,82px)] leading-[0.94] font-extrabold tracking-[-.04em] text-balance">
                    Des outils
                    <br />
                    <span className="text-[#E87C0A]">qui tournent vraiment.</span>
                  </h2>
                </div>
                <p className="max-w-[380px] text-base leading-relaxed text-hero-text-secondary sm:pb-2">
                  Sites, applications, automatisations : des projets menés avec de vrais clients, du
                  site vitrine à l&apos;agent IA branché sur leurs outils.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
              {orderedProjects.map((project, index) => {
                const variant = variantFor(index)
                const spanClass =
                  variant === "feature" ? "lg:row-span-2" : variant === "wide" ? "lg:col-span-2" : ""
                return (
                  <AnimatedSection
                    key={project.id}
                    delay={index * 0.08}
                    className={`h-full min-w-0 ${spanClass}`}
                  >
                    <ProjectShowcaseCard project={project} index={index} variant={variant} />
                  </AnimatedSection>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
