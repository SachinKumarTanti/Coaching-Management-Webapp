import Link from "next/link";
import { BookOpen, FileText, ArrowRight, Calendar, Sparkles, Send } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CourseJoinButton } from "@/components/courses/CourseJoinButton";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export default async function StudentCoursesPage() {
  const user = await getCurrentUser();

  let enrolledCourses: any[] = [];
  let availableCourses: any[] = [];
  let userRequests: Record<string, "pending" | "approved" | "rejected"> = {};

  if (user) {
    const supabase = createClient();

    const [enrollmentsRes, allCoursesRes, requestsRes] = await Promise.all([
      supabase
        .from("enrollments")
        .select(`
          id,
          created_at,
          courses (
            id,
            title,
            description,
            category,
            is_active
          )
        `)
        .eq("student_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("courses")
        .select("*")
        .eq("is_active", true)
        .order("title"),
      supabase
        .from("course_requests")
        .select("id, course_id, status")
        .eq("student_id", user.id),
    ]);

    if (enrollmentsRes.data) {
      enrolledCourses = enrollmentsRes.data;
    }

    if (requestsRes.data) {
      requestsRes.data.forEach((r: any) => {
        userRequests[r.course_id] = r.status;
      });
    }

    const enrolledCourseIds = new Set(
      enrolledCourses.map((item) => item.courses?.id).filter(Boolean)
    );

    if (allCoursesRes.data) {
      // Filter courses student is not already enrolled in
      availableCourses = allCoursesRes.data.filter(
        (c) => !enrolledCourseIds.has(c.id)
      );
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            My Courses & Batches
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            View your enrolled classes or request admission into new examination batches
          </p>
        </div>
        <Link href="/courses">
          <Button variant="outline" size="sm" className="gap-1.5 self-start">
            <span>Browse Public Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* 1. Enrolled Batches Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary dark:text-accent" />
            <span>Enrolled Batches ({enrolledCourses.length})</span>
          </h2>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCourses.map((item) => {
              const course = item.courses;
              if (!course) return null;

              return (
                <Card
                  key={item.id}
                  className="flex flex-col justify-between hover:border-primary/40 dark:hover:border-accent/40 transition-all shadow-sm"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant="secondary">{course.category || "General"}</Badge>
                      <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-accent" />
                        Enrolled: {formatDate(item.created_at)}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
                      {course.description}
                    </CardDescription>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        Instructor: Vishal Sir
                      </span>
                      <Link href={`/dashboard/materials?courseId=${course.id}`}>
                        <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                          <FileText className="h-3.5 w-3.5" />
                          <span>View Study Notes</span>
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950 text-primary dark:text-blue-300 mx-auto flex items-center justify-center">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No active enrollments yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Explore our available batches below and click &quot;Request to Join Batch&quot; to apply. Vishal Sir will review and approve your enrollment.
            </p>
          </div>
        )}
      </div>

      {/* 2. Available Batches to Request Join */}
      {availableCourses.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <span>Available Batches to Join ({availableCourses.length})</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select a course you want to prepare for and submit a join request to Vishal Sir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.map((course) => {
              const rawStatus = userRequests[course.id];
              const requestStatus = rawStatus === "approved" ? "enrolled" : (rawStatus || "none");

              return (
                <Card
                  key={course.id}
                  className="flex flex-col justify-between hover:border-primary/40 dark:hover:border-accent/40 transition-all shadow-sm"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant="secondary">{course.category || "General"}</Badge>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        Admissions Open
                      </span>
                    </div>
                    <CardTitle className="text-base sm:text-lg line-clamp-2">
                      {course.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                    <CardDescription className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
                      {course.description}
                    </CardDescription>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <Link
                        href={`/courses/${course.id}`}
                        className="text-xs font-semibold text-primary dark:text-blue-400 hover:underline"
                      >
                        Details &rarr;
                      </Link>

                      <CourseJoinButton
                        courseId={course.id}
                        courseTitle={course.title}
                        initialStatus={requestStatus}
                        isLoggedIn={true}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
