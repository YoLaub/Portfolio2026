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
  }
}

export interface ProjectMeta {
  id: string
  title: string
  description?: string
  longDescription?: string
  techStack: string[]
  image: string
  liveUrl?: string
  githubUrl?: string
  screens?: string[]
  featured?: boolean
  platform?: "mobile" | "web"
  /** false = accessible via l'API / URL directe mais masqué de la grille d'accueil. */
  listed?: boolean
  /** Rang d'affichage manuel parmi les projets non "featured" (croissant, défaut = ordre alphabétique du fichier). */
  order?: number
}

export interface ProjectContent extends ProjectMeta {
  content: string
}

export interface ServiceData {
  id: string
  title: string
  description: string
  icon: string
  price?: string
}

export interface SkillData {
  id: string
  name: string
  category: string
}

export interface ApproachItem {
  id: string
  tag: string
  title: string
  body: string
}

export function getProfile(): Profile {
  const filePath = path.join(CONTENT_DIR, "profile.json")
  const raw = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(raw) as Profile
}

export function getServices(): ServiceData[] {
  const filePath = path.join(CONTENT_DIR, "services.json")
  const raw = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(raw) as ServiceData[]
}

export function getSkills(): SkillData[] {
  const filePath = path.join(CONTENT_DIR, "skills.json")
  const raw = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(raw) as SkillData[]
}

export function getApproach(): ApproachItem[] {
  const filePath = path.join(CONTENT_DIR, "approach.json")
  const raw = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(raw) as ApproachItem[]
}

function parseProjectMeta(data: Record<string, unknown>): ProjectMeta {
  const meta: ProjectMeta = {
    id: data.id as string,
    title: data.title as string,
    techStack: data.techStack as string[],
    image: data.image as string,
  }
  if (data.description) meta.description = data.description as string
  if (data.longDescription) meta.longDescription = data.longDescription as string
  if (data.liveUrl) meta.liveUrl = data.liveUrl as string
  if (data.githubUrl) meta.githubUrl = data.githubUrl as string
  if (data.screens) meta.screens = data.screens as string[]
  if (typeof data.featured === "boolean") meta.featured = data.featured
  if (data.platform) meta.platform = data.platform as "mobile" | "web"
  if (typeof data.listed === "boolean") meta.listed = data.listed
  if (typeof data.order === "number") meta.order = data.order
  return meta
}

export function getProjects(): ProjectMeta[] {
  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".md")).sort()

  return files.map((file) => {
    const filePath = path.join(PROJECTS_DIR, file)
    const raw = fs.readFileSync(filePath, "utf-8")
    const { data } = matter(raw)
    return parseProjectMeta(data)
  })
}

export function getProjectById(id: string): ProjectContent | null {
  const filePath = path.resolve(PROJECTS_DIR, `${id}.md`)

  if (!filePath.startsWith(PROJECTS_DIR)) {
    return null
  }

  if (!fs.existsSync(filePath)) {
    return null
  }

  const raw = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(raw)

  return {
    ...parseProjectMeta(data),
    content: content.trim(),
  }
}
