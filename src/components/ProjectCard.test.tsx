import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { ProjectCard } from "@/components/ProjectCard"
import type { ProjectData } from "@/data/projects"

afterEach(() => {
  cleanup()
})

const mobileProject: ProjectData = {
  id: "loar",
  title: "LOAR",
  description: "Compagnon IA mobile.",
  longDescription: "Compagnon IA mobile spécialisé.",
  techStack: ["React Native"],
  image: "/images/projects/loar/cover.webp",
  screens: [
    "/images/projects/loar/screen-1.webp",
    "/images/projects/loar/screen-2.webp",
    "/images/projects/loar/screen-3.webp",
    "/images/projects/loar/screen-4.webp",
  ],
  featured: true,
  platform: "mobile",
}

const webProject: ProjectData = {
  id: "restobook",
  title: "RestoBook",
  description: "App web.",
  longDescription: "App web de réservation.",
  techStack: ["Next.js"],
  image: "/images/projects/restobook.webp",
}

describe("ProjectCard - mobile mockup", () => {
  it("affiche le PhoneMockup (image d'écran) pour un projet avec screens, même fermé", () => {
    render(<ProjectCard project={mobileProject} isOpen={false} onToggle={() => {}} />)
    const imgs = screen.getAllByRole("img")
    expect(imgs.some((i) => (i.getAttribute("src") ?? "").includes("screen-1.webp"))).toBe(true)
  })

  it("affiche un badge Mobile pour un projet platform mobile", () => {
    render(<ProjectCard project={mobileProject} isOpen={false} onToggle={() => {}} />)
    expect(screen.getByText("Mobile · React Native")).toBeInTheDocument()
  })

  it("n'affiche ni mockup ni badge pour un projet web", () => {
    render(<ProjectCard project={webProject} isOpen={false} onToggle={() => {}} />)
    expect(screen.queryByText(/mobile/i)).not.toBeInTheDocument()
    expect(screen.queryByRole("img")).not.toBeInTheDocument()
  })
})
