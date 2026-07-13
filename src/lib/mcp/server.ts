import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { getProfile, getProjects } from "@/lib/content"
import { services } from "@/data/services"
import { skills } from "@/data/skills"
import { contactInputShape, runContactTool, ipFromHeaders } from "@/lib/mcp/contact"

function jsonResource(uri: string, data: unknown) {
  return {
    contents: [
      { uri, mimeType: "application/json", text: JSON.stringify(data, null, 2) },
    ],
  }
}

// Enregistre resources et tools sur un McpServer. Partagé entre la route
// (transport Streamable HTTP) et les tests (transport in-memory du SDK).
export function registerMcpServer(server: McpServer): void {
  // ─── Resources : de quoi évaluer le profil avant de contacter ────────
  server.registerResource(
    "profile",
    "yl://profile",
    {
      title: "Profil de Yoann Laubert",
      description: "Identité, localisation et coordonnées du développeur",
      mimeType: "application/json",
    },
    async (uri) => {
      const profile = getProfile()
      return jsonResource(uri.href, {
        name: profile.name,
        title: profile.jobTitle,
        location: profile.location,
        contact: {
          email: profile.email,
          github: profile.links.github,
          linkedin: profile.links.linkedin,
        },
      })
    }
  )

  server.registerResource(
    "services",
    "yl://services",
    {
      title: "Services et tarifs",
      description: "Prestations proposées avec indication tarifaire",
      mimeType: "application/json",
    },
    async (uri) => jsonResource(uri.href, services)
  )

  server.registerResource(
    "skills",
    "yl://skills",
    {
      title: "Compétences",
      description: "Compétences techniques regroupées par catégorie",
      mimeType: "application/json",
    },
    async (uri) => jsonResource(uri.href, skills)
  )

  server.registerResource(
    "projects",
    "yl://projects",
    {
      title: "Projets",
      description: "Réalisations et études de cas",
      mimeType: "application/json",
    },
    async (uri) => jsonResource(uri.href, getProjects())
  )

  // ─── Tool : contacter Yoann après évaluation des compétences ─────────
  server.registerTool(
    "contact_yoann",
    {
      title: "Contacter Yoann",
      description:
        "Transmettre un message à Yoann Laubert (développeur freelance à Vannes) " +
        "pour proposer une mise en relation au sujet d'un projet, après avoir " +
        "consulté ses compétences et services. L'analyse du besoin est gratuite.",
      inputSchema: contactInputShape,
      annotations: {
        title: "Contacter Yoann",
        readOnlyHint: false,
        openWorldHint: true,
      },
    },
    async (args, extra) => {
      const ip = ipFromHeaders(
        extra?.requestInfo?.headers as
          | Record<string, string | string[] | undefined>
          | undefined
      )
      return runContactTool(args, ip)
    }
  )
}
