"use client";

import * as React from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = React.useState(false);

  React.useEffect(() => {
    // Check if dismissed before
    const dismissed = localStorage.getItem("lcc_pwa_dismissed");
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("lcc_pwa_dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <aside
      aria-label="App installation banner"
      className="fixed bottom-16 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300"
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-accent text-slate-950 flex items-center justify-center flex-shrink-0 font-bold">
          <Download className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold leading-tight">Install Laxmi Classes App</h4>
          <p className="text-xs text-slate-300">Quick 1-tap access on your Android phone</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0">
        <Button
          size="sm"
          variant="accent"
          onClick={handleInstallClick}
          className="text-xs h-8 px-2.5 min-h-[34px]"
        >
          Install
        </Button>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-md"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
