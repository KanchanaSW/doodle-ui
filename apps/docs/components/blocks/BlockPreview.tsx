"use client";

import { useState, type ReactNode } from "react";
import { Button, Tab, TabList, TabPanel, Tabs } from "doodleui-react";

export function BlockPreview({
  title,
  source,
  children,
}: {
  title: string;
  source: string;
  children: ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(source);
    } catch {
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <Tabs defaultValue="preview">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
        <div className="flex flex-wrap items-center gap-2">
          <TabList>
            <Tab value="preview">Preview</Tab>
            <Tab value="code">Code</Tab>
          </TabList>
          <Button size="sm" variant="outline" onClick={copy}>
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>
      <TabPanel
        value="preview"
        className="component-canvas overflow-hidden border"
        style={{
          paddingTop: 0,
          color: "inherit",
          fontSize: "inherit",
          borderColor: "color-mix(in srgb, var(--ink) 35%, transparent)",
        }}
      >
        {children}
      </TabPanel>
      <TabPanel
        value="code"
        style={{ paddingTop: 0, color: "inherit", fontFamily: "inherit", fontSize: "inherit" }}
      >
        <pre className="m-0 overflow-x-auto whitespace-pre-wrap bg-chalkboard p-4 font-mono text-[12px] leading-relaxed text-chalkink">
          {source}
        </pre>
      </TabPanel>
    </Tabs>
  );
}
