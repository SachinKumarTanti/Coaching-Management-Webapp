"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, BookOpen, User, LogOut, ShieldCheck, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { createClient } from "@/lib/supabase/client";
import { UserRole } from "@/types/database.types";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [user, setUser] = React.useState<{ id: string; email?: string } | null>(null);
  const [userRole, setUserRole] = React.useState<UserRole | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const supabase = createClient();

    // Check client storage cache for instantaneous display
    try {
      const cachedRole = sessionStorage.getItem("lcc_user_role") as UserRole | null;
      if (cachedRole) {
        setUserRole(cachedRole);
      }
    } catch {
      // Ignore storage restrictions
    }

    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email });
          
          // Check cached role first
          let role: UserRole = "student";
          try {
            const cached = sessionStorage.getItem("lcc_user_role") as UserRole | null;
            if (cached) {
              role = cached;
            }
          } catch {
            //
          }

          // If not cached, fetch once and cache in sessionStorage
          if (!sessionStorage.getItem("lcc_user_role")) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", session.user.id)
              .single();
            if (profile?.role) {
              role = profile.role;
              try {
                sessionStorage.setItem("lcc_user_role", role);
              } catch {
                //
              }
            }
          }
          setUserRole(role);
        } else {
          setUser(null);
          setUserRole(null);
          try {
            sessionStorage.removeItem("lcc_user_role");
          } catch {
            //
          }
        }
      } catch {
        // Fallback for offline / placeholder
      } finally {
        setLoading(false);
      }
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email });
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", session.user.id)
              .single();
            const role = profile?.role || "student";
            setUserRole(role);
            sessionStorage.setItem("lcc_user_role", role);
          } catch {
            //
          }
        } else {
          setUser(null);
          setUserRole(null);
          try {
            sessionStorage.removeItem("lcc_user_role");
          } catch {
            //
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("lcc_user_role");
    } catch {
      //
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setUserRole(null);
    setMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Announcements", href: "/announcements" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur shadow-sm transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-accent shadow-sm">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black tracking-tight text-primary dark:text-white leading-tight">
              Laxmi Competition Classes
            </span>
            <span className="text-xs font-semibold text-accent leading-none">
              Sangrampur • By Vishal Sir
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                  isActive
                    ? "text-primary dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/50 font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth CTAs */}
        <div className="hidden md:flex items-center space-x-3 min-w-[140px] justify-end">
          <ThemeToggle />
          {loading ? (
            <div className="h-9 w-28 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
          ) : user ? (
                <div className="flex items-center space-x-2">
                  {userRole === "admin" && (
                    <Link href="/admin">
                      <Button variant="outline" size="sm" className="gap-1.5 border-primary/30 text-primary dark:text-blue-400">
                        <ShieldCheck className="h-4 w-4" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Link href="/dashboard">
                    <Button variant="primary" size="sm" className="gap-1.5">
                      <BookOpen className="h-4 w-4" />
                      Student Portal
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-slate-500 hover:text-rose-600 dark:hover:text-rose-400"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="accent" size="sm">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
        </div>

        {/* Mobile Header Actions */}
        <div className="flex items-center space-x-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none min-h-[44px] min-w-[44px]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 text-base font-semibold rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/50 text-primary dark:text-blue-400 font-bold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col space-y-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="primary" className="w-full gap-2">
                    <BookOpen className="h-4 w-4" />
                    My Student Dashboard
                  </Button>
                </Link>
                {userRole === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full gap-2 border-primary/30 text-primary dark:text-blue-400">
                      <ShieldCheck className="h-4 w-4" />
                      Admin Control Panel
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-center text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="accent" className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
