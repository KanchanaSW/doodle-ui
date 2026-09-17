"use client";

import { Tab, TabList, TabPanel, Tabs } from "doodleui-react";

const PACKAGE_COMMANDS = {
  npm: "npm install doodleui-react",
  pnpm: "pnpm add doodleui-react",
  yarn: "yarn add doodleui-react",
  bun: "bun add doodleui-react",
} as const;

const CLI_COMMANDS = {
  npm: `# Initialize project configuration & copy shared utilities
npx doodleui-react init

# Add components directly into your codebase
npx doodleui-react add button card badge dialog

# List components and check installation status
npx doodleui-react list

# Compare local modifications against upstream registry
npx doodleui-react diff button`,
  pnpm: `# Initialize project configuration & copy shared utilities
pnpm dlx doodleui-react init

# Add components directly into your codebase
pnpm dlx doodleui-react add button card badge dialog

# List components and check installation status
pnpm dlx doodleui-react list

# Compare local modifications against upstream registry
pnpm dlx doodleui-react diff button`,
  yarn: `# Initialize project configuration & copy shared utilities
yarn dlx doodleui-react init

# Add components directly into your codebase
yarn dlx doodleui-react add button card badge dialog

# List components and check installation status
yarn dlx doodleui-react list

# Compare local modifications against upstream registry
yarn dlx doodleui-react diff button`,
  bun: `# Initialize project configuration & copy shared utilities
bunx doodleui-react init

# Add components directly into your codebase
bunx doodleui-react add button card badge dialog

# List components and check installation status
bunx doodleui-react list

# Compare local modifications against upstream registry
bunx doodleui-react diff button`,
} as const;

type Manager = keyof typeof PACKAGE_COMMANDS;

const MANAGERS: Manager[] = ["npm", "pnpm", "yarn", "bun"];

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="font-mono text-sm bg-chalkboard text-chalkink p-4 overflow-x-auto m-0">
      {children}
    </pre>
  );
}

export function PackageInstallTabs() {
  return (
    <Tabs defaultValue="npm" className="mb-3">
      <TabList>
        {MANAGERS.map((pm) => (
          <Tab key={pm} value={pm}>
            {pm}
          </Tab>
        ))}
      </TabList>
      {MANAGERS.map((pm) => (
        <TabPanel key={pm} value={pm}>
          <CodeBlock>{PACKAGE_COMMANDS[pm]}</CodeBlock>
        </TabPanel>
      ))}
    </Tabs>
  );
}

export function CliInstallTabs() {
  return (
    <Tabs defaultValue="npm" className="mb-3">
      <TabList>
        {MANAGERS.map((pm) => (
          <Tab key={pm} value={pm}>
            {pm}
          </Tab>
        ))}
      </TabList>
      {MANAGERS.map((pm) => (
        <TabPanel key={pm} value={pm}>
          <CodeBlock>{CLI_COMMANDS[pm]}</CodeBlock>
        </TabPanel>
      ))}
    </Tabs>
  );
}
