import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import TopNav from "@/components/TopNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mister PB - AI Consumer Insights for Tier-2 & Tier-3 India Markets",
  description: "Decode vernacular consumer behavior and price sensitivity across regional Indian markets with AI-powered insights for Tier-2/3 cities.",
  keywords: "Tier 2 India consumer insights, vernacular market research, regional consumer behavior, semi-urban market analysis, Indian consumer intelligence",
  authors: [{ name: "Mister PB Team" }],
  robots: "index, follow",
  openGraph: {
    title: "Mister PB - AI Consumer Insights for Tier-2 & Tier-3 India Markets",
    description: "Decode vernacular consumer behavior and price sensitivity across regional Indian markets with AI-powered insights for Tier-2/3 cities.",
    type: "website",
    locale: "en_US",
    siteName: "Mister PB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mister PB - AI Consumer Insights for Tier-2 & Tier-3 India Markets",
    description: "Decode vernacular consumer behavior and price sensitivity across regional Indian markets with AI-powered insights for Tier-2/3 cities.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TopNav />
        {children}
        <Toaster />
      </body>
    </html>
  );
}