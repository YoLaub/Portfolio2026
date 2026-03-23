import { NextResponse } from "next/server"
import { z } from "zod"
import { contactSchema } from "@/lib/schemas"

export async function POST(request: Request) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      )
    }

    // Honeypot check — silently accept if filled (don't tip off bots)
    if (
      typeof body === "object" &&
      body !== null &&
      "website" in body &&
      (body as Record<string, unknown>).website
    ) {
      return NextResponse.json({ success: true })
    }

    const data = contactSchema.parse(body)

    // TODO Story 3.5 : intégration Brevo
    console.log("[API Contact] Stub — email non envoyé (Story 3.5)", data)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }
    console.error("[API Contact]", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
