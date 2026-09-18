import type { Metadata } from "next";
import {
  Architects_Daughter,
  Caveat,
  Gochi_Hand,
  IBM_Plex_Mono,
  Kalam,
  Outfit,
  Patrick_Hand,
} from "next/font/google";
import { Providers } from "./providers";
import { SiteHeader } from "@/components/SiteHeader";
import "doodleui-react/styles.css";
import "./globals.css";

const componentThemeBootstrap = `(function(){try{var k="doodle-ui-component-theme";var t=localStorage.getItem(k);if(t!=="light"&&t!=="dark"){var l=localStorage.getItem("doodle-ui-site-theme");if(l==="light"||l==="dark")t=l;else t="light";}var r=document.documentElement;r.setAttribute("data-component-theme",t);r.setAttribute("data-theme",t);r.classList.remove("light","dark");r.classList.add(t);r.style.colorScheme=t;}catch(e){var f=document.documentElement;f.setAttribute("data-component-theme","light");f.setAttribute("data-theme","light");f.classList.add("light");f.style.colorScheme="light";}})();`;

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-patrick-hand",
  display: "swap",
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-kalam",
  display: "swap",
});

const gochiHand = Gochi_Hand({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gochi-hand",
  display: "swap",
});

const architectsDaughter = Architects_Daughter({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-architects-daughter",
  display: "swap",
});

const ibm = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "doodle-ui",
    template: "%s · doodle-ui",
  },
  description:
    "Hand-drawn React components with an Excalidraw-like sketch aesthetic.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-component-theme="light"
      data-theme="light"
      suppressHydrationWarning
      className={`light ${outfit.variable} ${caveat.variable} ${patrickHand.variable} ${kalam.variable} ${gochiHand.variable} ${architectsDaughter.variable} ${ibm.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: componentThemeBootstrap }} />
      </head>
      <body className="font-sans antialiased">
        <div className="paper-grain" aria-hidden="true" />
        <Providers>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
