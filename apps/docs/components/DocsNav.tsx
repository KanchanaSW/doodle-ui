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
        href="/docs/theming"
        className={`block mb-4 font-medium ${
          pathMatches(pathname, "/docs/theming")
            ? "text-accent"
            : "hover:text-accent"
        }`}
        aria-current={
          pathMatches(pathname, "/docs/theming") ? "page" : undefined
        }
      >
        Theming
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
      <Link
        href="/docs/sizing"
        className={`block mb-4 font-medium ${
          pathMatches(pathname, "/docs/sizing")
            ? "text-accent"
            : "hover:text-accent"
        }`}
        aria-current={
          pathMatches(pathname, "/docs/sizing") ? "page" : undefined
        }
      >
        Sizing
      </Link>
      <Link
        href="/docs/icons"
        className={`block mb-4 font-medium ${
          pathMatches(pathname, "/docs/icons")
            ? "text-accent"
            : "hover:text-accent"
        }`}
        aria-current={
          pathMatches(pathname, "/docs/icons") ? "page" : undefined
        }
      >
        Icons
      </Link>
      <Link
        href="/docs/forms"
        className={`block mb-4 font-medium ${
          pathMatches(pathname, "/docs/forms")
            ? "text-accent"
            : "hover:text-accent"
        }`}
        aria-current={
          pathMatches(pathname, "/docs/forms") ? "page" : undefined
        }
      >
        Forms
      </Link>
      <Link
        href="/docs/controlled-uncontrolled"
        className={`block mb-4 font-medium ${
          pathMatches(pathname, "/docs/controlled-uncontrolled")
            ? "text-accent"
            : "hover:text-accent"
        }`}
        aria-current={
          pathMatches(pathname, "/docs/controlled-uncontrolled")
            ? "page"
            : undefined
        }
      >
        Controlled state
      </Link>
      <Link
        href="/docs/performance"
        className={`block mb-4 font-medium ${
          pathMatches(pathname, "/docs/performance")
            ? "text-accent"
            : "hover:text-accent"
        }`}
        aria-current={
          pathMatches(pathname, "/docs/performance") ? "page" : undefined
        }
      >
        Performance
      </Link>
      <Link
        href="/docs/vs-shadcn"
        className={`block mb-4 font-medium ${
          pathMatches(pathname, "/docs/vs-shadcn")
            ? "text-accent"
            : "hover:text-accent"
        }`}
        aria-current={
          pathMatches(pathname, "/docs/vs-shadcn") ? "page" : undefined
        }
      >
        vs shadcn/ui
      </Link>
      <Link
        href="/customize"
        className={`block mb-4 font-medium ${
          pathMatches(pathname, "/customize")
            ? "text-accent"
            : "hover:text-accent"
        }`}
        aria-current={pathMatches(pathname, "/customize") ? "page" : undefined}
      >
        Theme generator
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
