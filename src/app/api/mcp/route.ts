import { NextResponse } from "next/server"
import { getProfile, getProjects } from "@/lib/content"
import { services } from "@/data/services"
import { skills } from "@/data/skills"

export async function GET() {
  // content/profile.json est la source unique du profil (plus de duplication).
  const profile = getProfile()
  const projects = getProjects()

  return NextResponse.json(
    {
      name: profile.name,
      title: profile.jobTitle,
      location: profile.location,
      contact: {
        email: profile.email,
        github: profile.links.github,
        linkedin: profile.links.linkedin,
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
