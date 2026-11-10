"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: Home,
      exact: true,
    },
    {
      label: "My Courses",
      href: "/dashboard/courses",
      icon: BookOpen,
      exact: false,
    },
    {
      label: "Study Notes",
      href: "/dashboard/materials",
      icon: FileText,
      exact: false,
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: User,
      exact: false,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 px-2 py-1 shadow-lg safe-bottom">
      <div className="grid grid-cols-4 items-center">
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
                "flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-xs font-medium transition-colors min-h-[50px]",
                isActive
                  ? "text-primary font-bold"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Icon className={cn("h-5 w-5 mb-0.5", isActive ? "stroke-[2.5]" : "stroke-[1.75]")} />
              <span className="truncate max-w-[70px] text-[11px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
