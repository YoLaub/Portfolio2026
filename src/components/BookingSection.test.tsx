import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, cleanup, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BookingSection } from "@/components/BookingSection"

// Mardi 7 et mercredi 8 juillet 2026 (été, Paris = UTC+2)
const SLOTS = [
  { start: "2026-07-07T07:00:00.000Z", end: "2026-07-07T07:30:00.000Z" }, // mar 09:00
  { start: "2026-07-07T07:30:00.000Z", end: "2026-07-07T08:00:00.000Z" }, // mar 09:30
  { start: "2026-07-08T12:00:00.000Z", end: "2026-07-08T12:30:00.000Z" }, // mer 14:00
]

const mockFetch = vi.fn()

function slotsResponse(slots = SLOTS) {
  return {
    ok: true,
    status: 200,
    json: async () => ({ available: true, slots }),
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal("fetch", mockFetch)
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe("BookingSection", () => {
  it("charge puis affiche les jours et les créneaux (heure de Paris)", async () => {
    mockFetch.mockResolvedValue(slotsResponse())

    render(<BookingSection />)

    expect(screen.getByText(/chargement/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getAllByTestId("booking-day")).toHaveLength(2)
    })
    // Premier jour sélectionné par défaut : ses créneaux sont visibles
    expect(screen.getByRole("button", { name: "09:00" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "09:30" })).toBeInTheDocument()
  })

  it("changer de jour affiche les créneaux de ce jour", async () => {
    mockFetch.mockResolvedValue(slotsResponse())
    const user = userEvent.setup()

    render(<BookingSection />)
    await waitFor(() => {
      expect(screen.getAllByTestId("booking-day")).toHaveLength(2)
    })

    await user.click(screen.getAllByTestId("booking-day")[1])

    expect(screen.getByRole("button", { name: "14:00" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "09:00" })).not.toBeInTheDocument()
  })

  it("service indisponible (503) → message de repli vers l'assistant", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({ available: false, slots: [] }),
    })

    render(<BookingSection />)

    await waitFor(() => {
      expect(screen.getByText(/momentanément indisponible/i)).toBeInTheDocument()
    })
    expect(screen.queryByTestId("booking-day")).not.toBeInTheDocument()
  })

  it("erreur réseau → message d'erreur + bouton réessayer qui recharge", async () => {
    mockFetch.mockRejectedValueOnce(new Error("network"))
    const user = userEvent.setup()

    render(<BookingSection />)

    const retry = await screen.findByRole("button", { name: /réessayer/i })

    mockFetch.mockResolvedValue(slotsResponse())
    await user.click(retry)

    await waitFor(() => {
      expect(screen.getAllByTestId("booking-day")).toHaveLength(2)
    })
  })

  it("sélectionner un créneau ouvre le mini-formulaire", async () => {
    mockFetch.mockResolvedValue(slotsResponse())
    const user = userEvent.setup()

    render(<BookingSection />)
    await screen.findAllByTestId("booking-day")

    await user.click(screen.getByRole("button", { name: "09:00" }))

    expect(screen.getByLabelText(/nom/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /confirmer/i })).toBeInTheDocument()
  })

  it("soumission valide → POST correct puis écran de confirmation avec lien visio", async () => {
    mockFetch.mockResolvedValue(slotsResponse())
    const user = userEvent.setup()

    render(<BookingSection />)
    await screen.findAllByTestId("booking-day")
    await user.click(screen.getByRole("button", { name: "09:00" }))

    await user.type(screen.getByLabelText(/nom/i), "Jean Dupont")
    await user.type(screen.getByLabelText(/email/i), "jean@example.com")

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        meetLink: "https://meet.google.com/abc-defg-hij",
        slotLabel: "mardi 7 juillet 2026 à 09:00",
      }),
    })

    await user.click(screen.getByRole("button", { name: /confirmer/i }))

    await waitFor(() => {
      expect(screen.getByText(/rendez-vous confirmé/i)).toBeInTheDocument()
    })

    const postCall = mockFetch.mock.calls.find(([, init]) => (init as RequestInit)?.method === "POST")
    expect(postCall).toBeDefined()
    const payload = JSON.parse((postCall![1] as RequestInit).body as string)
    expect(payload).toMatchObject({
      name: "Jean Dupont",
      email: "jean@example.com",
      slotStart: "2026-07-07T07:00:00.000Z",
      website: "",
    })

    const meetAnchor = screen.getByRole("link", { name: /meet.google.com/i })
    expect(meetAnchor).toHaveAttribute("href", "https://meet.google.com/abc-defg-hij")
  })

  it("email invalide → erreur de validation, aucun POST", async () => {
    mockFetch.mockResolvedValue(slotsResponse())
    const user = userEvent.setup()

    render(<BookingSection />)
    await screen.findAllByTestId("booking-day")
    await user.click(screen.getByRole("button", { name: "09:00" }))

    await user.type(screen.getByLabelText(/nom/i), "Jean Dupont")
    await user.type(screen.getByLabelText(/email/i), "pas-un-email")
    await user.click(screen.getByRole("button", { name: /confirmer/i }))

    expect(await screen.findByText(/email/i, { selector: "p" })).toBeInTheDocument()
    const postCall = mockFetch.mock.calls.find(([, init]) => (init as RequestInit)?.method === "POST")
    expect(postCall).toBeUndefined()
  })

  it("créneau pris entre-temps (409) → message + rechargement des créneaux", async () => {
    mockFetch.mockResolvedValue(slotsResponse())
    const user = userEvent.setup()

    render(<BookingSection />)
    await screen.findAllByTestId("booking-day")
    await user.click(screen.getByRole("button", { name: "09:00" }))
    await user.type(screen.getByLabelText(/nom/i), "Jean Dupont")
    await user.type(screen.getByLabelText(/email/i), "jean@example.com")

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({ success: false, error: "slot_unavailable" }),
    })

    await user.click(screen.getByRole("button", { name: /confirmer/i }))

    await waitFor(() => {
      expect(screen.getByText(/vient d'être réservé/i)).toBeInTheDocument()
    })
    // Les créneaux ont été rechargés (GET appelé au moins deux fois)
    const getCalls = mockFetch.mock.calls.filter(
      ([, init]) => !(init as RequestInit)?.method || (init as RequestInit).method === "GET"
    )
    expect(getCalls.length).toBeGreaterThanOrEqual(2)
  })
})
