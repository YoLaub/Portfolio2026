import { z } from "zod"

// Logique pure de génération de créneaux de rendez-vous.
// Consommée par les routes /api/booking/* (et par rien d'autre : source unique).

export interface BusyInterval {
  start: string
  end: string
}

export interface Slot {
  start: string
  end: string
}

export const BOOKING_CONFIG = {
  timeZone: "Europe/Paris",
  slotMinutes: 30,
  horizonDays: 14,
  noticeHours: 12,
  // Plages locales réservables (lun-ven), pause déjeuner exclue.
  windows: [
    { startHour: 9, endHour: 12 },
    { startHour: 14, endHour: 18 },
  ],
} as const

const MINUTE_MS = 60_000
const HOUR_MS = 3_600_000
const DAY_MS = 86_400_000

// Décalage (minutes à l'est d'UTC) du fuseau cible à un instant donné.
// Technique Intl standard : reconstruire l'heure locale et la comparer à l'instant UTC.
function tzOffsetMinutes(date: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
  const parts: Record<string, string> = {}
  for (const part of dtf.formatToParts(date)) {
    parts[part.type] = part.value
  }
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  )
  return (asUtc - date.getTime()) / MINUTE_MS
}

// Convertit une heure civile du fuseau cible en instant UTC.
// Double itération pour rester correct autour des bascules DST.
function zonedTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string
): Date {
  const naive = Date.UTC(year, month - 1, day, hour, minute)
  let utc = naive
  for (let i = 0; i < 2; i++) {
    utc = naive - tzOffsetMinutes(new Date(utc), timeZone) * MINUTE_MS
  }
  return new Date(utc)
}

// Date civile (année, mois, jour) d'un instant dans le fuseau cible.
function civilDateInZone(date: Date, timeZone: string) {
  const dtf = new Intl.DateTimeFormat("fr-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
  const [year, month, day] = dtf.format(date).split("-").map(Number)
  return { year, month, day }
}

function isWeekend(year: number, month: number, day: number): boolean {
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay()
  return weekday === 0 || weekday === 6
}

function overlapsBusy(startMs: number, endMs: number, busy: BusyInterval[]): boolean {
  return busy.some(
    (b) => startMs < new Date(b.end).getTime() && endMs > new Date(b.start).getTime()
  )
}

/**
 * Génère les créneaux réservables : 30 min, lun-ven 9h-12h / 14h-18h heure de
 * Paris, entre now + préavis et now + horizon, hors intervalles occupés.
 */
export function generateSlots(busy: BusyInterval[], now: Date = new Date()): Slot[] {
  const { timeZone, slotMinutes, horizonDays, noticeHours, windows } = BOOKING_CONFIG
  const minStartMs = now.getTime() + noticeHours * HOUR_MS
  const maxStartMs = now.getTime() + horizonDays * DAY_MS

  const slots: Slot[] = []

  for (let dayOffset = 0; dayOffset <= horizonDays; dayOffset++) {
    const reference = new Date(now.getTime() + dayOffset * DAY_MS)
    const { year, month, day } = civilDateInZone(reference, timeZone)

    if (isWeekend(year, month, day)) continue

    for (const window of windows) {
      for (
        let minutes = window.startHour * 60;
        minutes + slotMinutes <= window.endHour * 60;
        minutes += slotMinutes
      ) {
        const start = zonedTimeToUtc(
          year,
          month,
          day,
          Math.floor(minutes / 60),
          minutes % 60,
          timeZone
        )
        const startMs = start.getTime()
        const endMs = startMs + slotMinutes * MINUTE_MS

        if (startMs < minStartMs || startMs > maxStartMs) continue
        if (overlapsBusy(startMs, endMs, busy)) continue

        slots.push({
          start: start.toISOString(),
          end: new Date(endMs).toISOString(),
        })
      }
    }
  }

  return slots
}

/** Vérifie qu'un créneau demandé appartient bien à la grille libre (anti-triche / anti-course). */
export function isBookableSlot(
  slotStart: string,
  busy: BusyInterval[],
  now: Date = new Date()
): boolean {
  const requested = new Date(slotStart).getTime()
  if (Number.isNaN(requested)) return false
  return generateSlots(busy, now).some((s) => new Date(s.start).getTime() === requested)
}

// Mêmes protections anti-injection d'en-têtes email que contactSchema.
const noLineBreaks = /^[^\r\n]*$/

export const bookingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100)
    .regex(noLineBreaks, "Le nom contient des caractères invalides"),
  email: z
    .email("Adresse email invalide")
    .max(255)
    .regex(noLineBreaks, "L'email contient des caractères invalides"),
  message: z.string().trim().max(1000).optional().default(""),
  slotStart: z.iso.datetime(),
  website: z.string().max(0),
})

export type BookingFormData = z.infer<typeof bookingSchema>

/** Libellé français du créneau, heure de Paris (emails, écran de confirmation). */
export function formatSlotParis(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: BOOKING_CONFIG.timeZone,
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(iso))
}
