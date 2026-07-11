// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

const {
  mockIsGoogleConfigured,
  mockGetBusyIntervals,
  mockCreateBookingEvent,
  mockSendBookingEmails,
} = vi.hoisted(() => ({
  mockIsGoogleConfigured: vi.fn(),
  mockGetBusyIntervals: vi.fn(),
  mockCreateBookingEvent: vi.fn(),
  mockSendBookingEmails: vi.fn(),
}))

vi.mock("@/lib/google", () => ({
  isGoogleConfigured: () => mockIsGoogleConfigured(),
  getBusyIntervals: (...args: unknown[]) => mockGetBusyIntervals(...args),
  createBookingEvent: (...args: unknown[]) => mockCreateBookingEvent(...args),
}))

vi.mock("@/lib/brevo", () => ({
  sendBookingEmails: (...args: unknown[]) => mockSendBookingEmails(...args),
}))

import { POST } from "./route"

// Lundi 6 juillet 2026, 10h00 à Paris (été, UTC+2)
const NOW_SUMMER = new Date("2026-07-06T08:00:00Z")
// Mardi 7 juillet, 9h00 à Paris : créneau valide de la grille
const VALID_SLOT = "2026-07-07T07:00:00.000Z"

// IP distincte par test pour ne pas partager le compteur de rate limit
let ipCounter = 0
function nextTestIp(): string {
  ipCounter += 1
  return `198.51.101.${ipCounter}`
}

function makeRequest(body: unknown, ip: string = nextTestIp()): Request {
  return new Request("http://localhost/api/booking", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  })
}

const validBody = {
  name: "Jean Dupont",
  email: "jean@example.com",
  message: "Projet de site vitrine",
  slotStart: VALID_SLOT,
  website: "",
}

describe("POST /api/booking", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.setSystemTime(NOW_SUMMER)
    mockIsGoogleConfigured.mockReturnValue(true)
    mockGetBusyIntervals.mockResolvedValue([])
    mockCreateBookingEvent.mockResolvedValue({ meetLink: "https://meet.google.com/abc-defg-hij" })
    mockSendBookingEmails.mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("réservation valide → crée l'événement, envoie les emails, renvoie le lien Meet", async () => {
    const response = await POST(makeRequest(validBody))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.meetLink).toBe("https://meet.google.com/abc-defg-hij")
    expect(data.slotLabel).toContain("juillet")

    expect(mockCreateBookingEvent).toHaveBeenCalledOnce()
    expect(mockCreateBookingEvent).toHaveBeenCalledWith({
      slotStart: VALID_SLOT,
      slotEnd: "2026-07-07T07:30:00.000Z",
      name: "Jean Dupont",
      email: "jean@example.com",
      message: "Projet de site vitrine",
    })
    expect(mockSendBookingEmails).toHaveBeenCalledOnce()
  })

  it("honeypot rempli → 200 silencieux sans aucun appel", async () => {
    const response = await POST(makeRequest({ ...validBody, website: "spam" }))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(mockCreateBookingEvent).not.toHaveBeenCalled()
    expect(mockSendBookingEmails).not.toHaveBeenCalled()
  })

  it("body invalide (Zod) → 400 avec détails", async () => {
    const response = await POST(makeRequest({ ...validBody, email: "pas-un-email" }))
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(Array.isArray(data.details)).toBe(true)
    expect(mockCreateBookingEvent).not.toHaveBeenCalled()
  })

  it("JSON invalide → 400", async () => {
    const response = await POST(makeRequest("not-json{{{"))
    expect(response.status).toBe(400)
  })

  it("créneau déjà occupé → 409 sans créer d'événement", async () => {
    mockGetBusyIntervals.mockResolvedValue([
      { start: "2026-07-07T07:00:00Z", end: "2026-07-07T07:30:00Z" },
    ])

    const response = await POST(makeRequest(validBody))
    const data = await response.json()

    expect(response.status).toBe(409)
    expect(data.success).toBe(false)
    expect(data.error).toBe("slot_unavailable")
    expect(mockCreateBookingEvent).not.toHaveBeenCalled()
  })

  it("créneau hors grille (9h15) → 409", async () => {
    const response = await POST(
      makeRequest({ ...validBody, slotStart: "2026-07-07T07:15:00.000Z" })
    )

    expect(response.status).toBe(409)
    expect(mockCreateBookingEvent).not.toHaveBeenCalled()
  })

  it("Google non configuré → 503", async () => {
    mockIsGoogleConfigured.mockReturnValue(false)

    const response = await POST(makeRequest(validBody))

    expect(response.status).toBe(503)
    expect(mockCreateBookingEvent).not.toHaveBeenCalled()
  })

  it("createBookingEvent échoue → 500", async () => {
    mockCreateBookingEvent.mockRejectedValue(new Error("Google API error"))

    const response = await POST(makeRequest(validBody))
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
  })

  it("échec email Brevo → 200 quand même (le RDV est déjà dans l'agenda)", async () => {
    mockSendBookingEmails.mockRejectedValue(new Error("Brevo down"))

    const response = await POST(makeRequest(validBody))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it("dépasse la limite de requêtes pour une même IP → 429", async () => {
    const ip = "203.0.114.42"

    for (let i = 0; i < 5; i++) {
      const ok = await POST(makeRequest(validBody, ip))
      expect(ok.status).toBe(200)
    }

    const limited = await POST(makeRequest(validBody, ip))
    expect(limited.status).toBe(429)
  })
})
