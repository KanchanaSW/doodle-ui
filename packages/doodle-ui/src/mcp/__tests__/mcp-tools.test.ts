/** @vitest-environment node */
import { describe, expect, it } from "vitest";
import {
  buildAddCommand,
  getComponentDocs,
  getConventions,
  getInstallationCommand,
  getThemingReference,
  listComponents,
  REGISTRY_DATA,
  searchComponents,
} from "../tools";

function parseContent(result: { content: Array<{ type: string; text: string }> }) {
  const text = result.content[0]?.text ?? "";
  return JSON.parse(text) as Record<string, unknown>;
}

describe("list_components", () => {
  it("returns all registry components with category and Radix metadata", () => {
    const result = listComponents();
    const data = parseContent(result);
    expect(data.count).toBe(Object.keys(REGISTRY_DATA.components).length);
    expect(data.count).toBeGreaterThanOrEqual(55);

    const components = data.components as Array<Record<string, unknown>>;
    expect(components.length).toBe(data.count);

    for (const comp of components) {
      expect(comp).toHaveProperty("name");
      expect(comp).toHaveProperty("displayName");
      expect(comp).toHaveProperty("description");
      expect(comp).toHaveProperty("category");
      expect(comp).toHaveProperty("isRadix");
      expect(comp).toHaveProperty("radixPrimitive");
    }
  });

  it("filters by category", () => {
    const result = listComponents("form");
    const data = parseContent(result);
    const components = data.components as Array<{ category: string; name: string }>;
    expect(components.length).toBeGreaterThan(0);
    expect(components.every((c) => c.category === "form")).toBe(true);
    expect(components.some((c) => c.name === "button")).toBe(true);
  });
});

describe("get_component_docs", () => {
  it("returns props and example for Button", () => {
    const result = getComponentDocs("button");
    expect(result).not.toHaveProperty("isError");
    const data = parseContent(result);
    expect(data.name).toBe("button");
    expect(data.displayName).toBe("Button");
    const props = data.props as Array<{ name: string }>;
    expect(props.some((p) => p.name === "variant")).toBe(true);
    expect(props.some((p) => p.name === "asChild")).toBe(true);
    expect(String(data.example).length).toBeGreaterThan(0);
  });

  it("returns compound sub-parts for Card", () => {
    const result = getComponentDocs("card");
    const data = parseContent(result);
    const subparts = data.subparts as string[];
    expect(subparts).toEqual(
      expect.arrayContaining(["Header", "Title", "Content", "Footer"]),
    );
  });

  it("returns Dialog docs with sub-parts", () => {
    const result = getComponentDocs("Dialog");
    const data = parseContent(result);
    expect(data.name).toBe("dialog");
    const subparts = data.subparts as string[];
    expect(subparts).toEqual(
      expect.arrayContaining(["Trigger", "Content", "Header", "Title"]),
    );
  });

  it("errors on unknown component", () => {
    const result = getComponentDocs("not-a-real-component");
    expect(result).toHaveProperty("isError", true);
    expect(result.content[0].text).toMatch(/Unknown component/);
  });
});

describe("get_installation_command", () => {
  it("returns npx command by default", () => {
    const result = getInstallationCommand(["button", "card"]);
    const data = parseContent(result);
    expect(data.command).toBe("npx doodleui-react add button card");
    expect(data.packageManager).toBe("npm");
  });

  it("matches package-manager-specific launchers", () => {
    expect(buildAddCommand(["button"], "npm")).toBe(
      "npx doodleui-react add button",
    );
    expect(buildAddCommand(["button"], "pnpm")).toBe(
      "pnpm dlx doodleui-react add button",
    );
    expect(buildAddCommand(["button"], "yarn")).toBe(
      "yarn dlx doodleui-react add button",
    );
    expect(buildAddCommand(["button"], "bun")).toBe(
      "bunx doodleui-react add button",
    );
  });

  it("resolves transitive component deps", () => {
    const result = getInstallationCommand(["combobox"], "pnpm");
    const data = parseContent(result);
    expect(String(data.command)).toContain("pnpm dlx doodleui-react add");
    const comps = data.components as Array<{ name: string }>;
    expect(comps.map((c) => c.name)).toEqual(
      expect.arrayContaining(["combobox"]),
    );
  });

  it("errors on missing components", () => {
    const result = getInstallationCommand(["nope-xyz"]);
    expect(result).toHaveProperty("isError", true);
  });
});

describe("get_theming_reference", () => {
  it("returns full CSS variable reference", () => {
    const result = getThemingReference();
    const data = parseContent(result);
    const variables = data.variables as Array<{ name: string }>;
    expect(variables.some((v) => v.name === "--doodle-ui-roughness")).toBe(
      true,
    );
    expect(data.precedence).toBeDefined();
    expect(data.darkMode).toBeDefined();
  });

  it("filters by token name", () => {
    const result = getThemingReference("roughness");
    const data = parseContent(result);
    const variable = data.variable as { name: string };
    expect(variable.name).toBe("--doodle-ui-roughness");
  });
});

describe("search_components", () => {
  it("ranks alert-dialog for destructive confirmation queries", () => {
    const result = searchComponents(
      "something for showing a confirmation before a destructive action",
    );
    const data = parseContent(result);
    const results = data.results as Array<{ name: string; score: number }>;
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toBe("alert-dialog");
  });

  it("finds input for login field queries", () => {
    const result = searchComponents("text field for email login");
    const data = parseContent(result);
    const results = data.results as Array<{ name: string }>;
    expect(results.some((r) => r.name === "input")).toBe(true);
  });
});

describe("get_conventions", () => {
  it("returns all topics by default", () => {
    const result = getConventions();
    const data = parseContent(result);
    const topics = data.topics as Record<string, unknown>;
    expect(topics.animation).toBeDefined();
    expect(topics.forms).toBeDefined();
    expect(topics["controlled-uncontrolled"]).toBeDefined();
    expect(topics.asChild).toBeDefined();
    expect(topics.compound).toBeDefined();
    expect(topics.ssr).toBeDefined();
    expect(topics.theming).toBeDefined();
  });

  it("filters by topic", () => {
    const result = getConventions("forms");
    const data = parseContent(result);
    const topic = data.topic as { title: string };
    expect(topic.title).toMatch(/Form/i);
  });
});
