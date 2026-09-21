import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { REGISTRY_DATA } from "../registry/data";
import {
  getComponentDocs,
  getConventions,
  getInstallationCommand,
  getThemingReference,
  listComponents,
  searchComponents,
  type ConventionTopic,
  type PackageManager,
} from "./tools";

const CATEGORIES = [
  "form",
  "overlay",
  "layout",
  "navigation",
  "data-display",
  "feedback",
  "chat",
] as const;

const PACKAGE_MANAGERS = ["npm", "pnpm", "yarn", "bun"] as const;

const CONVENTION_TOPICS = [
  "animation",
  "forms",
  "controlled-uncontrolled",
  "asChild",
  "compound",
  "ssr",
  "theming",
  "all",
] as const;

/** Create a configured McpServer with all doodleui-react tools registered. */
export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "doodleui-react",
    version: REGISTRY_DATA.version,
  });

  server.registerTool(
    "list_components",
    {
      title: "List components",
      description:
        "List all doodleui-react components with name, description, category, and whether each is built on a Radix primitive. Optionally filter by category.",
      inputSchema: {
        category: z
          .enum(CATEGORIES)
          .optional()
          .describe(
            "Optional category filter: form, overlay, layout, navigation, data-display, feedback, chat",
          ),
      },
    },
    async ({ category }) => listComponents(category),
  );

  server.registerTool(
    "get_component_docs",
    {
      title: "Get component docs",
      description:
        "Return the full prop table, usage example, dependencies, and compound sub-parts for a doodleui-react component (e.g. card, button, alert-dialog).",
      inputSchema: {
        name: z
          .string()
          .describe(
            "Component name in kebab-case or PascalCase (e.g. \"button\", \"AlertDialog\", \"alert-dialog\")",
          ),
      },
    },
    async ({ name }) => getComponentDocs(name),
  );

  server.registerTool(
    "get_installation_command",
    {
      title: "Get installation command",
      description:
        "Return the exact CLI command to add one or more doodleui-react components to a project (npx/pnpm dlx/yarn dlx/bunx doodleui-react add …), plus resolved npm and shared-file dependencies.",
      inputSchema: {
        components: z
          .array(z.string())
          .min(1)
          .describe("One or more component names to install"),
        packageManager: z
          .enum(PACKAGE_MANAGERS)
          .optional()
          .describe("Target package manager (default: npm)"),
      },
    },
    async ({ components, packageManager }) =>
      getInstallationCommand(
        components,
        (packageManager ?? "npm") as PackageManager,
      ),
  );

  server.registerTool(
    "get_theming_reference",
    {
      title: "Get theming reference",
      description:
        "Return the full CSS custom property reference for doodleui-react (roughness, stroke color, fonts, dark mode). Use this instead of inventing prop names when asked to tweak sketchiness or colors.",
      inputSchema: {
        token: z
          .string()
          .optional()
          .describe(
            "Optional token filter, e.g. \"roughness\" or \"--doodle-ui-roughness\"",
          ),
      },
    },
    async ({ token }) => getThemingReference(token),
  );

  server.registerTool(
    "search_components",
    {
      title: "Search components",
      description:
        "Find doodleui-react components from a natural-language description (e.g. \"confirmation before a destructive action\" → alert-dialog). Returns ranked matches.",
      inputSchema: {
        query: z
          .string()
          .describe("Natural-language description of the UI need"),
        limit: z
          .number()
          .int()
          .min(1)
          .max(25)
          .optional()
          .describe("Max results to return (default 8)"),
      },
    },
    async ({ query, limit }) => searchComponents(query, limit ?? 8),
  );

  server.registerTool(
    "get_conventions",
    {
      title: "Get conventions",
      description:
        "Return doodleui-react cross-cutting conventions: animate prop defaults, controlled/uncontrolled naming, asChild, compound components, form integration (register vs Controller), SSR/seed rules, and theming.",
      inputSchema: {
        topic: z
          .enum(CONVENTION_TOPICS)
          .optional()
          .describe(
            "Optional topic filter (default: all). One of: animation, forms, controlled-uncontrolled, asChild, compound, ssr, theming, all",
          ),
      },
    },
    async ({ topic }) =>
      getConventions((topic ?? "all") as ConventionTopic),
  );

  return server;
}

/**
 * Start the MCP server over stdio.
 * Never write to stdout except JSON-RPC — use stderr for diagnostics.
 */
export async function runMcpServer(): Promise<void> {
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Keep process alive; transport owns stdin/stdout lifecycle.
  process.stderr.write(
    `doodleui-react MCP server v${REGISTRY_DATA.version} listening on stdio\n`,
  );
}
