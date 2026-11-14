import { createClient } from "@/lib/supabase/server";
import { CoursesManager } from "./CoursesManager";

export default async function AdminCoursesPage() {
  const supabase = createClient();
  const [coursesRes, enrollmentsRes] = await Promise.all([
    supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase.from("enrollments").select("course_id"),
  ]);

  const initialCourses = coursesRes.data || [];
  const initialEnrollmentCounts: Record<string, number> = {};

  if (enrollmentsRes.data) {
    enrollmentsRes.data.forEach((e) => {
      initialEnrollmentCounts[e.course_id] =
        (initialEnrollmentCounts[e.course_id] || 0) + 1;
    });
  }

  return (
    <CoursesManager
      initialCourses={initialCourses}
      initialEnrollmentCounts={initialEnrollmentCounts}
    />
  );
}
