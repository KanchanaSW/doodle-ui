import { Avatar, Badge, Blockquote, Button } from "doodleui-react";

export interface HeroAction {
  label: string;
  href: string;
}

export interface HeroTestimonialProps {
  quote?: string;
  name?: string;
  role?: string;
  initials?: string;
  brands?: string[];
  primaryAction?: HeroAction;
  className?: string;
}

const defaultBrands = ["Northwind", "Fieldnote", "Paper Co", "Inkwell"];
const defaultAction: HeroAction = { label: "Read the case study", href: "#" };
const starTilts = [-8, 4, -2, 6, -5];

/**
 * Social-proof hero: the quote is the headline, with stars, a person, and wordmarks.
 * Built only from doodle-ui components and theme tokens.
 */
export function HeroTestimonial({
  quote = "We swapped a week of polishing for an afternoon of sketching, and the page finally sounded like us.",
  name = "Mina Cho",
  role = "Design lead, Fieldnote",
  initials = "MC",
  brands = defaultBrands,
  primaryAction = defaultAction,
  className,
}: HeroTestimonialProps) {
  return (
    <section
      className={`bg-paper px-6 py-16 text-center text-ink md:py-24 ${className ?? ""}`.trim()}
    >
      <div className="mx-auto max-w-3xl">
        <div className="flex justify-center gap-1 text-accent" aria-label="5 out of 5 stars">
          {starTilts.map((tilt) => (
            <span
              key={tilt}
              aria-hidden
              className="inline-block text-2xl leading-none"
              style={{ transform: `rotate(${tilt}deg)` }}
            >
              ★
            </span>
          ))}
        </div>
        <div className="mx-auto mt-6 max-w-2xl text-left text-2xl md:text-3xl">
          <Blockquote>
            <span className="doodle-shuffle-type !leading-[1.35]">{quote}</span>
          </Blockquote>
        </div>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Avatar size="md" fallback={initials} alt="" />
          <p className="text-left text-sm">
            <span className="block font-semibold text-ink">{name}</span>
            <span className="block text-mute">{role}</span>
          </p>
        </div>
        <p className="mt-10 text-xs uppercase tracking-[0.18em] text-mute">Trusted by</p>
        <ul className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {brands.map((brand) => (
            <li key={brand}>
              <Badge variant="outline">{brand}</Badge>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Button size="lg" asChild style={{ lineHeight: 1.45 }}>
            <a href={primaryAction.href}>
              <span className="relative z-[1]">{primaryAction.label}</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
