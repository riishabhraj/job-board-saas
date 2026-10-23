import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter } from "next/font/google";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const description =
  "Technology jobs taken directly from company career boards, with clear location, experience and freshness — and a link to the company's own application page.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "jobboard — Tech jobs, straight from the source",
    template: "%s — jobboard",
  },
  description,
  openGraph: {
    type: "website",
    siteName: "jobboard",
    title: "jobboard — Tech jobs, straight from the source",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "jobboard — Tech jobs, straight from the source",
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-control focus:bg-text focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-bg"
        >
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
