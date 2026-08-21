import { NextResponse } from "next/server"

const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "API Freelance - Yoann Laubert",
    version: "1.0.0",
    description: "API REST exposant les données du site professionnel.",
  },
  servers: [{ url: "/api" }],
  paths: {
    "/portfolio/profile": {
      get: {
        summary: "Profil complet",
        operationId: "getProfile",
        responses: {
          "200": {
            description: "Profil complet du développeur",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Profile" },
              },
            },
          },
          "500": {
            description: "Erreur serveur",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/portfolio/projects": {
      get: {
        summary: "Liste des projets",
        operationId: "getProjects",
        responses: {
          "200": {
            description: "Tableau de métadonnées projets",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/ProjectMeta" },
                },
              },
            },
          },
          "500": {
            description: "Erreur serveur",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/portfolio/projects/{id}": {
      get: {
        summary: "Détail d'un projet",
        operationId: "getProjectById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Identifiant unique du projet",
          },
        ],
        responses: {
          "200": {
            description: "Projet avec contenu Markdown",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProjectContent" },
              },
            },
          },
          "404": {
            description: "Projet non trouvé",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "Erreur serveur",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/portfolio/skills": {
      get: {
        summary: "Compétences",
        operationId: "getSkills",
        responses: {
          "200": {
            description: "Tableau de compétences",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/SkillData" },
                },
              },
            },
          },
          "500": {
            description: "Erreur serveur",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/ai.md": {
      servers: [{ url: "/" }],
      get: {
        summary: "Profil AI-Friendly en Markdown",
        operationId: "getAiProfile",
        description: "Retourne le profil complet du développeur en Markdown brut, optimisé pour les agents IA",
        responses: {
          "200": {
            description: "Profil complet en Markdown",
            content: {
              "text/markdown": {
                schema: { type: "string" },
                example: "# Yoann Laubert - Développeur freelance\n\n## Compétences\n...",
              },
            },
          },
          "500": {
            description: "Erreur serveur",
            content: {
              "text/markdown": {
                schema: { type: "string" },
              },
            },
          },
        },
      },
    },
    "/portfolio/services": {
      get: {
        summary: "Services",
        operationId: "getServices",
        responses: {
          "200": {
            description: "Tableau de services proposés",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/ServiceData" },
                },
              },
            },
          },
          "500": {
            description: "Erreur serveur",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/portfolio/formation": {
      get: {
        summary: "Modules de formation",
        operationId: "getFormations",
        responses: {
          "200": {
            description: "Tableau de modules de formation aux outils IA",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/FormationData" },
                },
              },
            },
          },
          "500": {
            description: "Erreur serveur",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Profile: {
        type: "object",
        required: ["name", "jobTitle", "location", "bio", "email", "links"],
        properties: {
          name: { type: "string", example: "Yoann Laubert" },
          jobTitle: { type: "string", example: "Développeur Full-Stack" },
          location: { type: "string", example: "France" },
          bio: { type: "string", example: "Développeur passionné par le web moderne." },
          email: { type: "string", example: "ylsolution.web@gmail.com" },
          links: {
            type: "object",
            required: ["github", "linkedin", "website"],
            properties: {
              github: { type: "string" },
              linkedin: { type: "string" },
              website: { type: "string" },
            },
          },
        },
      },
      ProjectMeta: {
        type: "object",
        required: ["id", "title", "techStack", "image"],
        properties: {
          id: { type: "string", example: "mcp-agent" },
          title: { type: "string", example: "MCP Agent Freelance" },
          techStack: { type: "array", items: { type: "string" }, example: ["Next.js", "TypeScript", "Tailwind CSS"] },
          image: { type: "string", example: "/images/projects/mcp-agent.webp" },
          liveUrl: { type: "string", example: "https://yl-solution.fr" },
          githubUrl: { type: "string", example: "https://github.com/YoLaub/Portfolio2026" },
        },
      },
      ProjectContent: {
        allOf: [
          { $ref: "#/components/schemas/ProjectMeta" },
          {
            type: "object",
            required: ["content"],
            properties: {
              content: { type: "string", description: "Contenu Markdown du projet", example: "# MCP Agent Freelance\n\nEndpoint MCP exposant les données du site..." },
            },
          },
        ],
      },
      ServiceData: {
        type: "object",
        required: ["id", "title", "description", "icon"],
        properties: {
          id: { type: "string", example: "web-dev" },
          title: { type: "string", example: "Développement Web" },
          description: { type: "string", example: "Création de sites et applications web modernes" },
          icon: { type: "string", example: "code" },
        },
      },
      SkillData: {
        type: "object",
        required: ["id", "name", "category"],
        properties: {
          id: { type: "string", example: "react" },
          name: { type: "string", example: "React" },
          category: { type: "string", example: "Frontend" },
        },
      },
      FormationData: {
        type: "object",
        required: ["id", "title", "description", "icon"],
        properties: {
          id: { type: "string", example: "decouverte" },
          title: { type: "string", example: "Découverte & prise en main" },
          description: { type: "string", example: "Panorama des outils IA du moment..." },
          icon: { type: "string", example: "graduation-cap" },
        },
      },
      ErrorResponse: {
        type: "object",
        required: ["success", "error"],
        properties: {
          success: { type: "boolean", enum: [false], example: false },
          error: { type: "string", example: "Internal server error" },
        },
      },
    },
  },
}

export async function GET() {
  return NextResponse.json(openApiSpec, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
    },
  })
}
