export interface ProjectData {
  id: string
  title: string
  description: string
  longDescription: string
  techStack: string[]
  image: string
  liveUrl?: string
  githubUrl?: string
  screens?: string[]
  featured?: boolean
  platform?: "mobile" | "web"
}

export const projects: ProjectData[] = [
  {
    id: "loar",
    title: "LOAR",
    description:
      "Application mobile qui accompagne au quotidien les personnes atteintes du syndrome métabolique ovarien polyendocrinien (SMOP), avec une prise en main guidée et des données de santé traitées en toute confidentialité.",
    longDescription:
      "Application mobile : un compagnon IA qui accompagne au quotidien les personnes atteintes du syndrome métabolique ovarien polyendocrinien (SMOP). L'utilisatrice est guidée pas à pas dès la première utilisation, et toutes ses données de santé sont anonymisées pour garantir une confidentialité totale.",
    techStack: ["Python", "React Native", "MinIO", "Presidio"],
    image: "/images/projects/loar/cover.webp",
    screens: [
      "/images/projects/loar/screen-1.webp",
      "/images/projects/loar/screen-2.webp",
      "/images/projects/loar/screen-3.webp",
      "/images/projects/loar/screen-4.webp",
    ],
    featured: true,
    platform: "mobile",
  },
  {
    id: "les-gants-melecien",
    title: "Les Gants Melecien",
    description:
      "Site vitrine avec backoffice et gestion des adhésions.",
    longDescription:
      "Site vitrine avec un espace d'administration sur mesure pour gérer les adhésions, le contenu du site et les membres, sans avoir besoin de toucher au code.",
    techStack: ["Next.js", "TypeScript", "PostgreSQL"],
    image: "/images/projects/gants-melecien.webp",
  },
  {
    id: "mcp-agent",
    title: "MCP Agent Portfolio",
    description:
      "Une passerelle qui permet à des agents IA d'interroger directement les informations de ce portfolio.",
    longDescription:
      "Ce portfolio met à disposition ses propres informations (profil, projets, compétences, contact) dans un format que les agents IA peuvent lire et utiliser directement, avec une documentation claire et des exemples prêts à l'emploi.",
    techStack: ["Next.js", "TypeScript", "API Routes", "JSON", "MCP"],
    image: "/images/projects/mcp-agent.webp",
    liveUrl: "https://yoann-laubert.dev/api/mcp",
    githubUrl: "https://github.com/yoann-laubert/portfolio",
  },
]
