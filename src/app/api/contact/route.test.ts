import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockSendContactEmail, ConfigurationError } = vi.hoisted(() => {
  class ConfigurationError extends Error {
    constructor(message: string) {
      super(message)
      this.name = "ConfigurationError"
    }
  }
  return {
    mockSendContactEmail: vi.fn(),
    ConfigurationError,
  }
})

vi.mock("@/lib/brevo", () => ({
  sendContactEmail: (...args: unknown[]) => mockSendContactEmail(...args),
  ConfigurationError,
}))

import { POST } from "./route"

// Chaque test utilise une IP distincte par défaut pour ne pas partager le
// même compteur de rate limit (état module-level persistant entre tests).
let ipCounter = 0
function nextTestIp(): string {
  ipCounter += 1
  return `198.51.100.${ipCounter}`
}

function makeRequest(body: unknown, ip: string = nextTestIp()): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  })
}

function makeInvalidJsonRequest(ip: string = nextTestIp()): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: "not-json{{{",
  })
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.BREVO_API_KEY = "test-api-key"
  })

  it("POST valide → appelle sendContactEmail → retourne { success: true }", async () => {
    mockSendContactEmail.mockResolvedValue(undefined)

    const response = await POST(
      makeRequest({
        name: "Jean Dupont",
        email: "jean@example.com",
        message: "Bonjour, je voudrais discuter.",
        website: "",
      })
    )

    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data).toEqual({ success: true })
    expect(mockSendContactEmail).toHaveBeenCalledOnce()
    expect(mockSendContactEmail).toHaveBeenCalledWith({
      name: "Jean Dupont",
      email: "jean@example.com",
      message: "Bonjour, je voudrais discuter.",
    })
  })

  it("honeypot rempli → retourne { success: true } SANS appeler sendContactEmail", async () => {
    const response = await POST(
      makeRequest({
        name: "Bot",
        email: "bot@spam.com",
        message: "Buy cheap stuff",
        website: "http://spam.com",
      })
    )

    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data).toEqual({ success: true })
    expect(mockSendContactEmail).not.toHaveBeenCalled()
  })

  it("body invalide (Zod) → retourne 400 avec détails", async () => {
    const response = await POST(
      makeRequest({
        name: "",
        email: "invalid",
        message: "",
        website: "",
      })
    )

    const data = await response.json()
    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe("Validation failed")
    expect(data.details).toBeDefined()
    expect(Array.isArray(data.details)).toBe(true)
    expect(mockSendContactEmail).not.toHaveBeenCalled()
  })

  it("sendContactEmail throw → retourne 500", async () => {
    mockSendContactEmail.mockRejectedValue(new Error("Brevo SDK error"))

    const response = await POST(
      makeRequest({
        name: "Jean Dupont",
        email: "jean@example.com",
        message: "Un message de test valide.",
        website: "",
      })
    )

    const data = await response.json()
    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toBe("Internal server error")
  })

  it("body JSON invalide → retourne 400", async () => {
    const response = await POST(makeInvalidJsonRequest())

    const data = await response.json()
    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe("Invalid request body")
    expect(mockSendContactEmail).not.toHaveBeenCalled()
  })

  it("dépasse la limite de requêtes pour une même IP → retourne 429", async () => {
    mockSendContactEmail.mockResolvedValue(undefined)
    const ip = "203.0.113.42"
    const validBody = {
      name: "Jean Dupont",
      email: "jean@example.com",
      message: "Bonjour, je voudrais discuter.",
      website: "",
    }

    for (let i = 0; i < 5; i++) {
      const ok = await POST(makeRequest(validBody, ip))
      expect(ok.status).toBe(200)
    }

    const limited = await POST(makeRequest(validBody, ip))
    const data = await limited.json()
    expect(limited.status).toBe(429)
    expect(data.success).toBe(false)
  })

  it("BREVO_API_KEY manquante → retourne 500 avec message explicite", async () => {
    mockSendContactEmail.mockRejectedValue(
      new ConfigurationError("BREVO_API_KEY is not configured")
    )

    const response = await POST(
      makeRequest({
        name: "Jean Dupont",
        email: "jean@example.com",
        message: "Un message de test valide.",
        website: "",
      })
    )

    const data = await response.json()
    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toBe("Server configuration error")
  })
})
