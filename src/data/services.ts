export interface ServiceData {
  id: string
  title: string
  description: string
  icon: string
}

export const services: ServiceData[] = [
  {
    id: "site-web",
    title: "Création de sites web",
    description:
      "Un site moderne, rapide et optimisé pour Google. Pensé pour vos visiteurs, conçu pour convertir.",
    icon: "globe",
  },
  {
    id: "application",
    title: "Applications sur mesure",
    description:
      "Votre idée transformée en application fonctionnelle. Du tableau de bord à la plateforme complète.",
    icon: "code",
  },
  {
    id: "api",
    title: "Développement d'API",
    description:
      "Des interfaces techniques robustes pour connecter vos systèmes entre eux, en toute sécurité.",
    icon: "server",
  },
  {
    id: "conseil",
    title: "Conseil technique",
    description:
      "Un regard expert sur votre projet. Choix technologiques, architecture et bonnes pratiques.",
    icon: "lightbulb",
  },
  {
    id: "maintenance",
    title: "Maintenance & évolution",
    description:
      "Votre site ou application reste performant et à jour. Corrections, améliorations et nouvelles fonctionnalités.",
    icon: "wrench",
  },
]
