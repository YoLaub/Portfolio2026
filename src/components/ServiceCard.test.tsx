import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { ServiceCard } from "@/components/ServiceCard"
import type { ServiceData } from "@/data/services"

afterEach(() => {
  cleanup()
})

describe("ServiceCard", () => {
  it("affiche le titre et la description du service", () => {
    const service: ServiceData = {
      id: "site-web",
      title: "Création de sites web",
      description: "Un site moderne.",
      icon: "globe",
    }

    render(<ServiceCard service={service} />)

    expect(screen.getByText("Création de sites web")).toBeInTheDocument()
    expect(screen.getByText("Un site moderne.")).toBeInTheDocument()
  })

  it("affiche le tarif quand il est fourni", () => {
    const service: ServiceData = {
      id: "site-web",
      title: "Création de sites web",
      description: "Un site moderne.",
      icon: "globe",
      price: "À partir de 500 €",
    }

    render(<ServiceCard service={service} />)

    expect(screen.getByText("À partir de 500 €")).toBeInTheDocument()
  })

  it("n'affiche pas de zone tarif quand price est absent", () => {
    const service: ServiceData = {
      id: "conseil",
      title: "Conseil technique",
      description: "Un regard expert.",
      icon: "lightbulb",
    }

    render(<ServiceCard service={service} />)

    expect(screen.queryByTestId("service-price")).toBeNull()
  })
})
