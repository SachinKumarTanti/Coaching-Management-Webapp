import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaPrompt } from "@/components/shared/PwaPrompt";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-512.svg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("lcc-theme");var d=window.matchMedia("(prefers-color-scheme: dark)").matches;if(t==="dark"||((!t||t==="system")&&d)){document.documentElement.classList.add("dark");}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-accent selection:text-slate-950 transition-colors duration-150">
        <ThemeProvider>
          {children}
          <PwaPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}
