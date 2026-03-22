import { NextResponse } from "next/server"
import { projects } from "@/data/projects"
import { services } from "@/data/services"
import { skills } from "@/data/skills"

export async function GET() {
  return NextResponse.json(
    {
      name: "Yoann Laubert",
      title: "Développeur Full-Stack React & Java",
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
