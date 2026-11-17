import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Calendar,
  Users,
  PhoneCall,
  BookOpen,
  Send,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CourseJoinButton } from "@/components/courses/CourseJoinButton";
import { createPublicClient, createClient, getCurrentUser } from "@/lib/supabase/server";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const supabase = createPublicClient();
    const { data: courses } = await supabase
      .from("courses")
      .select("id")
      .eq("is_active", true);

    return (courses || []).map((course) => ({
      id: course.id,
    }));
  } catch {
    return [];
  }
}

interface CoursePageProps {
  params: {
    id: string;
  };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  let course: any = null;
  const user = await getCurrentUser();
  let enrollmentStatus: "enrolled" | "pending" | "rejected" | "none" = "none";

  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("courses")
      .select("id, title, description, category, is_active")
      .eq("id", params.id)
      .single();

    course = data;

    if (user && course) {
      const authClient = createClient();
      const [enrollmentRes, requestRes] = await Promise.all([
        authClient
          .from("enrollments")
          .select("id")
          .eq("student_id", user.id)
          .eq("course_id", course.id)
          .maybeSingle(),
        authClient
          .from("course_requests")
          .select("id, status")
          .eq("student_id", user.id)
          .eq("course_id", course.id)
          .maybeSingle(),
      ]);

      if (enrollmentRes.data) {
        enrollmentStatus = "enrolled";
      } else if (requestRes.data?.status === "pending") {
        enrollmentStatus = "pending";
      } else if (requestRes.data?.status === "rejected") {
        enrollmentStatus = "rejected";
      }
    }
  } catch {
    //
  }

  // Fallback match if using dummy UUID
  if (!course) {
    if (params.id.startsWith("00000000") || params.id.startsWith("c")) {
      course = {
        id: params.id,
        title: "Competitive Examination Prep Batch",
        description:
          "Comprehensive coaching designed for all central and state level competitive tests with dedicated guidance by Vishal Sir.",
        category: "General",
        is_active: true,
      };
    } else {
      notFound();
    }
  }

  return (
    <div className="flex flex-col py-8 sm:py-12 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to all courses</span>
        </Link>

        {/* Course Header */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{course.category || "General"}</Badge>
              <Badge variant="success">Admissions Open</Badge>
            </div>
            {enrollmentStatus === "enrolled" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                Active Student
              </span>
            )}
            {enrollmentStatus === "pending" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                <Clock className="h-4 w-4 text-accent animate-pulse" />
                Request Pending Review
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {course.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
            {course.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm">
            <div>
              <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">Instructor</span>
              <strong className="text-slate-900 dark:text-white">Vishal Sir</strong>
            </div>
            <div>
              <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">Location</span>
              <strong className="text-slate-900 dark:text-white">Sangrampur</strong>
            </div>
            <div>
              <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">Mode</span>
              <strong className="text-slate-900 dark:text-white">Offline + Digital PDF</strong>
            </div>
            <div>
              <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">Tests</span>
              <strong className="text-slate-900 dark:text-white">Weekly Offline</strong>
            </div>
          </div>
        </div>

        {/* Syllabus & Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What You Will Learn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Foundation to advanced speed mathematics & shortcuts</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Logical, verbal & analytical reasoning puzzles</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>High-yield General Studies (History, Polity, Geography, Science)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Current affairs analysis & monthly revision capsules</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Batch Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Digital PDF Notes in Student Portal</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Daily practice sheets (DPP) with solutions</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Special Sunday mock tests under exam conditions</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>One-on-one doubt discussions directly with Vishal Sir</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enrollment Action Box */}
        <div className="bg-primary text-white rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-lg">
          {enrollmentStatus === "enrolled" ? (
            <>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="h-4 w-4" />
                <span>You are already enrolled</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">Access Your Course Study Notes</h2>
              <p className="text-slate-200 text-sm max-w-lg mx-auto">
                Your admission is active. You can view all chapter notes, formula sheets, and practice sets right now.
              </p>
              <div className="pt-2">
                <Link href={`/dashboard/materials?courseId=${course.id}`}>
                  <Button size="lg" variant="accent" className="gap-2 font-bold shadow">
                    <FileText className="h-5 w-5" />
                    <span>Open Study Materials</span>
                  </Button>
                </Link>
              </div>
            </>
          ) : enrollmentStatus === "pending" ? (
            <>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3.5 py-1 text-xs font-semibold text-accent border border-amber-500/30">
                <Clock className="h-4 w-4 animate-pulse" />
                <span>Join Request Submitted</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">Awaiting Vishal Sir&apos;s Review</h2>
              <p className="text-slate-200 text-sm max-w-lg mx-auto">
                Your request to join this batch has been sent to the center admin. Once approved, course notes and mock tests will unlock on your dashboard.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/dashboard/courses">
                  <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                    View My Batches
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="ghost" className="text-slate-200 hover:text-white">
                    Contact Sangrampur Center
                  </Button>
                </Link>
              </div>
            </>
          ) : user ? (
            <>
              <h2 className="text-xl sm:text-2xl font-bold">Ready to Prepare for this Examination?</h2>
              <p className="text-slate-200 text-sm max-w-lg mx-auto">
                Submit an instant join request to Vishal Sir. Once approved, you will gain full access to lecture notes, DPPs, and mock tests.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <CourseJoinButton
                  courseId={course.id}
                  courseTitle={course.title}
                  initialStatus="none"
                  isLoggedIn={true}
                />
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                    Contact Vishal Sir
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl sm:text-2xl font-bold">Interested in joining this batch?</h2>
              <p className="text-slate-200 text-sm max-w-lg mx-auto">
                Create your student account online or sign in to request admission into this batch directly from Vishal Sir.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <Link href="/register">
                  <Button size="lg" variant="accent" className="w-full sm:w-auto font-bold">
                    Register Student Account
                  </Button>
                </Link>
                <Link href={`/login?redirectTo=/courses/${course.id}`}>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20">
                    Sign In to Apply
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
