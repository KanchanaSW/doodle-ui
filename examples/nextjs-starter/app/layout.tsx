import type { Metadata } from "next";
import { Providers } from "./providers";
import "doodleui-react/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "doodleui-react · Next.js Starter",
  description: "Next.js App Router starter with doodleui-react pre-installed.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Outfit:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
