import type { Metadata } from "next";
import {
  Caveat,
  Gochi_Hand,
  IBM_Plex_Mono,
  Kalam,
  Outfit,
  Patrick_Hand,
} from "next/font/google";
import { Providers } from "./providers";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const componentThemeBootstrap = `(function(){try{var k="doodle-ui-component-theme";var t=localStorage.getItem(k);if(t!=="light"&&t!=="dark"){var l=localStorage.getItem("doodle-ui-site-theme");if(l==="light"||l==="dark")t=l;else t="light";}document.documentElement.setAttribute("data-component-theme",t);}catch(e){document.documentElement.setAttribute("data-component-theme","light");}})();`;

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
      suppressHydrationWarning
      className={`${outfit.variable} ${caveat.variable} ${patrickHand.variable} ${kalam.variable} ${gochiHand.variable} ${ibm.variable}`}
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
