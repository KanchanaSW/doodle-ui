"use client";

import {
  Profiler,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  DoodleUIProvider,
  Input,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "doodleui-react";

type Status = "active" | "pending" | "archived";

interface Row {
  id: number;
  name: string;
  status: Status;
  amount: number;
}

interface Telemetry {
  mountMs: number | null;
  updateMs: number | null;
  commitCount: number;
  lastPhase: string;
}

const STATUS_VARIANT: Record<Status, "accent" | "default" | "outline"> = {
  active: "accent",
  pending: "default",
  archived: "outline",
};

function makeRows(count: number): Row[] {
  const statuses: Status[] = ["active", "pending", "archived"];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Order #${1000 + i}`,
    status: statuses[i % 3]!,
    amount: 12 + (i % 17) * 3.5,
  }));
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontSize: 11, opacity: 0.65 }}>{label}</span>
      <span style={{ fontFamily: "var(--font-ibm), monospace", fontSize: 14 }}>
        {value}
      </span>
    </div>
  );
}

function Dashboard({
  rows,
  search,
  onSearch,
  roughness,
  animate,
  fixedSeeds,
  tick,
}: {
  rows: Row[];
  search: string;
  onSearch: (value: string) => void;
  roughness: number;
  animate: boolean;
  fixedSeeds: boolean;
  tick: number;
}) {
  const sketch = useMemo(
    () => ({
      roughness,
      animate,
      ...(fixedSeeds ? { seed: 42 } : {}),
    }),
    [roughness, animate, fixedSeeds],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => row.name.toLowerCase().includes(q));
  }, [rows, search]);

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {/* tick is read so unrelated parent state forces a re-render of this tree */}
      <span style={{ display: "none" }} aria-hidden>
        {tick}
      </span>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        <Card title="Open orders" {...sketch}>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 650 }}>
            {filtered.filter((r) => r.status === "active").length}
          </p>
        </Card>
        <Card title="Pending" {...sketch}>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 650 }}>
            {filtered.filter((r) => r.status === "pending").length}
          </p>
        </Card>
        <Card title="Revenue (sample)" {...sketch}>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 650 }}>
            $
            {filtered
              .reduce((sum, r) => sum + r.amount, 0)
              .toFixed(0)}
          </p>
        </Card>
      </div>

      <Card title="Filters" {...sketch} shadow={false}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "flex-end",
          }}
        >
          <Input
            label="Search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Order name…"
            style={{ minWidth: 200 }}
            {...sketch}
          />
          <Select
            aria-label="Status filter"
            placeholder="All statuses"
            options={[
              { value: "all", label: "All" },
              { value: "active", label: "Active" },
              { value: "pending", label: "Pending" },
              { value: "archived", label: "Archived" },
            ]}
            {...sketch}
          />
          <Checkbox label="Include archived" {...sketch} />
          <Checkbox label="High value only" {...sketch} />
          <Checkbox label="Needs review" {...sketch} />
          <RadioGroup defaultValue="any" style={{ display: "flex", gap: 12 }}>
            <Radio value="any" label="Any owner" {...sketch} />
            <Radio value="mine" label="Mine" {...sketch} />
          </RadioGroup>
          <Switch label="Live refresh" {...sketch} />
        </div>
      </Card>

      <Table {...sketch}>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANT[row.status]} {...sketch}>
                  {row.status}
                </Badge>
              </TableCell>
              <TableCell>${row.amount.toFixed(2)}</TableCell>
              <TableCell>
                <Button size="sm" variant="outline" {...sketch}>
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function BenchmarkPage() {
  const [rows, setRows] = useState(() => makeRows(50));
  const [search, setSearch] = useState("");
  const [tick, setTick] = useState(0);
  const [roughness, setRoughness] = useState(1.5);
  const [animate, setAnimate] = useState(true);
  const [fixedSeeds, setFixedSeeds] = useState(true);
  const [telemetry, setTelemetry] = useState<Telemetry>({
    mountMs: null,
    updateMs: null,
    commitCount: 0,
    lastPhase: "—",
  });
  const mountedOnce = useRef(false);

  const onRender = useCallback(
    (
      _id: string,
      phase: "mount" | "update" | "nested-update",
      actualDuration: number,
    ) => {
      setTelemetry((prev) => {
        const next: Telemetry = {
          ...prev,
          commitCount: prev.commitCount + 1,
          lastPhase: phase,
        };
        if (phase === "mount" || !mountedOnce.current) {
          mountedOnce.current = true;
          next.mountMs = actualDuration;
        } else {
          next.updateMs = actualDuration;
        }
        return next;
      });
    },
    [],
  );

  const bumpUnrelated = () => setTick((t) => t + 1);

  const updateFirstRow = () => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === 0
          ? { ...row, amount: row.amount + 1, name: `${row.name}*` }
          : row,
      ),
    );
  };

  const resetRows = () => setRows(makeRows(50));

  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "32px 20px 80px",
        display: "grid",
        gap: 20,
      }}
    >
      <header style={{ display: "grid", gap: 8 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>
          Rendering benchmark
        </h1>
        <p style={{ margin: 0, opacity: 0.7, maxWidth: 62 * 8 }}>
          Heavy but realistic dashboard: 50 table rows with badges and buttons,
          sketchy row rules, filter form controls, and summary cards. Use React
          DevTools Profiler alongside the live telemetry below.
        </p>
      </header>

      <Card title="Profiler telemetry" shadow={false} animate={false} seed={1}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <Metric
            label="Last mount (ms)"
            value={
              telemetry.mountMs != null ? telemetry.mountMs.toFixed(2) : "—"
            }
          />
          <Metric
            label="Last update (ms)"
            value={
              telemetry.updateMs != null ? telemetry.updateMs.toFixed(2) : "—"
            }
          />
          <Metric label="Commits" value={String(telemetry.commitCount)} />
          <Metric label="Last phase" value={telemetry.lastPhase} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <Button size="sm" onClick={bumpUnrelated} seed={2} animate={false}>
            Unrelated re-render
          </Button>
          <Button size="sm" onClick={updateFirstRow} seed={3} animate={false}>
            Update first row
          </Button>
          <Button size="sm" variant="outline" onClick={resetRows} seed={4} animate={false}>
            Reset rows
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setRoughness((r) => (r === 1.5 ? 0.75 : 1.5))}
            seed={5}
            animate={false}
          >
            Roughness: {roughness}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setAnimate((a) => !a)}
            seed={6}
            animate={false}
          >
            Animate: {animate ? "on" : "off"}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setFixedSeeds((f) => !f)}
            seed={7}
            animate={false}
          >
            Seeds: {fixedSeeds ? "fixed" : "random"}
          </Button>
        </div>
      </Card>

      <DoodleUIProvider animate={animate} roughness={roughness}>
        <Profiler id="heavy-dashboard" onRender={onRender}>
          <Dashboard
            rows={rows}
            search={search}
            onSearch={setSearch}
            roughness={roughness}
            animate={animate}
            fixedSeeds={fixedSeeds}
            tick={tick}
          />
        </Profiler>
      </DoodleUIProvider>

      <p style={{ margin: 0, fontSize: 13, opacity: 0.55 }}>
        Tip: open React DevTools → Profiler, record, then click “Unrelated
        re-render” and “Update first row” to compare wasted work vs targeted
        updates.
      </p>
    </main>
  );
}
