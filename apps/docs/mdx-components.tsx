import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => (
      <h1
        className="text-4xl md:text-[2.75rem] font-semibold tracking-tight leading-[1.1] mb-4"
        {...props}
      />
    ),
    h2: (props) => (
      <h2
        className="text-2xl font-semibold tracking-tight mt-12 mb-3"
        {...props}
      />
    ),
    h3: (props) => (
      <h3 className="text-lg font-semibold mt-8 mb-2" {...props} />
    ),
    p: (props) => (
      <p className="text-base leading-relaxed text-mute dark:text-chalkink/80 mb-4 max-w-[65ch]" {...props} />
    ),
    a: ({ href, children, ...props }) => (
      <Link
        href={href ?? "#"}
        className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
        {...props}
      >
        {children}
      </Link>
    ),
    ul: (props) => (
      <ul className="list-disc pl-5 mb-4 space-y-1 text-mute dark:text-chalkink/80" {...props} />
    ),
    code: (props) => (
      <code
        className="font-mono text-[13px] bg-ink/5 dark:bg-white/10 px-1.5 py-0.5 rounded-sm"
        {...props}
      />
    ),
    pre: (props) => (
      <pre
        className="font-mono text-[13px] leading-relaxed bg-ink dark:bg-black text-chalkink p-4 overflow-x-auto mb-6 rounded-none"
        {...props}
      />
    ),
    ...components,
  };
}
