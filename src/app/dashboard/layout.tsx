import Link from "next/link";
import { redirect } from "next/navigation";
import {
  GraduationCap,
  Home,
  BookOpen,
  FileText,
  User,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { BottomNav } from "@/components/shared/BottomNav";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If supabase is not yet connected (e.g. placeholder build), provide fallback
  let profile = {
    full_name: "Student",
    role: "student",
  };

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single();

    if (data) {
      profile = data;
    }
  }

  const navLinks = [
    { name: "Overview", href: "/dashboard", icon: Home },
    { name: "My Courses", href: "/dashboard/courses", icon: BookOpen },
    { name: "Study Notes & PDFs", href: "/dashboard/materials", icon: FileText },
    { name: "My Profile", href: "/dashboard/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white border-r border-slate-200">
        {/* Brand */}
        <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-accent shadow-sm">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-primary leading-tight">
              Laxmi Classes
            </h2>
            <p className="text-xs font-semibold text-accent">Student Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 px-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-primary hover:bg-blue-50 transition-colors"
              >
                <Icon className="h-5 w-5 text-slate-500" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {profile.role === "admin" && (
            <div className="pt-4 border-t border-slate-100 mt-4">
              <Link
                href="/admin"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                <span>Switch to Admin Panel</span>
              </Link>
            </div>
          )}
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <p className="text-sm font-bold text-slate-900 truncate">
                {profile.full_name}
              </p>
              <p className="text-xs text-slate-500 capitalize">{profile.role}</p>
            </div>
            <form action="/auth/callback" method="GET">
              <Link
                href="/"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-colors"
                title="Go to Website"
              >
                <Home className="h-4 w-4" />
              </Link>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary text-accent flex items-center justify-center font-bold">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold text-primary">Laxmi Classes</span>
          </Link>
          <div className="flex items-center space-x-2">
            {profile.role === "admin" && (
              <Link
                href="/admin"
                className="px-2 py-1 rounded text-xs font-bold bg-indigo-100 text-indigo-700"
              >
                Admin
              </Link>
            )}
            <Link
              href="/"
              className="text-xs font-medium text-slate-600 hover:text-primary"
            >
              Public Site
            </Link>
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
