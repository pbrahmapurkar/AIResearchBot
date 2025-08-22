import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import TopNav from "@/components/TopNav";

const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});

export const metadata: Metadata = {
  title: "Mister PB - AI-Powered Consumer Insights for Tier-2 & Tier-3 India",
  description: "Decode vernacular consumer behavior, price sensitivity, and purchase patterns in Bharat's regional markets with our AI-powered research platform.",
  keywords: "Tier 2 India consumer insights, vernacular market research, regional consumer behavior, semi-urban market analysis, Indian consumer intelligence",
  authors: [{ name: "Mister PB Team" }],
  robots: "index, follow",
  openGraph: {
    title: "Mister PB - AI-Powered Consumer Insights for Tier-2 & Tier-3 India",
    description: "Decode vernacular consumer behavior, price sensitivity, and purchase patterns in Bharat's regional markets with our AI-powered research platform.",
    type: "website",
    locale: "en_US",
    siteName: "Mister PB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mister PB - AI-Powered Consumer Insights for Tier-2 & Tier-3 India",
    description: "Decode vernacular consumer behavior, price sensitivity, and purchase patterns in Bharat's regional markets with our AI-powered research platform.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${spaceGrotesk.variable}`}>
        <TopNav />
        {children}
        <Toaster />
      </body>
    </html>
  );
}