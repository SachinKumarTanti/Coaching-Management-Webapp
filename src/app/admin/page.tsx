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

  try {
    const [coursesRes, studentsRes, materialsRes, announcementsRes] = await Promise.all([
      supabase.from("courses").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
      supabase.from("study_materials").select("id", { count: "exact", head: true }),
      supabase.from("announcements").select("id", { count: "exact", head: true }).eq("is_published", true),
    ]);

    coursesCount = coursesRes.count || 0;
    studentsCount = studentsRes.count || 0;
    materialsCount = materialsRes.count || 0;
    announcementsCount = announcementsRes.count || 0;
  } catch {
    //
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Control Center
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Vishal Sir&apos;s Administration Panel
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
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

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4 sm:p-5 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-primary flex items-center justify-center font-bold flex-shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{coursesCount}</p>
              <p className="text-xs text-slate-500 font-medium">Total Courses</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <CardContent className="p-4 sm:p-5 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{studentsCount}</p>
              <p className="text-xs text-slate-500 font-medium">Registered Students</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4 sm:p-5 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold flex-shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{materialsCount}</p>
              <p className="text-xs text-slate-500 font-medium">Uploaded Notes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardContent className="p-4 sm:p-5 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold flex-shrink-0">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{announcementsCount}</p>
              <p className="text-xs text-slate-500 font-medium">Active Notices</p>
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
              <BookOpen className="h-5 w-5 text-primary" />
              Academic Operations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/admin/courses"
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div>
                <p className="text-sm font-bold text-slate-900">Course Batches</p>
                <p className="text-xs text-slate-500">Create batches, edit descriptions, toggle active state</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </Link>

            <Link
              href="/admin/students"
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div>
                <p className="text-sm font-bold text-slate-900">Student Enrollments</p>
                <p className="text-xs text-slate-500">Assign students to courses & grant digital note access</p>
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
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div>
                <p className="text-sm font-bold text-slate-900">Study Materials & PDFs</p>
                <p className="text-xs text-slate-500">Upload and manage course PDFs and problem sheets</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </Link>

            <Link
              href="/admin/announcements"
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div>
                <p className="text-sm font-bold text-slate-900">Notices & Broadcasts</p>
                <p className="text-xs text-slate-500">Publish alerts for mock tests, holiday updates & admissions</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
