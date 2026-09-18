"use client";

import { CaretRight } from "@phosphor-icons/react";
import { Breadcrumb, BreadcrumbItem, Card, Divider } from "doodleui-react";

const ACTIONS = [
  { label: "Transfer limits", detail: "Daily & monthly caps" },
  { label: "Scheduled transfers", detail: "Next run · Fri 9:00" },
  { label: "Payment methods", detail: "2 cards · 1 bank" },
];

export function QuickActionsCard() {
  return (
    <Card title="Payments" shadow={false} style={{ width: "100%" }}>
      <div className="grid gap-4">
        <Breadcrumb separator="chevron">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/docs/button">Account</BreadcrumbItem>
          <BreadcrumbItem current>Payments</BreadcrumbItem>
        </Breadcrumb>

        <ul className="m-0 p-0 list-none grid gap-1">
          {ACTIONS.map((action, index) => (
            <li key={action.label}>
              <button
                type="button"
                className="w-full flex items-center justify-between gap-3 py-2.5 text-left bg-transparent border-0 cursor-pointer text-ink hover:text-accent transition-colors"
              >
                <span>
                  <span className="block text-sm font-medium">{action.label}</span>
                  <span className="block text-xs text-mute mt-0.5">
                    {action.detail}
                  </span>
                </span>
                <CaretRight size={16} weight="bold" aria-hidden />
              </button>
              {index < ACTIONS.length - 1 ? (
                <Divider style={{ opacity: 0.35 }} />
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
