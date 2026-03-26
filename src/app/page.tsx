import { NavBar } from "@/components/NavBar"
import { Hero } from "@/components/Hero"
import { ProjectsSection } from "@/components/ProjectsSection"
import { ServicesSection } from "@/components/ServicesSection"
import { SkillsSection } from "@/components/SkillsSection"
import { MCPSection } from "@/components/MCPSection"
import { ContactSection } from "@/components/ContactSection"
import { Footer } from "@/components/Footer"
import { ChatAgent } from "@/components/ChatAgent"

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

        <ContactSection />
      </main>
      <Footer />
      <ChatAgent />
    </>
  )
}
