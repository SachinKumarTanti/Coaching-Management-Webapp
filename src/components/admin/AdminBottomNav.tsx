"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Users,
  Bell,
  GraduationCap,
  ArrowLeft,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  Moon,
  Sun,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/components/theme/ThemeProvider";

interface AdminBottomNavProps {
  adminName?: string;
}

export function AdminBottomNav({ adminName = "Admin" }: AdminBottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // Close drawer on path change
  React.useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  React.useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [drawerOpen]);

  const handleLogout = async () => {
    setLoggingOut(true);
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
      setLoggingOut(false);
    }
  };

  const navItems = [
    {
      label: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Courses",
      href: "/admin/courses",
      icon: BookOpen,
      exact: false,
    },
    {
      label: "Materials",
      href: "/admin/materials",
      icon: FileText,
      exact: false,
    },
    {
      label: "Students",
      href: "/admin/students",
      icon: Users,
      exact: false,
    },
  ];

  const isMoreActive =
    pathname.startsWith("/admin/announcements") ||
    pathname.startsWith("/admin/feedback") ||
    drawerOpen;

  return (
    <>
      {/* Mobile Bottom Dock (md:hidden) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-1 shadow-2xl safe-bottom">
        <div className="grid grid-cols-5 items-center">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-xs font-semibold transition-colors min-h-[50px]",
                  isActive
                    ? "text-accent font-bold"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 mb-0.5",
                    isActive ? "stroke-[2.5]" : "stroke-[1.75]"
                  )}
                />
                <span className="truncate max-w-[65px] text-[11px]">
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* 5th slot: More / Actions Drawer */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-xs font-semibold transition-colors min-h-[50px]",
              isMoreActive
                ? "text-accent font-bold"
                : "text-slate-400 hover:text-slate-200"
            )}
            aria-label="Open admin menu"
          >
            <Menu className="h-5 w-5 mb-0.5 stroke-[2]" />
            <span className="text-[11px]">More</span>
          </button>
        </div>
      </nav>

      {/* Admin Slide-up Drawer / Action Sheet */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div className="relative z-50 w-full bg-slate-900 border-t border-slate-800 rounded-t-2xl p-5 shadow-2xl text-white space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="h-9 w-9 rounded-lg bg-accent text-slate-950 flex items-center justify-center font-bold">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">Admin Menu</h3>
                  <p className="text-xs text-slate-400 truncate max-w-[200px]">
                    {adminName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Links */}
            <div className="space-y-1">
              <Link
                href="/admin/announcements"
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors",
                  pathname.startsWith("/admin/announcements")
                    ? "bg-slate-800 text-accent"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Bell className="h-5 w-5 text-accent" />
                <span>Manage Announcements</span>
              </Link>

              <Link
                href="/admin/feedback"
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors",
                  pathname.startsWith("/admin/feedback")
                    ? "bg-slate-800 text-accent"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <MessageSquare className="h-5 w-5 text-accent" />
                <span>Reviews & Bug Reports</span>
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <GraduationCap className="h-5 w-5 text-blue-400" />
                <span>Switch to Student View</span>
              </Link>

              <Link
                href="/"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-emerald-400" />
                <span>Public Website</span>
              </Link>
            </div>

            {/* Preferences & Logout */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-xs font-medium text-slate-300">Theme</span>
                <button
                  type="button"
                  onClick={() =>
                    setTheme(resolvedTheme === "dark" ? "light" : "dark")
                  }
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-800 text-xs font-semibold text-slate-200 hover:text-white"
                >
                  {resolvedTheme === "dark" ? (
                    <>
                      <Sun className="h-3.5 w-3.5 text-amber-400" />
                      <span>Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Dark</span>
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>{loggingOut ? "Signing out..." : "Sign Out as Admin"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
