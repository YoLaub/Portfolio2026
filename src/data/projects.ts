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
    id: "restobook",
    title: "RestoBook",
    description:
      "Application de réservation en ligne pour restaurants, avec gestion des créneaux et notifications.",
    longDescription:
      "Plateforme complète permettant aux restaurateurs de gérer leurs réservations en temps réel. Interface client intuitive pour réserver en 3 clics, tableau de bord restaurateur avec vue planning, gestion des créneaux horaires et notifications automatiques par email. Système de confirmation et rappels intégrés.",
    techStack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
    image: "/images/projects/restobook.webp",
    liveUrl: "https://restobook.example.com",
    githubUrl: "https://github.com/yoann-laubert/restobook",
  },
  {
    id: "fintrack",
    title: "FinTrack",
    description:
      "Tableau de bord de suivi financier personnel avec visualisations interactives et catégorisation automatique.",
    longDescription:
      "Application web de gestion de finances personnelles. Import automatique des transactions bancaires, catégorisation intelligente des dépenses, graphiques interactifs d'évolution budgétaire et alertes de dépassement. API REST sécurisée avec authentification JWT.",
    techStack: ["Java", "Spring Boot", "React", "TypeScript", "Chart.js"],
    image: "/images/projects/fintrack.webp",
    githubUrl: "https://github.com/yoann-laubert/fintrack",
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
