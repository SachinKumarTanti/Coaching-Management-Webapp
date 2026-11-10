import Link from "next/link";
import {
  ShieldCheck,
  BookOpen,
  Bell,
  FileText,
  Users,
  LayoutDashboard,
  LogOut,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let adminName = "Vishal Sir / Admin";

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (data?.full_name) {
      adminName = data.full_name;
    }
  }

  const adminNav = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Courses", href: "/admin/courses", icon: BookOpen },
    { name: "Announcements", href: "/admin/announcements", icon: Bell },
    { name: "Study Materials", href: "/admin/materials", icon: FileText },
    { name: "Students & Enrollments", href: "/admin/students", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Desktop Admin Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-slate-900 text-white">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-slate-950 font-bold shadow">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white leading-tight">
              Laxmi Classes
            </h2>
            <p className="text-xs font-semibold text-accent">Admin Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 px-4 space-y-1">
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Icon className="h-5 w-5 text-accent" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-6 border-t border-slate-800 mt-6 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <GraduationCap className="h-4 w-4" />
              <span>View as Student</span>
            </Link>
            <Link
              href="/"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Public Website</span>
            </Link>
          </div>
        </div>

        {/* Admin profile */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <p className="text-xs text-slate-400">Signed in as</p>
          <p className="text-sm font-bold text-white truncate">{adminName}</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-6">
        {/* Mobile Header & Horizontal Nav */}
        <header className="md:hidden bg-slate-900 text-white p-4 border-b border-slate-800 sticky top-0 z-30 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-6 w-6 text-accent" />
              <span className="font-extrabold text-sm">LCC Admin Panel</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <Link
                href="/dashboard"
                className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white"
              >
                Student View
              </Link>
              <Link
                href="/"
                className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white"
              >
                Site
              </Link>
            </div>
          </div>

          {/* Horizontal scrollable nav for mobile admin */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 whitespace-nowrap flex-shrink-0"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
