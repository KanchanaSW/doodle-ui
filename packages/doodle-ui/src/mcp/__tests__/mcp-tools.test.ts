/** @vitest-environment node */
import { describe, expect, it } from "vitest";
import {
  buildAddCommand,
  findSuggestions,
  getComponentDocs,
  getConventions,
  getInstallationCommand,
  getThemingReference,
  levenshteinDistance,
  listComponents,
  REGISTRY_DATA,
  REGISTRY_SCHEMA_VERSION,
  searchComponents,
  structuredErrorResult,
} from "../tools";

function parseContent(result: { content: Array<{ type: string; text: string }> }) {
  const text = result.content[0]?.text ?? "";
  return JSON.parse(text) as Record<string, unknown>;
}

describe("levenshteinDistance", () => {
  it("returns 0 for identical strings", () => {
    expect(levenshteinDistance("button", "button")).toBe(0);
  });

  it("returns 1 for a single character deletion", () => {
    expect(levenshteinDistance("buton", "button")).toBe(1);
  });

  it("returns the edit distance for unrelated strings", () => {
    expect(levenshteinDistance("abc", "xyz")).toBe(3);
  });
});

describe("findSuggestions", () => {
  it("suggests button for typo buton", () => {
    expect(findSuggestions("buton", ["button", "badge", "card"])).toEqual([
      "button",
    ]);
  });

  it("suggests alert-dialog and dialog for alertdialog", () => {
    expect(
      findSuggestions("alertdialog", ["alert-dialog", "dialog", "drawer"]),
    ).toEqual(["alert-dialog", "dialog"]);
  });

  it("returns empty array when nothing is close enough", () => {
    expect(findSuggestions("zzzzzzz", ["button", "card"])).toEqual([]);
  });
});

describe("structuredErrorResult", () => {
  it("returns ok:false JSON without isError flag", () => {
    const result = structuredErrorResult("UNKNOWN_COMPONENT", "Unknown", {
      suggestions: ["button"],
    });
    expect(result).not.toHaveProperty("isError");
    const data = parseContent(result);
    expect(data).toEqual({
      ok: false,
      error: { code: "UNKNOWN_COMPONENT", message: "Unknown" },
      suggestions: ["button"],
    });
  });
});

describe("list_components", () => {
  it("returns all registry components with category and Radix metadata", () => {
    const result = listComponents();
    const data = parseContent(result);
    expect(data.ok).toBe(true);
    expect(data.version).toBe(REGISTRY_DATA.version);
    expect(data.registrySchemaVersion).toBe(REGISTRY_SCHEMA_VERSION);
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
    expect(data.ok).toBe(true);
    expect(data.registrySchemaVersion).toBe(REGISTRY_SCHEMA_VERSION);
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

  it("returns structured error with suggestions for typo", () => {
    const result = getComponentDocs("buton");
    expect(result).not.toHaveProperty("isError");
    const data = parseContent(result);
    expect(data.ok).toBe(false);
    const error = data.error as { code: string; message: string };
    expect(error.code).toBe("UNKNOWN_COMPONENT");
    expect(error.message).toMatch(/buton/);
    expect(data.suggestions).toEqual(expect.arrayContaining(["button"]));
  });

  it("returns structured error for unknown component", () => {
    const result = getComponentDocs("not-a-real-component");
    expect(result).not.toHaveProperty("isError");
    const data = parseContent(result);
    expect(data.ok).toBe(false);
    expect((data.error as { code: string }).code).toBe("UNKNOWN_COMPONENT");
  });

  it("returns INVALID_INPUT for empty name", () => {
    const result = getComponentDocs("");
    const data = parseContent(result);
    expect(data.ok).toBe(false);
    expect((data.error as { code: string }).code).toBe("INVALID_INPUT");
  });
});

describe("get_installation_command", () => {
  it("returns npx command by default", () => {
    const result = getInstallationCommand(["button", "card"]);
    const data = parseContent(result);
    expect(data.ok).toBe(true);
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

  it("returns structured error with invalidComponents and suggestions", () => {
    const result = getInstallationCommand(["buton", "carrd"]);
    expect(result).not.toHaveProperty("isError");
    const data = parseContent(result);
    expect(data.ok).toBe(false);
    expect((data.error as { code: string }).code).toBe("UNKNOWN_COMPONENT");
    expect(data.invalidComponents).toEqual(
      expect.arrayContaining(["buton", "carrd"]),
    );
    expect(data.suggestions).toEqual(
      expect.arrayContaining(["button", "card"]),
    );
  });

  it("returns INVALID_INPUT for empty array", () => {
    const result = getInstallationCommand([]);
    const data = parseContent(result);
    expect(data.ok).toBe(false);
    expect((data.error as { code: string }).code).toBe("INVALID_INPUT");
  });
});

describe("get_theming_reference", () => {
  it("returns full CSS variable reference", () => {
    const result = getThemingReference();
    const data = parseContent(result);
    expect(data.ok).toBe(true);
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
    expect(data.ok).toBe(true);
    const variable = data.variable as { name: string };
    expect(variable.name).toBe("--doodle-ui-roughness");
  });

  it("returns structured error with suggestions for unknown token", () => {
    const result = getThemingReference("roughnes");
    const data = parseContent(result);
    expect(data.ok).toBe(false);
    expect((data.error as { code: string }).code).toBe("UNKNOWN_TOKEN");
    expect(data.suggestions).toEqual(
      expect.arrayContaining(["--doodle-ui-roughness"]),
    );
  });
});

describe("search_components", () => {
  it("ranks alert-dialog for destructive confirmation queries", () => {
    const result = searchComponents(
      "something for showing a confirmation before a destructive action",
    );
    const data = parseContent(result);
    expect(data.ok).toBe(true);
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

  it("returns empty results with message when nothing matches", () => {
    const result = searchComponents("xyz non-existent quantum widget zzzz");
    const data = parseContent(result);
    expect(data.ok).toBe(true);
    expect(data.count).toBe(0);
    expect(data.results).toEqual([]);
    expect(String(data.message).toLowerCase()).toMatch(/no components matched/);
  });

  it("returns INVALID_INPUT for empty query", () => {
    const result = searchComponents("");
    const data = parseContent(result);
    expect(data.ok).toBe(false);
    expect((data.error as { code: string }).code).toBe("INVALID_INPUT");
  });
});

describe("get_conventions", () => {
  it("returns all topics by default", () => {
    const result = getConventions();
    const data = parseContent(result);
    expect(data.ok).toBe(true);
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

  it("returns structured error for unknown topic", () => {
    const result = getConventions("invalid-topic" as "forms");
    const data = parseContent(result);
    expect(data.ok).toBe(false);
    expect((data.error as { code: string }).code).toBe("UNKNOWN_TOPIC");
    expect(Array.isArray(data.suggestions)).toBe(true);
  });
});
