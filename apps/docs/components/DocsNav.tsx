"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMPONENT_PAGES } from "@/lib/nav";

export function DocsNav() {
  const pathname = usePathname();

  return (
    <nav className="text-sm font-sans">
      <Link
        href="/install"
        className="block mb-4 font-medium hover:text-accent"
      >
        Install
      </Link>
      <p className="font-semibold mb-2">Components</p>
      <ul className="space-y-1">
        {COMPONENT_PAGES.map((item) => {
          const href = `/docs/${item.slug}`;
          const active = pathname === href;
          return (
            <li key={item.slug}>
              <Link
                href={href}
                className={
                  active
                    ? "text-accent font-medium"
                    : "text-mute dark:text-chalkink/70 hover:text-ink dark:hover:text-chalkink"
                }
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
