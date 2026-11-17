import Link from "next/link";
import {
  GraduationCap,
  Home,
  BookOpen,
  FileText,
  User,
  ShieldCheck,
} from "lucide-react";
import { BottomNav } from "@/components/shared/BottomNav";
import { LogoutButton } from "@/components/shared/LogoutButton";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { getCurrentUser, getCurrentProfile } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // If supabase is not yet connected (e.g. placeholder build), provide fallback
  let profile = {
    full_name: "Student",
    role: "student",
  };

  if (user) {
    const data = await getCurrentProfile(user.id);
    if (data) {
      profile = {
        full_name: data.full_name,
        role: data.role,
      };
    }
  }

  const navLinks = [
    { name: "Overview", href: "/dashboard", icon: Home },
    { name: "My Courses", href: "/dashboard/courses", icon: BookOpen },
    { name: "Study Notes & PDFs", href: "/dashboard/materials", icon: FileText },
    { name: "My Profile", href: "/dashboard/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
        {/* Brand */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-accent shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-primary dark:text-white leading-tight">
                Laxmi Classes
              </h2>
              <p className="text-xs font-semibold text-accent">Student Portal</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 px-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {profile.role === "admin" && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
              <Link
                href="/admin"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span>Switch to Admin Panel</span>
              </Link>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
            <Link
              href="/"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Public Website</span>
            </Link>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {profile.full_name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{profile.role}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary text-accent flex items-center justify-center font-bold">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold text-primary dark:text-white">Laxmi Classes</span>
          </Link>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {profile.role === "admin" && (
              <Link
                href="/admin"
                className="px-2 py-1 rounded text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
              >
                Admin
              </Link>
            )}
            <LogoutButton />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation (Smartphones) */}
      <BottomNav />
    </div>
  );
}
