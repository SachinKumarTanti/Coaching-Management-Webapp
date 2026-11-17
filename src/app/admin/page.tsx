import Link from "next/link";
import {
  BookOpen,
  Users,
  FileText,
  Bell,
  PlusCircle,
  Upload,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = createClient();

  let coursesCount = 0;
  let studentsCount = 0;
  let materialsCount = 0;
  let announcementsCount = 0;
  let pendingRequestsCount = 0;

  try {
    const [coursesRes, studentsRes, materialsRes, announcementsRes, requestsRes] = await Promise.all([
      supabase.from("courses").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
      supabase.from("study_materials").select("id", { count: "exact", head: true }),
      supabase.from("announcements").select("id", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("course_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
    ]);

    coursesCount = coursesRes.count || 0;
    studentsCount = studentsRes.count || 0;
    materialsCount = materialsRes.count || 0;
    announcementsCount = announcementsRes.count || 0;
    pendingRequestsCount = requestsRes.count || 0;
  } catch {
    // Keep 0
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Control Center
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Vishal Sir&apos;s Administration Panel
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Laxmi Competition Classes • Sangrampur center management
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/courses">
            <Button size="sm" variant="primary" className="gap-1.5 text-xs">
              <PlusCircle className="h-4 w-4" />
              Manage Courses
            </Button>
          </Link>
          <Link href="/admin/materials">
            <Button size="sm" variant="accent" className="gap-1.5 text-xs">
              <Upload className="h-4 w-4" />
              Upload PDF
            </Button>
          </Link>
        </div>
      </div>

      {/* Pending Course Requests Alert */}
      {pendingRequestsCount > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/80 dark:bg-amber-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent text-slate-950 flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {pendingRequestsCount} Pending Course Join Request{pendingRequestsCount > 1 ? "s" : ""}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Students have applied to join examination batches and are awaiting your approval.
              </p>
            </div>
          </div>
          <Link href="/admin/students" className="self-start sm:self-auto">
            <Button size="sm" variant="accent" className="font-bold gap-1 text-xs shadow-sm">
              <span>Review & Accept</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4 sm:p-5 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-primary dark:text-blue-300 flex items-center justify-center font-bold flex-shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{coursesCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Courses</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <CardContent className="p-4 sm:p-5 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold flex-shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{studentsCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Registered Students</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4 sm:p-5 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold flex-shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{materialsCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Uploaded Notes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardContent className="p-4 sm:p-5 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold flex-shrink-0">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{announcementsCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Notices</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course & Student Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary dark:text-blue-400" />
              Academic Operations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/admin/courses"
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Course Batches</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Create batches, edit descriptions, toggle active state</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </Link>

            <Link
              href="/admin/students"
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Student Enrollments</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Assign students to courses & grant digital note access</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </Link>
          </CardContent>
        </Card>

        {/* Content & Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              Content & Communication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/admin/materials"
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Study Materials & PDFs</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Upload and manage course PDFs and problem sheets</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </Link>

            <Link
              href="/admin/announcements"
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Notices & Broadcasts</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Publish alerts for mock tests, holiday updates & admissions</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
