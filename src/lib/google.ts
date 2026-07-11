import type { BusyInterval } from "@/lib/booking"

// Client Google Calendar minimal (OAuth refresh token, 3 appels REST).
// Volontairement sans la dépendance googleapis : surface utilisée trop petite.
// Obtenir le refresh token : node scripts/google-auth.mjs (voir .env.example).

const TOKEN_URL = "https://oauth2.googleapis.com/token"
const CALENDAR_API = "https://www.googleapis.com/calendar/v3"

export function isGoogleConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN
  )
}

function calendarId(): string {
  return process.env.GOOGLE_CALENDAR_ID || "primary"
}

async function getAccessToken(): Promise<string> {
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN ?? "",
      grant_type: "refresh_token",
    }),
  })

  if (!response.ok) {
    throw new Error(`Google token refresh failed: ${response.status}`)
  }

  const data = (await response.json()) as { access_token?: string }
  if (!data.access_token) {
    throw new Error("Google token refresh returned no access_token")
  }
  return data.access_token
}

/** Intervalles occupés de l'agenda entre timeMin et timeMax (freeBusy). */
export async function getBusyIntervals(
  timeMin: string,
  timeMax: string
): Promise<BusyInterval[]> {
  const token = await getAccessToken()

  const response = await fetch(`${CALENDAR_API}/freeBusy`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ timeMin, timeMax, items: [{ id: calendarId() }] }),
  })

  if (!response.ok) {
    throw new Error(`Google freeBusy failed: ${response.status}`)
  }

  const data = (await response.json()) as {
    calendars?: Record<string, { busy?: BusyInterval[] }>
  }
  return data.calendars?.[calendarId()]?.busy ?? []
}

/**
 * Crée l'événement dans l'agenda avec le visiteur invité et un lien Meet.
 * sendUpdates=all : Google envoie aussi l'invitation calendrier au visiteur.
 */
export async function createBookingEvent(input: {
  slotStart: string
  slotEnd: string
  name: string
  email: string
  message: string
}): Promise<{ meetLink: string | null }> {
  const token = await getAccessToken()

  const url = `${CALENDAR_API}/calendars/${encodeURIComponent(calendarId())}/events?conferenceDataVersion=1&sendUpdates=all`

  const description = [
    `Rendez-vous découverte réservé depuis le portfolio.`,
    ``,
    `Contact : ${input.name} <${input.email}>`,
    input.message ? `` : null,
    input.message ? `Sujet : ${input.message}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n")

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      summary: `RDV découverte - ${input.name}`,
      description,
      start: { dateTime: input.slotStart },
      end: { dateTime: input.slotEnd },
      attendees: [{ email: input.email, displayName: input.name }],
      conferenceData: {
        createRequest: {
          requestId: crypto.randomUUID(),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      reminders: { useDefault: true },
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => "")
    throw new Error(`Google event creation failed: ${response.status} ${body.slice(0, 300)}`)
  }

  const event = (await response.json()) as {
    hangoutLink?: string
    conferenceData?: {
      entryPoints?: Array<{ entryPointType?: string; uri?: string }>
    }
  }

  const meetLink =
    event.hangoutLink ??
    event.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri ??
    null

  return { meetLink }
}
