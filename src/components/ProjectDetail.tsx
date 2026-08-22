import Image from "next/image"
import type { ProjectData } from "@/data/projects"
import { PhoneMockup } from "@/components/PhoneMockup"
import { BrowserMockup } from "@/components/BrowserMockup"

// Contenu de la modale de detail projet (galerie, description longue, liens),
// partage par toutes les variantes de carte de ProjectsSection.
export function ProjectDetail({ project }: { project: ProjectData }) {
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
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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
