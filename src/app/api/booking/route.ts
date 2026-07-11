import { NextResponse } from "next/server"
import { z } from "zod"
import { bookingSchema, isBookableSlot, formatSlotParis, BOOKING_CONFIG } from "@/lib/booking"
import { isGoogleConfigured, getBusyIntervals, createBookingEvent } from "@/lib/google"
import { sendBookingEmails } from "@/lib/brevo"
import { isRateLimited, getClientIp } from "@/lib/rateLimit"

const MINUTE_MS = 60_000

export async function POST(request: Request) {
  try {
    // Clé préfixée : compteur indépendant de celui du formulaire de contact.
    if (isRateLimited(`booking:${getClientIp(request)}`)) {
      return NextResponse.json(
        { success: false, error: "Too many requests" },
        { status: 429 }
      )
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      )
    }

    // Honeypot : accepter silencieusement (même stratégie que /api/contact)
    if (
      typeof body === "object" &&
      body !== null &&
      "website" in body &&
      (body as Record<string, unknown>).website
    ) {
      return NextResponse.json({ success: true })
    }

    const data = bookingSchema.parse(body)

    if (!isGoogleConfigured()) {
      return NextResponse.json(
        { success: false, error: "Booking unavailable" },
        { status: 503 }
      )
    }

    const slotStartMs = new Date(data.slotStart).getTime()
    const slotEnd = new Date(
      slotStartMs + BOOKING_CONFIG.slotMinutes * MINUTE_MS
    ).toISOString()

    // Re-vérification côté serveur : le créneau doit appartenir à la grille
    // ET être encore libre dans l'agenda (anti-course entre deux visiteurs).
    const busy = await getBusyIntervals(data.slotStart, slotEnd)
    if (!isBookableSlot(data.slotStart, busy)) {
      return NextResponse.json(
        { success: false, error: "slot_unavailable" },
        { status: 409 }
      )
    }

    const { meetLink } = await createBookingEvent({
      slotStart: data.slotStart,
      slotEnd,
      name: data.name,
      email: data.email,
      message: data.message,
    })

    const slotLabel = formatSlotParis(data.slotStart)

    // Le RDV existe déjà dans l'agenda (+ invitation Google) : un échec
    // d'email de confirmation ne doit pas faire échouer la réservation.
    try {
      await sendBookingEmails({
        name: data.name,
        email: data.email,
        message: data.message,
        slotLabel,
        meetLink,
      })
    } catch (emailError) {
      console.error("[API Booking] Confirmation email failed", emailError)
    }

    return NextResponse.json({ success: true, meetLink, slotLabel })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }
    console.error("[API Booking]", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
