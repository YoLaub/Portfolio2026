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
      "Compagnon IA mobile spécialisé en SMOP, avec onboarding guidé et traitement confidentiel des données.",
    longDescription:
      "Application mobile React Native : compagnon IA spécialisé en SMOP. Onboarding guidé, backend Python, stockage objet MinIO et anonymisation des données personnelles via Presidio pour garantir la confidentialité.",
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
    id: "studio-uml",
    title: "Studio UML",
    description:
      "Studio de conception UML avec serveur MCP intégré, pour concevoir vos diagrammes en binôme avec une IA.",
    longDescription:
      "Outil de modélisation UML (diagrammes de classes, cas d'usage, séquence, MCD) avec un serveur MCP qui expose chaque diagramme à un agent IA : lecture, proposition et modification en temps réel, comme un binôme de conception.",
    techStack: ["Next.js", "TypeScript", "MCP SDK"],
    image: "/images/projects/studio-uml.webp",
  },
  {
    id: "les-gants-melecien",
    title: "Les Gants Melecien",
    description:
      "Site vitrine avec backoffice et gestion des adhésions.",
    longDescription:
      "Site vitrine avec CMS et backoffice sur mesure : gestion des adhésions, des contenus et des membres depuis une interface d'administration dédiée.",
    techStack: ["Next.js", "TypeScript", "PostgreSQL"],
    image: "/images/projects/gants-melecien.webp",
  },
  {
    id: "mcp-agent",
    title: "MCP Agent Portfolio",
    description:
      "Connecteur MCP intégré au portfolio permettant aux agents IA d'interroger les données structurées.",
    longDescription:
      "Endpoint MCP exposant les données du portfolio en JSON structuré : profil, projets, compétences et contact. Conçu pour être consommé par des agents IA et des outils automatisés. Cache intelligent d'une heure, documentation intégrée avec exemple d'appel curl et réponse JSON.",
    techStack: ["Next.js", "TypeScript", "API Routes", "JSON", "MCP"],
    image: "/images/projects/mcp-agent.webp",
    liveUrl: "https://yoann-laubert.dev/api/mcp",
    githubUrl: "https://github.com/yoann-laubert/portfolio",
  },
]
