import { Command } from "commander";
import { addCommand } from "./commands/add";
import { diffCommand } from "./commands/diff";
import { initCommand } from "./commands/init";
import { listCommand } from "./commands/list";
import { SKETCH_BANNER } from "./utils";

const program = new Command();

program
  .name("doodleui-react")
  .description("DoodleUI - shadcn-style component installer for hand-drawn sketch UI")
  .version("0.7.2")
  .addHelpText("beforeAll", SKETCH_BANNER);

program
  .command("init")
  .description("Initialize DoodleUI configuration and copy shared internal utilities")
  .option("-y, --yes", "Accept detected defaults without prompting")
  .option("-d, --defaults", "Use default configuration")
  .option("-c, --cwd <path>", "Working directory", process.cwd())
  .action(async (options) => {
    try {
      await initCommand(options);
    } catch (err: any) {
      console.error("\nInit error:", err?.message || err);
      process.exit(1);
    }
  });

program
  .command("add")
  .description("Add DoodleUI component(s) to your project")
  .argument("[components...]", "Names of component(s) to add")
  .option("-y, --yes", "Skip confirmation prompts")
  .option("-o, --overwrite", "Overwrite existing component files")
  .option("-a, --all", "Add all available components")
  .option("-c, --cwd <path>", "Working directory", process.cwd())
  .option("--path <path>", "Override components destination directory")
  .action(async (components, options) => {
    try {
      await addCommand(components, options);
    } catch (err: any) {
      console.error("\nAdd error:", err?.message || err);
      process.exit(1);
    }
  });

program
  .command("list")
  .description("List all available components and check local installation status")
  .option("-c, --cwd <path>", "Working directory", process.cwd())
  .option("--json", "Output list as JSON")
  .action(async (options) => {
    try {
      await listCommand(options);
    } catch (err: any) {
      console.error("\nList error:", err?.message || err);
      process.exit(1);
    }
  });

program
  .command("diff")
  .description("Compare local component file against upstream registry version")
  .argument("[component]", "Name of component to diff")
  .option("-c, --cwd <path>", "Working directory", process.cwd())
  .action(async (component, options) => {
    try {
      await diffCommand(component, options);
    } catch (err: any) {
      console.error("\nDiff error:", err?.message || err);
      process.exit(1);
    }
  });

program.parseAsync(process.argv).catch((err) => {
  console.error("CLI error:", err);
  process.exit(1);
});
