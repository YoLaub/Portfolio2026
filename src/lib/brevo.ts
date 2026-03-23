import { BrevoClient } from "@getbrevo/brevo"

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ConfigurationError"
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export async function sendContactEmail(data: {
  name: string
  email: string
  message: string
}) {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    throw new ConfigurationError("BREVO_API_KEY is not configured")
  }

  const client = new BrevoClient({ apiKey })

  const safeName = escapeHtml(data.name)
  const safeEmail = escapeHtml(data.email)
  const safeMessage = escapeHtml(data.message)

  await client.transactionalEmails.sendTransacEmail({
    sender: { email: "contact@yoannlaubert.dev", name: "Portfolio Yoann Laubert" },
    to: [{ email: "contact@yoannlaubert.dev", name: "Yoann Laubert" }],
    replyTo: { email: data.email, name: data.name },
    subject: `[Portfolio] Nouveau message de ${safeName}`,
    htmlContent: `<h2>Nouveau message depuis le portfolio</h2>
      <p><strong>Nom :</strong> ${safeName}</p>
      <p><strong>Email :</strong> ${safeEmail}</p>
      <p><strong>Message :</strong></p>
      <p>${safeMessage.replace(/\n/g, "<br>")}</p>`,
    textContent: `Nouveau message depuis le portfolio\n\nNom : ${data.name}\nEmail : ${data.email}\n\nMessage :\n${data.message}`,
  })
}
