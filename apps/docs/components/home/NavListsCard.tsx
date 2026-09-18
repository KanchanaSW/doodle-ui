"use client";

import {
  CalendarBlank,
  ChartBar,
  CreditCard,
  FileText,
  FolderOpen,
  Gear,
  Lifebuoy,
  User,
  Wallet,
  type Icon,
} from "@phosphor-icons/react";
import { Card, Divider } from "doodleui-react";

const GROUPS: {
  title: string;
  items: { label: string; Icon: Icon }[];
}[] = [
  {
    title: "Planning",
    items: [
      { label: "Documents", Icon: FileText },
      { label: "Budget", Icon: Wallet },
      { label: "Calendar", Icon: CalendarBlank },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Help Center", Icon: Lifebuoy },
      { label: "Billing", Icon: CreditCard },
      { label: "Files", Icon: FolderOpen },
    ],
  },
  {
    title: "Overview",
    items: [
      { label: "Analytics", Icon: ChartBar },
      { label: "Reports", Icon: FileText },
      { label: "Settings", Icon: Gear },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", Icon: User },
      { label: "Security", Icon: Gear },
      { label: "Billing", Icon: CreditCard },
    ],
  },
];

export function NavListsCard() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {GROUPS.map((group) => (
        <Card key={group.title} title={group.title} shadow={false} style={{ width: "100%" }}>
          <ul className="m-0 p-0 list-none grid gap-2.5">
            {group.items.map((item, index) => (
              <li key={item.label}>
                <button
                  type="button"
                  className="w-full flex items-center gap-2.5 text-left text-sm hover:text-accent transition-colors bg-transparent border-0 p-0 cursor-pointer text-ink"
                >
                  <item.Icon size={16} weight="regular" aria-hidden />
                  <span>{item.label}</span>
                </button>
                {index < group.items.length - 1 ? (
                  <Divider style={{ marginTop: 10, opacity: 0.35 }} />
                ) : null}
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
