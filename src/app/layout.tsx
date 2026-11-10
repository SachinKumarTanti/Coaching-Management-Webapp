import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaPrompt } from "@/components/shared/PwaPrompt";

export const metadata: Metadata = {
  title: "Laxmi Competition Classes - Sangrampur | Vishal Sir",
  description:
    "Official website and student portal for Laxmi Competition Classes, Sangrampur. Best coaching for SSC, Railway, State Exams, and Banking directed by Vishal Sir.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-512.svg",
  },
  applicationName: "Laxmi Classes",
  authors: [{ name: "Vishal Sir" }],
  keywords: [
    "Laxmi Competition Classes",
    "Sangrampur Coaching",
    "Vishal Sir",
    "SSC Coaching Sangrampur",
    "Railway Coaching Sangrampur",
    "Bihar Daroga Coaching",
  ],
};

export const viewport: Viewport = {
  themeColor: "#1e3a8a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-512.svg" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-accent selection:text-slate-950">
        {children}
        <PwaPrompt />
      </body>
    </html>
  );
}
