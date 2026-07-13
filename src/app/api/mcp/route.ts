import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js"
import { registerMcpServer } from "@/lib/mcp/server"

// Serveur MCP (Model Context Protocol) officiel, transport Streamable HTTP.
// - POST : messages JSON-RPC (initialize, resources/*, tools/*).
// - GET / DELETE : refusés par le transport en mode stateless (spec MCP).
// Le profil JSON « simple » reste disponible sur /api/portfolio/profile.
async function handleMcpRequest(request: Request): Promise<Response> {
  // Stateless : serveur et transport frais à chaque requête, adapté au
  // serverless (aucun état partagé, pas de session ni de Redis).
  const server = new McpServer({ name: "yl-solution-mcp", version: "1.0.0" })
  registerMcpServer(server)

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  })
  await server.connect(transport)
  return transport.handleRequest(request)
}

export { handleMcpRequest as GET, handleMcpRequest as POST, handleMcpRequest as DELETE }
