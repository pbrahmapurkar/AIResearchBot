import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import TopNav from "@/components/TopNav";
import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';
import { SupabaseProvider } from '@/components/supabase-provider';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // SSR: get session on the server
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 });
        },
      },
    }
  );
  
  const { data: { session } } = await supabase.auth.getSession();

  const pathname = (await headers()).get('next-url') || '';
  const showTopNav = !pathname.startsWith('/dashboard');

  return (
    <html lang="en">
      <body className={`${inter.className} ${spaceGrotesk.variable}`}>
        {/* Provide session to client components */}
        <SupabaseProvider initialSession={session ?? null}>
          {showTopNav && <TopNav />}
          {children}
          <Toaster />
        </SupabaseProvider>
      </body>
    </html>
  );
}