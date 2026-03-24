import { NavBar } from "@/components/NavBar"
import { Hero } from "@/components/Hero"
import { ProjectsSection } from "@/components/ProjectsSection"
import { ServicesSection } from "@/components/ServicesSection"
import { SkillsSection } from "@/components/SkillsSection"
import { MCPSection } from "@/components/MCPSection"
import { ContactSection } from "@/components/ContactSection"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="pt-20">
        <Hero />

        <ProjectsSection />

        <ServicesSection />

        <SkillsSection />

        <MCPSection />

        <section id="a-propos" aria-label="À propos" className="min-h-screen flex items-center justify-center px-4">
          <h2 className="text-3xl font-bold text-text-primary">À propos</h2>
        </section>

        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
