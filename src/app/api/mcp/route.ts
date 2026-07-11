import { NextResponse } from "next/server"
import { getProjects } from "@/lib/content"
import { services } from "@/data/services"
import { skills } from "@/data/skills"

export async function GET() {
  const projects = getProjects()

  return NextResponse.json(
    {
      name: "Yoann Laubert",
      title: "Développeur freelance - coder pour gagner du temps",
      location: "Vannes, Bretagne",
      contact: {
        email: "contact@yoannlaubert.dev",
        github: "https://github.com/yoannlaubert",
        linkedin: "https://linkedin.com/in/yoannlaubert",
      },
      projects,
      services,
      skills,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  )
}
