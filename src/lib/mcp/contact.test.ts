import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockSendContactEmail, ConfigurationError } = vi.hoisted(() => {
  class ConfigurationError extends Error {
    constructor(message: string) {
      super(message)
      this.name = "ConfigurationError"
    }
  }
  return { mockSendContactEmail: vi.fn(), ConfigurationError }
})

vi.mock("@/lib/brevo", () => ({
  sendContactEmail: (...args: unknown[]) => mockSendContactEmail(...args),
  ConfigurationError,
}))

import { runContactTool, ipFromHeaders } from "./contact"

const validArgs = {
  name: "Agent Recruteur",
  email: "agent@example.com",
  message: "Vos compétences Next.js et MCP correspondent à notre besoin.",
}

// IP unique par test pour ne pas partager le compteur de rate limit (module-level).
let ipCounter = 0
function nextIp(): string {
  ipCounter += 1
  return `192.0.2.${ipCounter}`
}

describe("runContactTool", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.BREVO_API_KEY = "test-api-key"
  })

  it("envoie l'email (préfixé MCP) et confirme la transmission", async () => {
    mockSendContactEmail.mockResolvedValue(undefined)

    const result = await runContactTool(validArgs, nextIp())

    expect(result.isError).toBeFalsy()
    expect(result.content[0].type).toBe("text")
    expect(mockSendContactEmail).toHaveBeenCalledOnce()
    const arg = mockSendContactEmail.mock.calls[0][0]
    expect(arg.name).toBe(validArgs.name)
    expect(arg.email).toBe(validArgs.email)
    expect(arg.message).toContain(validArgs.message)
    expect(arg.message.toLowerCase()).toContain("mcp")
  })

  it("renvoie isError et n'envoie rien quand la limite est atteinte", async () => {
    mockSendContactEmail.mockResolvedValue(undefined)
    const ip = "198.51.100.200"

    for (let i = 0; i < 5; i++) {
      const ok = await runContactTool(validArgs, ip)
      expect(ok.isError).toBeFalsy()
    }
    mockSendContactEmail.mockClear()

    const limited = await runContactTool(validArgs, ip)
    expect(limited.isError).toBe(true)
    expect(mockSendContactEmail).not.toHaveBeenCalled()
  })

  it("gère l'absence de configuration email sans planter (isError)", async () => {
    mockSendContactEmail.mockRejectedValue(
      new ConfigurationError("BREVO_API_KEY is not configured")
    )

    const result = await runContactTool(validArgs, nextIp())
    expect(result.isError).toBe(true)
  })

  it("gère une erreur d'envoi générique (isError)", async () => {
    mockSendContactEmail.mockRejectedValue(new Error("Brevo SDK error"))

    const result = await runContactTool(validArgs, nextIp())
    expect(result.isError).toBe(true)
  })
})

describe("ipFromHeaders", () => {
  it("extrait la première IP de x-forwarded-for", () => {
    expect(ipFromHeaders({ "x-forwarded-for": "203.0.113.5, 10.0.0.1" })).toBe("203.0.113.5")
  })

  it("gère un tableau de valeurs et le repli x-real-ip", () => {
    expect(ipFromHeaders({ "x-forwarded-for": ["203.0.113.9"] })).toBe("203.0.113.9")
    expect(ipFromHeaders({ "x-real-ip": "203.0.113.7" })).toBe("203.0.113.7")
  })

  it("renvoie 'unknown' sans en-têtes exploitables", () => {
    expect(ipFromHeaders(undefined)).toBe("unknown")
    expect(ipFromHeaders({})).toBe("unknown")
  })
})
