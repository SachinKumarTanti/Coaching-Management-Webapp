import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock, Calendar, Users, PhoneCall, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

interface CoursePageProps {
  params: {
    id: string;
  };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  let course: any = null;

  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("courses")
      .select("*")
      .eq("id", params.id)
      .single();

    course = data;
  } catch {
    //
  }

  // Fallback match if using dummy UUID
  if (!course) {
    if (params.id.startsWith("00000000") || params.id.startsWith("c")) {
      course = {
        id: params.id,
        title: "Competitive Examination Prep Batch",
        description: "Comprehensive coaching designed for all central and state level competitive tests with dedicated guidance by Vishal Sir.",
        category: "General",
        is_active: true,
      };
    } else {
      notFound();
    }
  }

  return (
    <div className="flex flex-col py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to all courses</span>
        </Link>

        {/* Course Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{course.category || "General"}</Badge>
            <Badge variant="success">Admissions Open</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            {course.title}
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            {course.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-sm">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Instructor</span>
              <strong className="text-slate-900">Vishal Sir</strong>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Location</span>
              <strong className="text-slate-900">Sangrampur</strong>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Mode</span>
              <strong className="text-slate-900">Offline + Digital PDF</strong>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Tests</span>
              <strong className="text-slate-900">Weekly Offline</strong>
            </div>
          </div>
        </div>

        {/* Syllabus & What's included */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What You Will Learn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Foundation to advanced speed mathematics & shortcuts</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Logical, verbal & analytical reasoning puzzles</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>High-yield General Studies (History, Polity, Geography, Science)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Current affairs analysis & monthly revision capsules</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Batch Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Digital PDF Notes in Student Portal</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Daily practice sheets (DPP) with solutions</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Special Sunday mock tests under exam conditions</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>One-on-one doubt discussions directly with Vishal Sir</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enrollment action box */}
        <div className="bg-primary text-white rounded-2xl p-6 sm:p-8 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold">Interested in joining this batch?</h2>
          <p className="text-slate-200 text-sm max-w-lg mx-auto">
            Create your student account online to get ready, then visit our Sangrampur coaching center to complete your batch enrollment.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link href="/register">
              <Button size="lg" variant="accent" className="w-full sm:w-auto">
                Register Student Account
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20">
                Contact Vishal Sir
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
