"use client"

import { useId, useState, useSyncExternalStore } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import type { ProjectData } from "@/data/projects"
import { GlassModal } from "@/components/GlassModal"
import { ProjectDetail } from "@/components/ProjectDetail"

export type ShowcaseVariant = "feature" | "standard" | "wide"

interface ProjectShowcaseCardProps {
  project: ProjectData
  index: number
  variant: ShowcaseVariant
}

// Meme garde que ThemeToggle/ProjectCard : evite un mismatch d'hydratation.
const emptySubscribe = () => () => {}
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false)
}

export function ProjectShowcaseCard({ project, index, variant }: ProjectShowcaseCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const titleId = useId()
  const { resolvedTheme } = useTheme()
  const mounted = useMounted()

  const isDark = mounted && resolvedTheme === "dark"
  const coverImage = isDark && project.imageDark ? project.imageDark : project.image
  const isMobileApp = project.platform === "mobile"
  const label = `${String(index + 1).padStart(2, "0")} · ${(project.category ?? project.techStack[0]).toUpperCase()}`

  const imageEl = (
    <Image
      src={coverImage}
      alt={`Aperçu de ${project.title}`}
      fill
      sizes={variant === "feature" ? "(min-width: 1024px) 800px, 600px" : "300px"}
      className={
        isMobileApp
          ? "object-contain p-6 transition-transform duration-300 group-hover:scale-105"
          : "object-cover transition-transform duration-300 group-hover:scale-105"
      }
    />
  )

  const imageWrapClass = isMobileApp
    ? isDark && project.imageDark
      ? "bg-[#15182e]"
      : "bg-[#f6f0e9]"
    : "bg-hero-surface"

  if (variant === "feature") {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
          className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[rgba(232,124,10,.3)] text-left transition-all duration-200 hover:-translate-y-1 hover:border-[#E87C0A]"
        >
          <div className={`relative h-[220px] w-full overflow-hidden sm:h-[280px] lg:h-[420px] ${imageWrapClass}`}>
            {imageEl}
            <span
              className="absolute top-4 left-4 rounded-full px-3 py-2 font-mono text-xs tracking-[.08em] text-[#ffb266]"
              style={{ background: "rgba(16,15,14,.72)", border: "1px solid rgba(255,255,255,.14)" }}
            >
              {label}
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-4 p-6 lg:p-8">
            <h3 className="text-2xl font-bold tracking-tight text-hero-text lg:text-[40px] lg:leading-[1.05]">
              {project.title}
            </h3>
            <p className="max-w-[520px] text-[15px] leading-relaxed text-hero-text-secondary lg:text-[17px]">
              {project.description}
            </p>
            <div className="mt-auto flex flex-wrap items-center gap-3 font-mono text-[13px]">
              <span className="rounded-lg bg-[#E87C0A] px-3 py-2 font-bold text-[#100f0e]">
                {isMobileApp ? "Mobile" : "Web"}
              </span>
              <span className="text-hero-marquee">{project.techStack.join(" · ")}</span>
            </div>
          </div>
        </button>

        <GlassModal isOpen={isOpen} onClose={() => setIsOpen(false)} title={project.title} titleId={titleId}>
          <ProjectDetail project={project} />
        </GlassModal>
      </>
    )
  }

  if (variant === "wide") {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
          className="group flex w-full flex-col gap-4 rounded-3xl border border-hero-border bg-hero-surface p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:bg-hero-surface-hover lg:grid lg:grid-cols-[300px_1fr_auto] lg:items-center lg:gap-7"
        >
          <div className={`relative h-[160px] w-full overflow-hidden rounded-2xl sm:h-[180px] lg:h-[150px] ${imageWrapClass}`}>
            {imageEl}
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs tracking-[.1em] text-hero-marquee">{label}</span>
            <h3 className="text-[22px] leading-tight font-bold tracking-tight text-hero-text lg:text-[28px]">
              {project.title}
            </h3>
            <p className="max-w-[520px] text-[15px] leading-relaxed text-hero-text-tertiary">
              {project.description}
            </p>
          </div>
          <div className="flex items-center gap-4 lg:pr-3.5">
            <span className="font-mono text-[13px] text-hero-marquee">{project.techStack.join(" · ")}</span>
            <span
              className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-hero-border-strong font-mono text-lg text-hero-text"
              aria-hidden="true"
            >
              →
            </span>
          </div>
        </button>

        <GlassModal isOpen={isOpen} onClose={() => setIsOpen(false)} title={project.title} titleId={titleId}>
          <ProjectDetail project={project} />
        </GlassModal>
      </>
    )
  }

  // standard
  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        className="group flex flex-col gap-4 rounded-3xl border border-hero-border bg-hero-surface p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:bg-hero-surface-hover sm:grid sm:grid-cols-[150px_1fr] sm:gap-5"
      >
        <div className={`relative h-[160px] w-full overflow-hidden rounded-2xl sm:h-full ${imageWrapClass}`}>
          {imageEl}
        </div>
        <div className="flex flex-col gap-3 sm:py-3">
          <span className="font-mono text-xs tracking-[.1em] text-hero-marquee">{label}</span>
          <h3 className="text-2xl leading-tight font-bold tracking-tight text-hero-text">{project.title}</h3>
          <p className="text-[15px] leading-relaxed text-hero-text-tertiary">{project.description}</p>
          <span className="mt-auto font-mono text-xs text-hero-marquee">{project.techStack.join(" · ")}</span>
        </div>
      </button>

      <GlassModal isOpen={isOpen} onClose={() => setIsOpen(false)} title={project.title} titleId={titleId}>
        <ProjectDetail project={project} />
      </GlassModal>
    </>
  )
}
