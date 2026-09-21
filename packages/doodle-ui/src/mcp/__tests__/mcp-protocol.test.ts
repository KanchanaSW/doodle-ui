/** @vitest-environment node */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { REGISTRY_DATA } from "../../registry/data";
import { createMcpServer } from "../server";

const EXPECTED_TOOLS = [
  "list_components",
  "get_component_docs",
  "get_installation_command",
  "get_theming_reference",
  "search_components",
  "get_conventions",
] as const;

describe("MCP protocol integration", () => {
  let client: Client;
  let closeServer: () => Promise<void>;

  beforeEach(async () => {
    const server = createMcpServer();
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await server.connect(serverTransport);
    closeServer = () => server.close();

    client = new Client({ name: "test-client", version: "0.0.0" });
    await client.connect(clientTransport);
  });

  afterEach(async () => {
    await client.close();
    await closeServer();
  });

  it("exposes server version matching the bundled registry", () => {
    const info = client.getServerVersion();
    expect(info?.name).toBe("doodleui-react");
    expect(info?.version).toBe(REGISTRY_DATA.version);
  });

  it("lists all six tools", async () => {
    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name).sort();
    expect(names).toEqual([...EXPECTED_TOOLS].sort());
  });

  it("includes Use this when / Do NOT use disambiguation in every tool description", async () => {
    const { tools } = await client.listTools();
    for (const tool of tools) {
      expect(tool.description, tool.name).toMatch(/Use this when/i);
      expect(tool.description, tool.name).toMatch(/Do NOT use/i);
    }
  });

  it("calls list_components over the protocol", async () => {
    const result = await client.callTool({
      name: "list_components",
      arguments: {},
    });
    expect(result.isError).not.toBe(true);
    const text = (result.content as Array<{ type: string; text: string }>)[0]
      .text;
    const data = JSON.parse(text) as {
      ok: boolean;
      count: number;
      registrySchemaVersion: string;
    };
    expect(data.ok).toBe(true);
    expect(data.count).toBeGreaterThanOrEqual(55);
    expect(data.registrySchemaVersion).toBe("1.0.0");
  });

  it("calls get_component_docs for card", async () => {
    const result = await client.callTool({
      name: "get_component_docs",
      arguments: { name: "card" },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0]
      .text;
    const data = JSON.parse(text) as {
      ok: boolean;
      name: string;
      subparts: string[];
    };
    expect(data.ok).toBe(true);
    expect(data.name).toBe("card");
    expect(data.subparts).toContain("Header");
  });

  it("returns structured app-level error (not protocol isError) for unknown component", async () => {
    const result = await client.callTool({
      name: "get_component_docs",
      arguments: { name: "buton" },
    });
    expect(result.isError).not.toBe(true);
    const text = (result.content as Array<{ type: string; text: string }>)[0]
      .text;
    const data = JSON.parse(text) as {
      ok: boolean;
      error: { code: string };
      suggestions: string[];
    };
    expect(data.ok).toBe(false);
    expect(data.error.code).toBe("UNKNOWN_COMPONENT");
    expect(data.suggestions).toContain("button");
  });

  it("calls get_installation_command", async () => {
    const result = await client.callTool({
      name: "get_installation_command",
      arguments: {
        components: ["button", "input"],
        packageManager: "pnpm",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0]
      .text;
    const data = JSON.parse(text) as { command: string; ok: boolean };
    expect(data.ok).toBe(true);
    expect(data.command).toBe("pnpm dlx doodleui-react add button input");
  });

  it("calls get_theming_reference", async () => {
    const result = await client.callTool({
      name: "get_theming_reference",
      arguments: {},
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0]
      .text;
    expect(text).toContain("--doodle-ui-roughness");
  });

  it("calls search_components", async () => {
    const result = await client.callTool({
      name: "search_components",
      arguments: { query: "destructive confirmation prompt" },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0]
      .text;
    const data = JSON.parse(text) as {
      results: Array<{ name: string }>;
    };
    expect(data.results[0]?.name).toBe("alert-dialog");
  });

  it("calls get_conventions", async () => {
    const result = await client.callTool({
      name: "get_conventions",
      arguments: { topic: "animation" },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0]
      .text;
    expect(text).toMatch(/animate/i);
  });
});
