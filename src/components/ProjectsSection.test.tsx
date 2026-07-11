import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { ProjectsSection } from "@/components/ProjectsSection"
import type { ProjectData } from "@/data/projects"

afterEach(() => {
  cleanup()
})

// Gants placé en premier dans les données : le composant doit remonter LOAR
// (featured) avant lui à l'affichage.
const projects: ProjectData[] = [
  {
    id: "les-gants-melecien",
    title: "Les Gants Melecien",
    description: "Site vitrine.",
    longDescription: "Site vitrine avec backoffice.",
    techStack: ["Next.js"],
    image: "/images/projects/gants-melecien.webp",
  },
  {
    id: "loar",
    title: "LOAR",
    description: "Compagnon IA mobile.",
    longDescription: "Compagnon IA mobile spécialisé.",
    techStack: ["React Native"],
    image: "/images/projects/loar/cover.webp",
    featured: true,
    platform: "mobile",
  },
]

describe("ProjectsSection - ordre featured", () => {
  it("affiche le titre de LOAR avant celui des Gants Melecien dans le DOM", () => {
    render(<ProjectsSection projects={projects} />)
    const headings = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)
    const loar = headings.findIndex((t) => t?.includes("LOAR"))
    const gantsMelecien = headings.findIndex((t) => t?.includes("Les Gants Melecien"))
    expect(loar).toBeGreaterThanOrEqual(0)
    expect(gantsMelecien).toBeGreaterThanOrEqual(0)
    expect(loar).toBeLessThan(gantsMelecien)
  })
})
