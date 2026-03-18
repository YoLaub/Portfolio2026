import { NavBar } from "@/components/NavBar"

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="pt-20">
        <section id="hero" aria-label="Accueil" className="min-h-screen flex items-center justify-center px-4">
          <h1 className="text-4xl font-bold text-text-primary">
            Portfolio — En construction
          </h1>
        </section>

        <section id="projets" aria-label="Projets" className="min-h-screen flex items-center justify-center px-4">
          <h2 className="text-3xl font-bold text-text-primary">Projets</h2>
        </section>

        <section id="services" aria-label="Services" className="min-h-screen flex items-center justify-center px-4">
          <h2 className="text-3xl font-bold text-text-primary">Services</h2>
        </section>

        <section id="competences" aria-label="Compétences" className="min-h-screen flex items-center justify-center px-4">
          <h2 className="text-3xl font-bold text-text-primary">Compétences</h2>
        </section>

        <section id="mcp" aria-label="MCP" className="min-h-screen flex items-center justify-center px-4">
          <h2 className="text-3xl font-bold text-text-primary">MCP</h2>
        </section>

        <section id="a-propos" aria-label="À propos" className="min-h-screen flex items-center justify-center px-4">
          <h2 className="text-3xl font-bold text-text-primary">À propos</h2>
        </section>

        <section id="contact" aria-label="Contact" className="min-h-screen flex items-center justify-center px-4">
          <h2 className="text-3xl font-bold text-text-primary">Contact</h2>
        </section>
      </main>
    </>
  )
}
