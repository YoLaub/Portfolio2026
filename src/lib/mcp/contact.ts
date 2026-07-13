import { z } from "zod"
import { sendContactEmail, ConfigurationError } from "@/lib/brevo"
import { isRateLimited } from "@/lib/rateLimit"

// Interdit les retours à la ligne (anti-injection d'en-tête email) sur le nom.
const noLineBreaks = /^[^\r\n]*$/

// Schéma d'entrée de l'outil MCP `contact_yoann`, réutilisé par le serveur
// (converti en JSON Schema pour tools/list par le SDK) et par les tests.
export const contactInputShape = {
  name: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(noLineBreaks, "Le nom contient des caractères invalides")
    .describe("Nom de la personne ou de l'organisation à l'origine de la demande"),
  email: z
    .email()
    .max(255)
    .describe("Email de contact auquel Yoann pourra répondre"),
  message: z
    .string()
    .trim()
    .min(10)
    .max(2000)
    .describe("Description du besoin ou du projet (10 caractères minimum)"),
}

export interface ContactToolResult {
  content: { type: "text"; text: string }[]
  isError?: boolean
  // Le SDK MCP attend un CallToolResult ouvert (index signature).
  [key: string]: unknown
}

function text(message: string, isError = false): ContactToolResult {
  return { content: [{ type: "text", text: message }], isError }
}

// Exécute l'outil de contact : rate limiting, envoi email, gestion d'erreur.
// Isolé du transport pour être testable directement.
export async function runContactTool(
  args: { name: string; email: string; message: string },
  clientIp: string
): Promise<ContactToolResult> {
  // Anti-spam : même fenêtre de rate limit que le formulaire de contact.
  if (isRateLimited(clientIp)) {
    return text("Trop de demandes récentes, merci de réessayer plus tard.", true)
  }

  try {
    await sendContactEmail({
      name: args.name,
      email: args.email,
      // On signale que la prise de contact vient d'un agent via le serveur MCP.
      message: `[Prise de contact initiée par un agent via le serveur MCP]\n\n${args.message}`,
    })
    return text(
      "Message transmis à Yoann. Il répondra directement à l'adresse email fournie."
    )
  } catch (error) {
    if (error instanceof ConfigurationError) {
      console.error("[MCP contact] BREVO_API_KEY is not configured")
    } else {
      console.error("[MCP contact]", error)
    }
    return text("L'envoi a échoué côté serveur, réessayez plus tard.", true)
  }
}

// Extrait l'IP client depuis les en-têtes transmis par le transport MCP.
export function ipFromHeaders(
  headers: Record<string, string | string[] | undefined> | undefined
): string {
  if (!headers) return "unknown"
  const pick = (key: string): string | undefined => {
    const value = headers[key]
    return Array.isArray(value) ? value[0] : value
  }
  const forwardedFor = pick("x-forwarded-for")
  if (forwardedFor) return forwardedFor.split(",")[0].trim()
  return pick("x-real-ip") ?? "unknown"
}
