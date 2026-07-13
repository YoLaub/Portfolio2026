import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockSendContactEmail } = vi.hoisted(() => ({
  mockSendContactEmail: vi.fn(),
}))

vi.mock("@/lib/brevo", () => ({
  sendContactEmail: (...args: unknown[]) => mockSendContactEmail(...args),
  ConfigurationError: class extends Error {},
}))

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js"
import { registerMcpServer } from "./server"
import { services } from "@/data/services"

// Monte un vrai serveur MCP relié à un client via le transport in-memory du
// SDK : on exerce le protocole (initialize, tools, resources) sans HTTP.
async function connectClient() {
  const server = new McpServer({ name: "yl-solution-mcp", version: "1.0.0" })
  registerMcpServer(server)

  const client = new Client({ name: "test-client", version: "1.0.0" })
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
  await Promise.all([
    server.connect(serverTransport),
    client.connect(clientTransport),
  ])
  return { client }
}

describe("serveur MCP (protocole via transport in-memory)", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.BREVO_API_KEY = "test-api-key"
  })

  it("tools/list expose contact_yoann avec name/email/message requis", async () => {
    const { client } = await connectClient()

    const { tools } = await client.listTools()
    const contact = tools.find((t) => t.name === "contact_yoann")

    expect(contact).toBeDefined()
    expect(contact!.inputSchema.required).toEqual(
      expect.arrayContaining(["name", "email", "message"])
    )
  })

  it("tools/call contact_yoann valide → envoie l'email et confirme", async () => {
    mockSendContactEmail.mockResolvedValue(undefined)
    const { client } = await connectClient()

    const result = await client.callTool({
      name: "contact_yoann",
      arguments: {
        name: "Agent Recruteur",
        email: "agent@example.com",
        message: "Vos compétences correspondent à notre besoin de projet.",
      },
    })

    expect(result.isError).toBeFalsy()
    expect(mockSendContactEmail).toHaveBeenCalledOnce()
  })

  it("tools/call avec arguments invalides → isError, sans envoi", async () => {
    const { client } = await connectClient()

    // Le SDK valide l'inputSchema et renvoie un résultat d'erreur d'outil.
    const result = await client.callTool({
      name: "contact_yoann",
      arguments: { name: "x", email: "pas-un-email", message: "court" },
    })

    expect(result.isError).toBe(true)
    expect(mockSendContactEmail).not.toHaveBeenCalled()
  })

  it("resources/list expose profil, services, skills et projets", async () => {
    const { client } = await connectClient()

    const { resources } = await client.listResources()
    const uris = resources.map((r) => r.uri)

    expect(uris).toEqual(
      expect.arrayContaining([
        "yl://profile",
        "yl://services",
        "yl://skills",
        "yl://projects",
      ])
    )
  })

  it("resources/read yl://services renvoie les services en JSON", async () => {
    const { client } = await connectClient()

    const res = await client.readResource({ uri: "yl://services" })
    const parsed = JSON.parse((res.contents[0] as { text: string }).text)

    expect(parsed).toEqual(services)
  })
})
