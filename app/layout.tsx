import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

// Lazy-load Toaster - not needed for first paint
const Toaster = dynamic(
  () => import("react-hot-toast").then((m) => ({ default: m.Toaster })),
  { ssr: false }
);

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Soul Sync - Daily Faith & Motivation",
  description:
    "A mood-based mental health and faith app. Sync your soul, find peace, and grow in faith daily.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Soul Sync",
  },
  openGraph: {
    title: "Soul Sync",
    description: "Daily faith, motivation, and mental wellness",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f0a1a" },
    { media: "(prefers-color-scheme: light)", color: "#0f0a1a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* DNS prefetch & preconnect to Supabase for faster API calls */}
        <link rel="dns-prefetch" href="https://kxgelcwkfpyjytwhocst.supabase.co" />
        <link rel="preconnect" href="https://kxgelcwkfpyjytwhocst.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.variable} font-sans antialiased overflow-hidden`}>
        <ThemeProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: "var(--card)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
                backdropFilter: "blur(12px)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
