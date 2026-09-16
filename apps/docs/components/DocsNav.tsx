"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMPONENT_PAGES } from "@/lib/nav";

function pathMatches(pathname: string, href: string) {
  const normalize = (path: string) =>
    path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;
  return normalize(pathname) === normalize(href);
}

export function DocsNav() {
  const pathname = usePathname();

  return (
    <nav className="text-sm font-sans">
      <Link
        href="/install"
        className={`block mb-4 font-medium ${
          pathMatches(pathname, "/install")
            ? "text-accent"
            : "hover:text-accent"
        }`}
        aria-current={pathMatches(pathname, "/install") ? "page" : undefined}
      >
        Install
      </Link>
      <Link
        href="/docs/animation"
        className={`block mb-4 font-medium ${
          pathMatches(pathname, "/docs/animation")
            ? "text-accent"
            : "hover:text-accent"
        }`}
        aria-current={
          pathMatches(pathname, "/docs/animation") ? "page" : undefined
        }
      >
        Animation
      </Link>
      <p className="font-semibold mb-2">Components</p>
      <ul className="space-y-1">
        {COMPONENT_PAGES.map((item) => {
          const href = `/docs/${item.slug}`;
          const active = pathMatches(pathname, href);
          return (
            <li key={item.slug}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "-ml-2 border-l-2 border-accent pl-1.5 text-accent font-medium"
                    : "text-mute hover:text-ink"
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
