import { runMcpServer } from "../../mcp/server";

/**
 * Start the doodleui-react MCP server over stdio for AI coding agents.
 * Stdout is reserved for JSON-RPC; diagnostics go to stderr.
 */
export async function mcpCommand(): Promise<void> {
  await runMcpServer();
}
