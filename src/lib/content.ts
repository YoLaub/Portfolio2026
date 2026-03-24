import fs from "fs"
import path from "path"
import matter from "gray-matter"

const CONTENT_DIR = path.join(process.cwd(), "content")
const PROJECTS_DIR = path.join(CONTENT_DIR, "projects")

export interface Profile {
  name: string
  jobTitle: string
  location: string
  bio: string
  email: string
  links: {
    github: string
    linkedin: string
    website: string
    calendly: string
  }
}

export interface ProjectMeta {
  id: string
  title: string
  techStack: string[]
  image: string
  liveUrl?: string
  githubUrl?: string
}

export interface ProjectContent extends ProjectMeta {
  content: string
}

export function getProfile(): Profile {
  const filePath = path.join(CONTENT_DIR, "profile.json")
  const raw = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(raw) as Profile
}

export function getServices(): { id: string; title: string; description: string; icon: string }[] {
  const filePath = path.join(CONTENT_DIR, "services.json")
  const raw = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(raw)
}

export function getSkills(): { id: string; name: string; category: string }[] {
  const filePath = path.join(CONTENT_DIR, "skills.json")
  const raw = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(raw)
}

export function getProjects(): ProjectMeta[] {
  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".md"))

  return files.map((file) => {
    const filePath = path.join(PROJECTS_DIR, file)
    const raw = fs.readFileSync(filePath, "utf-8")
    const { data } = matter(raw)

    return {
      id: data.id,
      title: data.title,
      techStack: data.techStack,
      image: data.image,
      ...(data.liveUrl && { liveUrl: data.liveUrl }),
      ...(data.githubUrl && { githubUrl: data.githubUrl }),
    } as ProjectMeta
  })
}

export function getProjectById(id: string): ProjectContent | null {
  const filePath = path.join(PROJECTS_DIR, `${id}.md`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const raw = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(raw)

  return {
    id: data.id,
    title: data.title,
    techStack: data.techStack,
    image: data.image,
    ...(data.liveUrl && { liveUrl: data.liveUrl }),
    ...(data.githubUrl && { githubUrl: data.githubUrl }),
    content: content.trim(),
  } as ProjectContent
}
