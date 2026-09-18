import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  DoodleUIProvider,
  SketchSeedProvider,
  TooltipProvider,
} from "doodleui-react";
import "doodleui-react/styles.css";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SketchSeedProvider>
      <DoodleUIProvider theme="light">
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </DoodleUIProvider>
    </SketchSeedProvider>
  </StrictMode>,
);
