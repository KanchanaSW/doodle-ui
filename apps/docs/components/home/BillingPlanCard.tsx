"use client";

import { Badge, Button, Card, Tab, TabList, TabPanel, Tabs } from "doodleui-react";

const PLANS = {
  monthly: { price: "$12", cadence: "/mo", savings: null },
  yearly: { price: "$108", cadence: "/yr", savings: "Save 25%" },
} as const;

function PlanPanel({
  price,
  cadence,
  savings,
}: {
  price: string;
  cadence: string;
  savings: string | null;
}) {
  return (
    <div className="grid gap-4 pt-1">
      <div className="flex items-end gap-2">
        <span className="text-3xl font-semibold tracking-tight tabular-nums">
          {price}
        </span>
        <span className="text-sm text-mute pb-1">{cadence}</span>
        {savings ? <Badge variant="accent">{savings}</Badge> : null}
      </div>
      <ul className="m-0 p-0 list-none grid gap-2 text-sm">
        <li>Unlimited sketch seeds</li>
        <li>Shared theme tokens</li>
        <li>Priority docs support</li>
      </ul>
      <Button size="sm" style={{ justifySelf: "start" }}>
        Upgrade Plan
      </Button>
    </div>
  );
}

export function BillingPlanCard() {
  return (
    <Card title="Billing Plan" shadow={false} style={{ width: "100%" }}>
      <Tabs defaultValue="yearly">
        <TabList>
          <Tab value="monthly">Monthly</Tab>
          <Tab value="yearly">Yearly</Tab>
        </TabList>
        <TabPanel value="monthly">
          <PlanPanel {...PLANS.monthly} />
        </TabPanel>
        <TabPanel value="yearly">
          <PlanPanel {...PLANS.yearly} />
        </TabPanel>
      </Tabs>
    </Card>
  );
}
