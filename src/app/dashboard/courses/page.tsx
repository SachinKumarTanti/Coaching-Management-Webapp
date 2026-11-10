import Link from "next/link";
import { BookOpen, FileText, ArrowRight, Calendar, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export default async function StudentCoursesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let enrolledCourses: any[] = [];

  if (user) {
    const { data } = await supabase
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
      .order("created_at", { ascending: false });

    if (data) {
      enrolledCourses = data;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            My Enrolled Courses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            All active batches you are currently participating in at Sangrampur center
          </p>
        </div>
        <Link href="/courses">
          <Button variant="outline" size="sm" className="gap-1.5 self-start">
            <span>Explore Other Courses</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrolledCourses.map((item) => {
            const course = item.courses;
            if (!course) return null;

            return (
              <Card key={item.id} className="flex flex-col justify-between hover:border-primary/40 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="secondary">{course.category || "General"}</Badge>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-accent" />
                      Enrolled: {formatDate(item.created_at)}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-slate-600 text-sm leading-relaxed">
                    {course.description}
                  </CardDescription>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-600">
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
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 sm:p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-primary mx-auto flex items-center justify-center">
            <BookOpen className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              You are not enrolled in any course yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              To join an offline batch and access digital notes, visit the Sangrampur center or contact Vishal Sir. Once enrolled, your batch will show up here immediately.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/courses">
              <Button variant="primary" size="sm">
                View Available Batches
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="sm">
                Contact Center
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
