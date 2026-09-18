"use client";

import { Avatar, Badge, Card, Divider } from "doodleui-react";

const MEMBERS = [
  {
    name: "Maya Chen",
    action: "Approved payout",
    time: "2m ago",
    fallback: "MC",
    status: "online" as const,
  },
  {
    name: "Jonah Reed",
    action: "Updated threshold",
    time: "18m ago",
    fallback: "JR",
    status: "busy" as const,
  },
  {
    name: "Priya Shah",
    action: "Invited collaborator",
    time: "1h ago",
    fallback: "PS",
    status: "offline" as const,
  },
];

export function TeamActivityCard() {
  return (
    <Card
      title={
        <span className="flex items-center justify-between gap-3 w-full">
          Team Activity
          <Badge variant="outline">Live</Badge>
        </span>
      }
      shadow={false}
      style={{ width: "100%" }}
    >
      <ul className="m-0 p-0 list-none grid gap-1">
        {MEMBERS.map((member, index) => (
          <li key={member.name}>
            <div className="flex items-center gap-3 py-2">
              <Avatar
                fallback={member.fallback}
                alt={member.name}
                size={36}
                status={member.status}
              />
              <div className="min-w-0 flex-1">
                <p className="m-0 text-sm font-medium truncate">{member.name}</p>
                <p className="m-0 text-xs text-mute truncate">{member.action}</p>
              </div>
              <span className="text-xs text-mute shrink-0 tabular-nums">
                {member.time}
              </span>
            </div>
            {index < MEMBERS.length - 1 ? (
              <Divider style={{ opacity: 0.35 }} />
            ) : null}
          </li>
        ))}
      </ul>
    </Card>
  );
}
