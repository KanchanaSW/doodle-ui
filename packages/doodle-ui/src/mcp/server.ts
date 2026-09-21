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
        "Return an exhaustive catalog of doodleui-react components (name, description, category, Radix flag). Use this when you need the full inventory or are unsure what exists and want to browse by category. Do NOT use this for natural-language discovery of a UI need — use search_components instead.",
      inputSchema: {
        category: z
          .enum(CATEGORIES)
          .optional()
          .describe(
            'Optional category filter. Examples: "form", "overlay", "layout", "navigation", "data-display", "feedback", "chat".',
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
        "Return PER-COMPONENT documentation: prop table, usage example, dependencies, and compound sub-parts for a single doodleui-react component. Use this when you already know the component name and need its props/API. Do NOT use this for cross-cutting library-wide patterns (forms, animation defaults, SSR, controlled/uncontrolled) — use get_conventions instead.",
      inputSchema: {
        name: z
          .string()
          .describe(
            'Component name in kebab-case (preferred) or PascalCase. Examples: "button", "alert-dialog", "input".',
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
        "Return the exact CLI command to add one or more doodleui-react components (npx / pnpm dlx / yarn dlx / bunx doodleui-react add …), plus resolved npm and shared-file dependencies. Use this when you are ready to install components into a project. Do NOT use this for prop docs or usage examples — use get_component_docs instead.",
      inputSchema: {
        components: z
          .array(z.string())
          .min(1)
          .describe(
            'One or more kebab-case component names to install. Examples: ["button"], ["input", "textarea", "button"].',
          ),
        packageManager: z
          .enum(PACKAGE_MANAGERS)
          .optional()
          .describe(
            'Target package manager. Examples: "npm" (default), "pnpm", "yarn", "bun".',
          ),
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
        "Return the CSS custom property reference for doodleui-react (roughness, stroke color, fonts, dark mode). Use this when asked to tweak sketchiness or global colors via CSS variables. Do NOT use this for per-component props like variant or size — use get_component_docs instead.",
      inputSchema: {
        token: z
          .string()
          .optional()
          .describe(
            'Optional token filter. Examples: "roughness", "--doodle-ui-roughness", "stroke-color".',
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
        "Find doodleui-react components from a natural-language description via intent-based fuzzy matching. Use this when translating a UI need into specific component names (e.g. \"confirmation before a destructive action\" → alert-dialog). Do NOT use this when you already know the component name — use get_component_docs instead. Do NOT use this for an exhaustive catalog dump — use list_components instead.",
      inputSchema: {
        query: z
          .string()
          .describe(
            'Natural-language description of the UI need. Examples: "form input fields and a submit action", "confirmation before a destructive action".',
          ),
        limit: z
          .number()
          .int()
          .min(1)
          .max(25)
          .optional()
          .describe("Max results to return (default 8). Example: 5."),
      },
    },
    async ({ query, limit }) => searchComponents(query, limit ?? 8),
  );

  server.registerTool(
    "get_conventions",
    {
      title: "Get conventions",
      description:
        "Return CROSS-CUTTING doodleui-react library conventions not tied to any single component: animate prop defaults, controlled/uncontrolled naming, asChild, compound components, form integration (register vs Controller), SSR/seed rules, and theming. Use this when implementing patterns that span multiple components. Do NOT use this for a single component's prop table — use get_component_docs instead.",
      inputSchema: {
        topic: z
          .enum(CONVENTION_TOPICS)
          .optional()
          .describe(
            'Optional topic filter (default: all). Examples: "forms", "animation", "ssr", "controlled-uncontrolled", "asChild", "compound", "theming", "all".',
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
