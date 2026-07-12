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

export async function sendBookingEmails(data: {
  name: string
  email: string
  message: string
  slotLabel: string
  meetLink: string | null
}) {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    throw new ConfigurationError("BREVO_API_KEY is not configured")
  }

  const client = new BrevoClient({ apiKey })

  const safeName = escapeHtml(data.name)
  const safeEmail = escapeHtml(data.email)
  const safeMessage = escapeHtml(data.message)
  const safeSlot = escapeHtml(data.slotLabel)
  const meetHtml = data.meetLink
    ? `<p><strong>Lien visio :</strong> <a href="${escapeHtml(data.meetLink)}">${escapeHtml(data.meetLink)}</a></p>`
    : `<p>Le lien visio vous parviendra via l'invitation Google Calendar.</p>`
  const meetText = data.meetLink
    ? `Lien visio : ${data.meetLink}`
    : `Le lien visio vous parviendra via l'invitation Google Calendar.`

  // Confirmation au visiteur
  await client.transactionalEmails.sendTransacEmail({
    sender: { email: "ylsolution.web@gmail.com", name: "Yoann Laubert" },
    to: [{ email: data.email, name: data.name }],
    subject: `Rendez-vous confirmé : ${safeSlot}`,
    htmlContent: `<h2>Votre rendez-vous est confirmé</h2>
      <p>Bonjour ${safeName},</p>
      <p>Notre échange de 30 minutes est confirmé pour le <strong>${safeSlot}</strong> (heure de Paris).</p>
      ${meetHtml}
      <p>Une invitation Google Calendar vous a également été envoyée.</p>
      <p>À très vite,<br>Yoann Laubert</p>`,
    textContent: `Votre rendez-vous est confirmé\n\nBonjour ${data.name},\n\nNotre échange de 30 minutes est confirmé pour le ${data.slotLabel} (heure de Paris).\n${meetText}\n\nUne invitation Google Calendar vous a également été envoyée.\n\nÀ très vite,\nYoann Laubert`,
  })

  // Notification interne
  await client.transactionalEmails.sendTransacEmail({
    sender: { email: "ylsolution.web@gmail.com", name: "Portfolio Yoann Laubert" },
    to: [{ email: "ylsolution.web@gmail.com", name: "Yoann Laubert" }],
    replyTo: { email: data.email, name: data.name },
    subject: `[Portfolio] Nouveau RDV : ${safeName} le ${safeSlot}`,
    htmlContent: `<h2>Nouveau rendez-vous réservé</h2>
      <p><strong>Quand :</strong> ${safeSlot}</p>
      <p><strong>Nom :</strong> ${safeName}</p>
      <p><strong>Email :</strong> ${safeEmail}</p>
      <p><strong>Sujet :</strong> ${safeMessage || "(non précisé)"}</p>
      ${meetHtml}`,
    textContent: `Nouveau rendez-vous réservé\n\nQuand : ${data.slotLabel}\nNom : ${data.name}\nEmail : ${data.email}\nSujet : ${data.message || "(non précisé)"}\n${meetText}`,
  })
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
    sender: { email: "ylsolution.web@gmail.com", name: "Portfolio Yoann Laubert" },
    to: [{ email: "ylsolution.web@gmail.com", name: "Yoann Laubert" }],
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
