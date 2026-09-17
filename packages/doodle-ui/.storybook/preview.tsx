import type { Preview } from "@storybook/react";
import React from "react";
import { DoodleUIProvider } from "../src/animations";
import { SketchSeedProvider } from "../src/hooks/useSketchSeed";
import "../src/styles.css";

/** Fixed seed for all visual regression stories — prevents rough.js wobble diffs. */
export const STORY_SEED = 42;

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    chromatic: { disableSnapshot: false },
  },
  decorators: [
    (Story) =>
      React.createElement(
        DoodleUIProvider,
        { theme: "light", animate: true },
        React.createElement(
          SketchSeedProvider,
          { initialSeed: STORY_SEED },
          React.createElement(
            "div",
            {
              style: {
                padding: 24,
                minWidth: 320,
                fontFamily:
                  'var(--doodle-ui-font, "Segoe Print", "Bradley Hand", cursive)',
                background: "#f7f4ef",
              },
            },
            React.createElement(Story),
          ),
        ),
      ),
  ],
};

export default preview;
