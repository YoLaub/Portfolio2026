import { NavBar } from "@/components/NavBar"
import { Hero } from "@/components/Hero"
import { ApproachSection } from "@/components/ApproachSection"
import { ProjectsSection } from "@/components/ProjectsSection"
import { ServicesSection } from "@/components/ServicesSection"
import { SkillsSection } from "@/components/SkillsSection"
import { MCPSection } from "@/components/MCPSection"
import { ContactSection } from "@/components/ContactSection"
import { Footer } from "@/components/Footer"
import { ChatAgent } from "@/components/ChatAgent"
import { getProjects } from "@/lib/content"

export default function Home() {
  // content/projects/*.md est la source unique ; on masque de la grille
  // d'accueil les projets marqués listed: false (accessibles via l'API / URL directe).
  const projects = getProjects().filter((p) => p.listed !== false)

  return (
    <>
      <NavBar />
      <main id="main-content" className="pt-20">
        <Hero />

        <ApproachSection />

        <ProjectsSection projects={projects} />

        <ServicesSection />

        <SkillsSection />

        <MCPSection />

        <ContactSection />
      </main>
      <Footer />
      <ChatAgent />
    </>
  )
}
