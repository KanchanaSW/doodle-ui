import pc from "picocolors";

export const SKETCH_BANNER = `
  ${pc.yellow("╭──────────────────────────────────────────────╮")}
  ${pc.yellow("│")}   ${pc.bold(pc.cyan("✎ doodleui-react"))}                      ${pc.yellow("│")}
  ${pc.yellow("│")}   ${pc.dim("Hand-drawn sketch UI components for React")}   ${pc.yellow("│")}
  ${pc.yellow("╰──────────────────────────────────────────────╯")}
`;

export function printBanner(): void {
  console.log(SKETCH_BANNER);
}

export function logSuccess(message: string): void {
  console.log(`${pc.green("✓")} ${message}`);
}

export function logInfo(message: string): void {
  console.log(`${pc.blue("ℹ")} ${message}`);
}

export function logWarning(message: string): void {
  console.log(`${pc.yellow("⚠")} ${message}`);
}

export function logError(message: string): void {
  console.log(`${pc.red("✖")} ${message}`);
}
