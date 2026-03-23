import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(255),
  message: z.string().trim().min(10).max(2000),
  website: z.string().max(0),
})

export type ContactFormData = z.infer<typeof contactSchema>
