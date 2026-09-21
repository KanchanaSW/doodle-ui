/** @vitest-environment node */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { REGISTRY_DATA } from "../../registry/data";
import { REGISTRY_SCHEMA_VERSION } from "../tools";
import { createMcpServer } from "../server";

/**
 * End-to-end multi-step orchestration for a sketchy contact form.
 * Mirrors the transcript in apps/docs/app/docs/mcp/page.mdx.
 */
describe("MCP multi-step orchestration (sketchy contact form)", () => {
  let client: Client;
  let closeServer: () => Promise<void>;

  beforeEach(async () => {
    const server = createMcpServer();
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await server.connect(serverTransport);
    closeServer = () => server.close();

    client = new Client({ name: "orchestration-test", version: "0.0.0" });
    await client.connect(clientTransport);
  });

  afterEach(async () => {
    await client.close();
    await closeServer();
  });

  function parseToolResult(result: {
    content: unknown;
    isError?: boolean;
  }): Record<string, unknown> {
    expect(result.isError).not.toBe(true);
    const text = (result.content as Array<{ type: string; text: string }>)[0]
      .text;
    return JSON.parse(text) as Record<string, unknown>;
  }

  it("searches, loads docs, and builds install command for a contact form", async () => {
    // Step 1: discover candidates from a natural-language need
    const searchResult = await client.callTool({
      name: "search_components",
      arguments: { query: "form input fields and a submit action", limit: 10 },
    });
    const search = parseToolResult(searchResult);
    expect(search.ok).toBe(true);
    expect(search.version).toBe(REGISTRY_DATA.version);
    expect(search.registrySchemaVersion).toBe(REGISTRY_SCHEMA_VERSION);
    const searchNames = (
      search.results as Array<{ name: string }>
    ).map((r) => r.name);
    expect(searchNames).toEqual(expect.arrayContaining(["input", "button"]));

    // Step 2: load per-component docs (input + textarea message + button submit)
    const needed = ["input", "textarea", "button"] as const;
    const docsByName: Record<string, Record<string, unknown>> = {};

    for (const name of needed) {
      const docsResult = await client.callTool({
        name: "get_component_docs",
        arguments: { name },
      });
      const docs = parseToolResult(docsResult);
      expect(docs.ok).toBe(true);
      expect(docs.name).toBe(name);
      expect(docs.registrySchemaVersion).toBe(REGISTRY_SCHEMA_VERSION);
      expect(Array.isArray(docs.props)).toBe(true);
      expect((docs.props as unknown[]).length).toBeGreaterThan(0);
      expect(String(docs.example).length).toBeGreaterThan(0);
      docsByName[name] = docs;
    }

    expect(docsByName.input.displayName).toBe("Input");
    expect(docsByName.textarea.displayName).toBe("Textarea");
    expect(docsByName.button.displayName).toBe("Button");

    // Step 3: resolve install command for the chosen set
    const installResult = await client.callTool({
      name: "get_installation_command",
      arguments: {
        components: ["input", "textarea", "button"],
        packageManager: "pnpm",
      },
    });
    const install = parseToolResult(installResult);
    expect(install.ok).toBe(true);
    expect(install.command).toBe(
      "pnpm dlx doodleui-react add input textarea button",
    );
    expect(install.packageManager).toBe("pnpm");
    const installed = (install.components as Array<{ name: string }>).map(
      (c) => c.name,
    );
    expect(installed).toEqual(
      expect.arrayContaining(["input", "textarea", "button"]),
    );
  });
});
