import { describe, it, expect, vi, beforeEach } from "vitest"

const mockSendTransacEmail = vi.fn()

vi.mock("@getbrevo/brevo", () => ({
  BrevoClient: class {
    get transactionalEmails() {
      return { sendTransacEmail: mockSendTransacEmail }
    }
  },
}))

import { sendContactEmail, ConfigurationError } from "@/lib/brevo"

describe("sendContactEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.BREVO_API_KEY = "test-api-key"
  })

  it("envoie un email via Brevo SDK avec les bons paramètres", async () => {
    mockSendTransacEmail.mockResolvedValue({ messageId: "123" })

    await sendContactEmail({
      name: "Jean Dupont",
      email: "jean@example.com",
      message: "Bonjour, je suis intéressé.",
    })

    expect(mockSendTransacEmail).toHaveBeenCalledOnce()
    const call = mockSendTransacEmail.mock.calls[0][0]
    expect(call.sender).toEqual({
      email: "contact@yoannlaubert.dev",
      name: "Portfolio Yoann Laubert",
    })
    expect(call.to).toEqual([
      { email: "contact@yoannlaubert.dev", name: "Yoann Laubert" },
    ])
    expect(call.replyTo).toEqual({
      email: "jean@example.com",
      name: "Jean Dupont",
    })
    expect(call.subject).toBe("[Portfolio] Nouveau message de Jean Dupont")
    expect(call.htmlContent).toContain("Jean Dupont")
    expect(call.htmlContent).toContain("jean@example.com")
    expect(call.htmlContent).toContain("Bonjour, je suis intéressé.")
    expect(call.textContent).toContain("Jean Dupont")
    expect(call.textContent).toContain("jean@example.com")
    expect(call.textContent).toContain("Bonjour, je suis intéressé.")
  })

  it("échappe le HTML dans les données utilisateur", async () => {
    mockSendTransacEmail.mockResolvedValue({ messageId: "123" })

    await sendContactEmail({
      name: '<script>alert("xss")</script>',
      email: "test@example.com",
      message: "<b>bold</b> & 'quotes'",
    })

    const call = mockSendTransacEmail.mock.calls[0][0]
    expect(call.htmlContent).not.toContain("<script>")
    expect(call.htmlContent).toContain("&lt;script&gt;")
    expect(call.htmlContent).toContain("&amp;")
    expect(call.htmlContent).toContain("&#039;quotes&#039;")
  })

  it("convertit les sauts de ligne en <br> dans le htmlContent", async () => {
    mockSendTransacEmail.mockResolvedValue({ messageId: "123" })

    await sendContactEmail({
      name: "Test",
      email: "test@example.com",
      message: "Ligne 1\nLigne 2",
    })

    const call = mockSendTransacEmail.mock.calls[0][0]
    expect(call.htmlContent).toContain("Ligne 1<br>Ligne 2")
  })

  it("throw ConfigurationError si BREVO_API_KEY est manquante", async () => {
    delete process.env.BREVO_API_KEY

    await expect(
      sendContactEmail({
        name: "Test",
        email: "test@example.com",
        message: "Hello world test",
      })
    ).rejects.toThrow(ConfigurationError)
  })

  it("propage les erreurs du SDK Brevo", async () => {
    mockSendTransacEmail.mockRejectedValue(new Error("Brevo API error"))

    await expect(
      sendContactEmail({
        name: "Test",
        email: "test@example.com",
        message: "Hello world test",
      })
    ).rejects.toThrow("Brevo API error")
  })
})
