import { DocsNav } from "@/components/DocsNav";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 grid gap-10 lg:grid-cols-[200px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <DocsNav />
      </aside>
      <article className="min-w-0 pb-16 font-sans">{children}</article>
    </div>
  );
}
