import Link from "next/link";
import {
  BookOpen,
  FileText,
  Bell,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export default async function StudentDashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let studentName = "Student";
  let enrolledCourses: any[] = [];
  let recentAnnouncements: any[] = [];
  let availableMaterialsCount = 0;

  if (user) {
    // 1. Fetch Profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (profile?.full_name) {
      studentName = profile.full_name;
    }

    // 2. Fetch Enrolled Courses
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select(`
        id,
        created_at,
        courses (
          id,
          title,
          description,
          category
        )
      `)
      .eq("student_id", user.id);

    if (enrollments) {
      enrolledCourses = enrollments
        .map((e: any) => e.courses)
        .filter(Boolean);
    }

    // 3. Fetch count of accessible materials
    if (enrolledCourses.length > 0) {
      const courseIds = enrolledCourses.map((c: any) => c.id);
      const { count } = await supabase
        .from("study_materials")
        .select("id", { count: "exact", head: true })
        .in("course_id", courseIds);
      availableMaterialsCount = count || 0;
    }

    // 4. Fetch Recent Announcements
    const { data: announcements } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(3);

    if (announcements) {
      recentAnnouncements = announcements;
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-blue-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-3 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-6 translate-y-6">
          <BookOpen className="w-56 h-56 text-white" />
        </div>

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Laxmi Classes Student Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {studentName}!
          </h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-xl leading-relaxed">
            Track your enrolled competitive examination batches, study sheets, and latest center updates from Vishal Sir.
          </p>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 text-primary flex items-center justify-center font-bold flex-shrink-0">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-slate-900">
                {enrolledCourses.length}
              </p>
              <p className="text-xs text-slate-500 font-medium">Enrolled Courses</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold flex-shrink-0">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-slate-900">
                {availableMaterialsCount}
              </p>
              <p className="text-xs text-slate-500 font-medium">Study PDFs</p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 md:col-span-1">
          <CardContent className="p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
              <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-slate-900">
                {recentAnnouncements.length}
              </p>
              <p className="text-xs text-slate-500 font-medium">Recent Notices</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: My Courses & Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Left 2 Cols: Enrolled Courses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              My Enrolled Batches
            </h2>
            {enrolledCourses.length > 0 && (
              <Link
                href="/dashboard/courses"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View all
              </Link>
            )}
          </div>

          {enrolledCourses.length > 0 ? (
            <div className="space-y-3">
              {enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{course.category || "Foundation"}</Badge>
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Active
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {course.description}
                    </p>
                  </div>
                  <Link href={`/dashboard/materials?courseId=${course.id}`} className="flex-shrink-0">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto gap-1.5 text-xs">
                      <FileText className="h-3.5 w-3.5 text-accent" />
                      Study Materials
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-primary mx-auto flex items-center justify-center">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No active course enrollments yet
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                When you register for a batch at the Sangrampur center, Vishal Sir or center staff will activate your enrollment here.
              </p>
              <div className="pt-2">
                <Link href="/courses">
                  <Button variant="outline" size="sm">
                    Browse All Available Courses
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Recent Announcements */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Notices from Vishal Sir
            </h2>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            {recentAnnouncements.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentAnnouncements.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span>Sangrampur Center</span>
                      <span>{formatDate(item.published_at)}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">
                No new notices posted at this moment.
              </p>
            )}

            <div className="pt-2 border-t border-slate-100">
              <Link href="/announcements" className="w-full">
                <Button variant="ghost" size="sm" className="w-full text-xs text-primary justify-between">
                  <span>View All Public Notices</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
