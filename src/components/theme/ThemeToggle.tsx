"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "icon" | "pill";
}

export function ThemeToggle({ className, variant = "icon" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className={cn(
          "inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:text-slate-900 transition-colors",
          className
        )}
        aria-label="Toggle theme"
      >
        <span className="h-4 w-4" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={cn(
          "flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors",
          isDark
            ? "bg-slate-800 text-amber-300 hover:bg-slate-700"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200",
          className
        )}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? (
          <>
            <Sun className="h-4 w-4 text-amber-400 animate-in spin-in-180 duration-200" />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="h-4 w-4 text-indigo-600 animate-in spin-in-180 duration-200" />
            <span>Dark Mode</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "inline-flex items-center justify-center rounded-lg p-2 transition-colors",
        "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800",
        className
      )}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform active:scale-90" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 dark:text-slate-300 transition-transform active:scale-90" />
      )}
    </button>
  );
}
