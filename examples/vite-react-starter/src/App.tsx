import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Input,
  Modal,
  Switch,
  useSketchSeed,
} from "doodleui-react";

function ShuffleButton() {
  const { shuffle } = useSketchSeed();
  return (
    <Button variant="outline" onClick={shuffle}>
      Shuffle
    </Button>
  );
}

export default function App() {
  const [notify, setNotify] = useState(true);

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "48px 24px 64px",
        display: "grid",
        gap: 24,
      }}
    >
      <header style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <Badge variant="accent">Vite + React</Badge>
          <Badge variant="outline">doodleui-react</Badge>
        </div>
        <h1 style={{ margin: 0, fontSize: "2.5rem", lineHeight: 1.1 }}>
          Sketch starter
        </h1>
        <p style={{ margin: 0, color: "var(--mute)", maxWidth: "42ch", lineHeight: 1.5 }}>
          Minimal Vite template with doodleui-react pre-installed. Hit Shuffle to
          redraw every unlocked stroke.
        </p>
        <div>
          <ShuffleButton />
        </div>
      </header>

      <Card title="Field notes" shadow>
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <Button size="sm">Primary</Button>
            <Button size="sm" variant="secondary">
              Secondary
            </Button>
            <Button size="sm" variant="outline">
              Outline
            </Button>
            <Button size="sm" variant="ghost">
              Ghost
            </Button>
          </div>

          <Input label="Email" placeholder="you@studio.dev" />

          <Switch
            label="Keep the wobble"
            checked={notify}
            onCheckedChange={setNotify}
          />

          <Alert variant="info" title="Heads up">
            Text stays HTML. Borders and fills are rough.js sketches.
          </Alert>

          <Modal
            title="Scratch pad"
            description="Radix handles focus. doodle-ui draws the frame."
            trigger={<Button variant="outline">Open modal</Button>}
          >
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
              Drop any content here. The sketch layer stays behind it.
            </p>
          </Modal>
        </div>
      </Card>
    </main>
  );
}
