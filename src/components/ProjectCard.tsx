"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import type { ProjectData } from "@/data/projects"

interface ProjectCardProps {
  project: ProjectData
  isOpen: boolean
  onToggle: () => void
}

export function ProjectCard({ project, isOpen, onToggle }: ProjectCardProps) {
  const prefersReduced = useReducedMotion()
  const contentId = `project-content-${project.id}`
  const [animating, setAnimating] = useState(false)

  return (
    <article
      className={`bg-bg-elevated border rounded-xl transition-all duration-200 ${
        isOpen ? "border-accent" : "border-border hover:border-accent hover:-translate-y-1 hover:shadow-lg"
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="w-full text-left p-6 flex items-start justify-between gap-4 cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-text-primary mb-2">
            {project.title}
          </h3>
          <p className="text-text-secondary mb-3">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="bg-accent-soft text-accent font-mono text-sm px-2 py-1 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        <span
          className={`text-text-secondary mt-1 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {prefersReduced ? (
        isOpen && (
          <div id={contentId} className="px-6 pb-6 border-t border-border pt-4">
            <ProjectCardContent project={project} />
          </div>
        )
      ) : (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              id={contentId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ overflow: animating ? "hidden" : "visible" }}
              onAnimationStart={() => setAnimating(true)}
              onAnimationComplete={() => setAnimating(false)}
            >
              <div className="px-6 pb-6 border-t border-border pt-4">
                <ProjectCardContent project={project} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </article>
  )
}

function ProjectCardContent({ project }: { project: ProjectData }) {
  return (
    <>
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
