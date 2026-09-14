import Link from "next/link";
import { Card } from "doodleui-react";
import { COMPONENT_PAGES } from "@/lib/nav";

export default function DocsIndexPage() {
  return (
    <div>
      <h1 className="text-4xl font-semibold tracking-tight mb-3">Components</h1>
      <p className="text-mute mb-8 max-w-[65ch]">
        Each page has a live playground, a copyable snippet, and a props table. Sketch props (`roughness`, `seed`, `sketchColor`) are shared across the set.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {COMPONENT_PAGES.map((item) => (
          <Link key={item.slug} href={`/docs/${item.slug}`}>
            <Card title={item.title} shadow={false}>
              <p className="text-sm text-mute m-0">{item.blurb}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
