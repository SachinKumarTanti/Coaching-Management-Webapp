"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  className?: string;
  variant?: "icon" | "button" | "menu-item";
  label?: string;
}

export function LogoutButton({
  className,
  variant = "icon",
  label = "Sign Out",
}: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      try {
        sessionStorage.removeItem("lcc_user_role");
      } catch {
        // Ignore
      }
      router.push("/login");
      router.refresh();
    } catch {
      setLoading(false);
    }
  };

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className={cn(
          "inline-flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors disabled:opacity-50",
          className
        )}
      >
        <LogOut className="h-4 w-4" />
        <span>{loading ? "Signing out..." : label}</span>
      </button>
    );
  }

  if (variant === "menu-item") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className={cn(
          "flex items-center space-x-2 w-full px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors disabled:opacity-50",
          className
        )}
      >
        <LogOut className="h-4 w-4" />
        <span>{loading ? "Signing out..." : label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={cn(
        "p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50",
        className
      )}
      title="Sign Out"
      aria-label="Sign Out"
    >
      <LogOut className="h-4 w-4" />
    </button>
  );
}
