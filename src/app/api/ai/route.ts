import { NextResponse } from "next/server"
import { getProfile, getProjects, getSkills, getServices } from "@/lib/content"
import type { SkillData } from "@/lib/content"

function groupSkillsByCategory(skills: SkillData[]): Record<string, string[]> {
  return skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill.name)
    return acc
  }, {} as Record<string, string[]>)
}

function buildMarkdown(
  profile: ReturnType<typeof getProfile>,
  projects: ReturnType<typeof getProjects>,
  skills: ReturnType<typeof getSkills>,
  services: ReturnType<typeof getServices>,
): string {
  const grouped = groupSkillsByCategory(skills)

  const lines: string[] = []

  // Header
  lines.push(`# ${profile.name} — ${profile.jobTitle}`)
  lines.push("")
  lines.push(`> ${profile.bio}`)
  lines.push("")
  lines.push(`**Localisation :** ${profile.location}`)
  lines.push(`**Email :** ${profile.email}`)
  lines.push(`**Site :** ${profile.links.website}`)
  lines.push("")

  // Liens
  lines.push("## Liens")
  lines.push("")
  lines.push(`- [GitHub](${profile.links.github})`)
  lines.push(`- [LinkedIn](${profile.links.linkedin})`)
  lines.push(`- [Calendly](${profile.links.calendly})`)
  lines.push("")

  // Compétences
  lines.push("## Competences")
  lines.push("")
  for (const [category, names] of Object.entries(grouped)) {
    lines.push(`### ${category}`)
    lines.push(`- ${names.join(", ")}`)
    lines.push("")
  }

  // Projets
  lines.push("## Projets")
  lines.push("")
  for (const project of projects) {
    lines.push(`### ${project.title}`)
    lines.push(`**Stack :** ${project.techStack.join(", ")}`)
    if (project.liveUrl) lines.push(`**URL :** ${project.liveUrl}`)
    if (project.githubUrl) lines.push(`**GitHub :** ${project.githubUrl}`)
    lines.push("")
  }

  // Services
  lines.push("## Services")
  lines.push("")
  for (const service of services) {
    lines.push(`- **${service.title}** — ${service.description}`)
  }
  lines.push("")

  // Contact
  lines.push("## Contact")
  lines.push("")
  lines.push(`- Email : ${profile.email}`)
  lines.push(`- Calendly : ${profile.links.calendly}`)
  lines.push(`- API REST : ${profile.links.website}/api/docs`)

  return lines.join("\n")
}

export async function GET() {
  try {
    const profile = getProfile()
    const projects = getProjects()
    const skills = getSkills()
    const services = getServices()

    const markdown = buildMarkdown(profile, projects, skills, services)

    return new NextResponse(markdown, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
      },
    })
  } catch (error) {
    console.error("[API AI]", error)
    return new NextResponse("# Error\n\nInternal server error.", {
      status: 500,
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    })
  }
}
