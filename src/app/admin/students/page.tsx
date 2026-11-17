import { createClient } from "@/lib/supabase/server";
import { StudentsManager } from "./StudentsManager";

export default async function AdminStudentsPage() {
  const supabase = createClient();

  let initialStudents: any[] = [];
  let initialCourses: any[] = [];
  let initialRequests: any[] = [];

  try {
    const [profilesRes, coursesRes, requestsRes] = await Promise.all([
      supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          phone,
          role,
          created_at,
          enrollments (
            id,
            course_id,
            courses (
              id,
              title
            )
          )
        `)
        .order("created_at", { ascending: false }),
      supabase.from("courses").select("*").eq("is_active", true).order("title"),
      supabase
        .from("course_requests")
        .select(`
          id,
          student_id,
          course_id,
          status,
          created_at,
          profiles (
            id,
            full_name,
            phone
          ),
          courses (
            id,
            title,
            category
          )
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false }),
    ]);

    initialStudents = (profilesRes.data || []) as any;
    initialCourses = coursesRes.data || [];
    initialRequests = (requestsRes.data || []) as any;
  } catch {
    // Keep empty fallbacks if table pending migration
  }

  return (
    <StudentsManager
      initialStudents={initialStudents}
      initialCourses={initialCourses}
      initialRequests={initialRequests}
    />
  );
}
