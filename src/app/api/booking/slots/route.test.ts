// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

const { mockIsGoogleConfigured, mockGetBusyIntervals } = vi.hoisted(() => ({
  mockIsGoogleConfigured: vi.fn(),
  mockGetBusyIntervals: vi.fn(),
}))

vi.mock("@/lib/google", () => ({
  isGoogleConfigured: () => mockIsGoogleConfigured(),
  getBusyIntervals: (...args: unknown[]) => mockGetBusyIntervals(...args),
}))

import { GET } from "./route"

// Lundi 6 juillet 2026, 10h00 à Paris (été, UTC+2)
const NOW_SUMMER = new Date("2026-07-06T08:00:00Z")

describe("GET /api/booking/slots", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.setSystemTime(NOW_SUMMER)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("Google non configuré → 503 { available: false }", async () => {
    mockIsGoogleConfigured.mockReturnValue(false)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(503)
    expect(data.available).toBe(false)
    expect(mockGetBusyIntervals).not.toHaveBeenCalled()
  })

  it("renvoie les créneaux libres avec Cache-Control no-store", async () => {
    mockIsGoogleConfigured.mockReturnValue(true)
    mockGetBusyIntervals.mockResolvedValue([])

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.available).toBe(true)
    expect(Array.isArray(data.slots)).toBe(true)
    expect(data.slots.length).toBeGreaterThan(0)
    expect(data.slots[0].start).toMatch(/Z$/)
    expect(response.headers.get("Cache-Control")).toContain("no-store")
  })

  it("interroge le freebusy sur l'horizon complet", async () => {
    mockIsGoogleConfigured.mockReturnValue(true)
    mockGetBusyIntervals.mockResolvedValue([])

    await GET()

    const [timeMin, timeMax] = mockGetBusyIntervals.mock.calls[0]
    expect(new Date(timeMin as string).getTime()).toBe(NOW_SUMMER.getTime())
    // 14 jours + marge du dernier créneau
    expect(new Date(timeMax as string).getTime()).toBeGreaterThanOrEqual(
      NOW_SUMMER.getTime() + 14 * 86_400_000
    )
  })

  it("exclut les créneaux occupés renvoyés par Google", async () => {
    mockIsGoogleConfigured.mockReturnValue(true)
    mockGetBusyIntervals.mockResolvedValue([
      { start: "2026-07-07T07:00:00Z", end: "2026-07-07T07:30:00Z" },
    ])

    const response = await GET()
    const data = await response.json()
    const starts = data.slots.map((s: { start: string }) => s.start)

    expect(starts).not.toContain("2026-07-07T07:00:00.000Z")
    expect(starts).toContain("2026-07-07T07:30:00.000Z")
  })

  it("erreur Google → 502 { available: false }", async () => {
    mockIsGoogleConfigured.mockReturnValue(true)
    mockGetBusyIntervals.mockRejectedValue(new Error("Google API down"))

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(502)
    expect(data.available).toBe(false)
  })
})
