import Link from "next/link";
import { BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

const defaultCourses = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    title: "General Competition Foundation Batch",
    description: "Complete preparation for SSC, Railway, Banking, and State exams with daily practice sheets and concept building by Vishal Sir.",
    category: "Foundation",
    is_active: true,
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    title: "SSC CGL / CHSL Special Batch",
    description: "Targeted course covering Advanced Mathematics, Reasoning, English comprehension, and General Studies with past 10 years question analysis.",
    category: "SSC",
    is_active: true,
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    title: "Railway NTPC & Group D Crash Course",
    description: "Fast-track revision batch with focus on General Science, Numerical Ability, and Mock Tests designed for upcoming Railway recruitment.",
    category: "Railway",
    is_active: true,
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    title: "Bihar Police & Daroga (SI) Special",
    description: "Dedicated preparation for Bihar Police Constable and Sub-Inspector exams with specialized GS and current affairs modules.",
    category: "State Exams",
    is_active: true,
  },
];

export default async function CoursesPage() {
  let courses = defaultCourses;

  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("courses")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      courses = data;
    }
  } catch {
    // Keep default
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <Badge variant="warning" className="uppercase tracking-wider">
            Targeted Learning
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Our Available Courses & Batches
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Structured batches designed specifically for competitive exams by Vishal Sir in Sangrampur.
          </p>
        </div>
      </section>

      {/* Courses List */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="flex flex-col hover:border-primary/40 hover:shadow-md transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="secondary">{course.category || "General"}</Badge>
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Enrollment Open
                    </span>
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                  <CardDescription className="text-slate-600 leading-relaxed text-sm">
                    {course.description}
                  </CardDescription>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Sangrampur Center</span>
                    <Link href={`/courses/${course.id}`}>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <span>Details</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Admission Notice */}
          <div className="mt-12 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 text-center max-w-3xl mx-auto space-y-3">
            <h3 className="text-lg font-bold text-slate-900">How to Enroll in a Batch?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              New admissions and batch timings are finalized directly at the Sangrampur center. After offline registration, Vishal Sir or center staff will activate your digital course access in your Student Dashboard.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/register">
                <Button variant="primary">Create Student Account</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">Contact Center</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
