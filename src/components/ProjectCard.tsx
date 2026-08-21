"use client"

import { useId, useState } from "react"
import Image from "next/image"
import type { ProjectData } from "@/data/projects"
import { PhoneMockup } from "@/components/PhoneMockup"
import { BrowserMockup } from "@/components/BrowserMockup"
import { GlassModal } from "@/components/GlassModal"

interface ProjectCardProps {
  project: ProjectData
}

// Carte "bento" : la couverture est toujours visible (plus de texte seul en
// attente de clic), le detail (longDescription, galerie, liens) s'ouvre dans
// la GlassModal deja utilisee pour le detail technique des services.
export function ProjectCard({ project }: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const titleId = useId()

  return (
    <>
      <article
        className={`group h-full flex flex-col overflow-hidden rounded-xl border border-border bg-bg-elevated transition-all duration-200 hover:border-accent hover:-translate-y-1 hover:shadow-lg ${
          project.featured ? "sm:col-span-2" : ""
        }`}
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
          className="relative block w-full aspect-16/10 overflow-hidden cursor-pointer bg-bg-primary"
        >
          {project.platform === "mobile" ? (
            // Capture d'app mobile = portrait : un cover en object-cover large
            // l'ecraserait (cf docs/bugs&correction). On garde l'effet "telephone
            // qu'on consulte" avec un cadre a son propre ratio, centre dans la carte.
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-[92%] aspect-9/19 rounded-2xl border border-border overflow-hidden shadow-lg">
                <Image
                  src={project.image}
                  alt={`Aperçu de ${project.title}`}
                  fill
                  sizes="220px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          ) : (
            <Image
              src={project.image}
              alt={`Aperçu de ${project.title}`}
              fill
              sizes={project.featured ? "(min-width: 640px) 800px, 400px" : "400px"}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
          {project.platform === "mobile" && (
            <span className="absolute top-3 left-3 bg-bg-primary/80 backdrop-blur-sm text-accent font-mono text-xs px-2 py-1 rounded">
              Mobile · React Native
            </span>
          )}
        </button>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-xl font-bold text-text-primary mb-2">{project.title}</h3>
          <p className="text-text-secondary mb-3">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="bg-accent-soft text-accent font-mono text-sm px-2 py-1 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="mt-auto self-start text-sm font-medium text-accent hover:underline cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Voir le projet →
          </button>
        </div>
      </article>

      <GlassModal isOpen={isOpen} onClose={() => setIsOpen(false)} title={project.title} titleId={titleId}>
        <ProjectDetail project={project} />
      </GlassModal>
    </>
  )
}

function ProjectDetail({ project }: { project: ProjectData }) {
  return (
    <>
      {project.screens && project.screens.length > 0 ? (
        <div className="mb-6 flex justify-center">
          {project.platform === "mobile" ? (
            <PhoneMockup screens={project.screens} appName={project.title} />
          ) : (
            <BrowserMockup screens={project.screens} appName={project.title} />
          )}
        </div>
      ) : (
        <div className="mb-6 flex justify-center">
          <div className="relative w-full max-w-md aspect-16/10 rounded-xl border border-border overflow-hidden shadow-lg">
            <Image
              src={project.image}
              alt={`Aperçu de ${project.title}`}
              fill
              sizes="400px"
              className="object-cover"
            />
          </div>
        </div>
      )}
      <p className="text-text-secondary mb-4">{project.longDescription}</p>
      <div className="flex flex-wrap gap-3">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent text-bg-primary font-semibold px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors"
          >
            Voir le projet
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 3H3V13H13V10M9 3H13V7M13 3L7 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-border text-text-primary px-4 py-2 rounded-lg hover:border-accent hover:text-accent transition-colors"
          >
            GitHub
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 3H3V13H13V10M9 3H13V7M13 3L7 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}
      </div>
    </>
  )
}
