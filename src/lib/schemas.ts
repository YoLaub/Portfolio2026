import { z } from "zod"

// Interdit les retours à la ligne dans les champs réutilisés comme en-têtes d'email
// (subject, replyTo) pour empêcher toute injection d'en-tête SMTP.
const noLineBreaks = /^[^\r\n]*$/

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100).regex(noLineBreaks, "Le nom contient des caractères invalides"),
  email: z.email().max(255).regex(noLineBreaks, "L'email contient des caractères invalides"),
  message: z.string().trim().min(10).max(2000),
  website: z.string().max(0),
})

export type ContactFormData = z.infer<typeof contactSchema>
