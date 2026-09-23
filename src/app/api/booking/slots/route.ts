import { NextResponse } from "next/server"
import { generateSlots, BOOKING_CONFIG } from "@/lib/booking"
import { isGoogleConfigured, getBusyIntervals } from "@/lib/google"

const DAY_MS = 86_400_000

// Les disponibilités doivent être fraîches : jamais de cache.
const NO_STORE = { "Cache-Control": "no-store" }

export async function GET() {
  if (!isGoogleConfigured()) {
    return NextResponse.json(
      { available: false, slots: [] },
      { status: 503, headers: NO_STORE }
    )
  }

  try {
    const now = new Date()
    const timeMin = now.toISOString()
    // Horizon + 1 jour de marge pour couvrir la fin du dernier créneau.
    const timeMax = new Date(
      now.getTime() + (BOOKING_CONFIG.horizonDays + 1) * DAY_MS
    ).toISOString()

    const busy = await getBusyIntervals(timeMin, timeMax)
    const slots = generateSlots(busy, now)
    // Capacité théorique (aucun créneau occupé) : sert de référence pour
    // jauger le remplissage de l'agenda côté UI (pastille du Hero).
    const capacity = generateSlots([], now).length

    return NextResponse.json(
      { available: true, slots, capacity },
      { headers: NO_STORE }
    )
  } catch (error) {
    console.error("[API Booking Slots]", error)
    return NextResponse.json(
      { available: false, slots: [] },
      { status: 502, headers: NO_STORE }
    )
  }
}
