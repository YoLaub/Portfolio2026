import { describe, it, expect, afterEach, vi } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ProjectShowcaseCard } from "@/components/ProjectShowcaseCard"
import type { ProjectData } from "@/data/projects"

let mockResolvedTheme: string | undefined = "light"
vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: mockResolvedTheme, setTheme: vi.fn() }),
}))

afterEach(() => {
  cleanup()
  mockResolvedTheme = "light"
})

const mobileProject: ProjectData = {
  id: "loar",
  title: "LOAR",
  description: "Compagnon IA mobile.",
  longDescription: "Compagnon IA mobile spécialisé.",
  techStack: ["React Native"],
  image: "/images/projects/loar/cover.webp",
  imageDark: "/images/projects/loar/cover-dark.webp",
  screens: ["/images/projects/loar/screen-1.webp"],
  featured: true,
  platform: "mobile",
  category: "Projet phare",
}

const webProject: ProjectData = {
  id: "queueflow",
  title: "QueueFlow",
  description: "SaaS multi-tenant.",
  longDescription: "SaaS multi-tenant pour fast foods.",
  techStack: ["Next.js", "PostgreSQL"],
  image: "/images/projects/queueflow.webp",
  category: "SaaS multi-tenant",
}

describe("ProjectShowcaseCard - contenu", () => {
  it("affiche le titre et l'etiquette indexee", () => {
    render(<ProjectShowcaseCard project={webProject} index={1} variant="standard" />)
    expect(screen.getByText("QueueFlow")).toBeInTheDocument()
    expect(screen.getByText(/02 · SAAS MULTI-TENANT/i)).toBeInTheDocument()
  })

  it("affiche la couverture avec un alt descriptif", () => {
    render(<ProjectShowcaseCard project={webProject} index={1} variant="standard" />)
    const img = screen.getByAltText("Aperçu de QueueFlow")
    expect(img).toBeInTheDocument()
  })
})

describe("ProjectShowcaseCard - couverture jour/nuit (LOAR)", () => {
  it("affiche la couverture sombre en theme sombre", () => {
    mockResolvedTheme = "dark"
    render(<ProjectShowcaseCard project={mobileProject} index={0} variant="feature" />)
    const img = screen.getByAltText("Aperçu de LOAR")
    expect(img.getAttribute("src") ?? "").toContain("cover-dark.webp")
  })
})

describe("ProjectShowcaseCard - detail en modale", () => {
  it("ouvre la modale avec la description longue au clic", async () => {
    const user = userEvent.setup()
    render(<ProjectShowcaseCard project={webProject} index={1} variant="standard" />)
    await user.click(screen.getByRole("button", { name: /QueueFlow/i }))
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText(webProject.longDescription as string)).toBeInTheDocument()
  })
})
