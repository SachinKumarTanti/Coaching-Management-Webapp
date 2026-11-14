import { createClient } from "@/lib/supabase/server";
import { StudentsManager } from "./StudentsManager";

export default async function AdminStudentsPage() {
  const supabase = createClient();

  const [profilesRes, coursesRes] = await Promise.all([
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
  ]);

  const initialStudents = (profilesRes.data || []) as any;
  const initialCourses = coursesRes.data || [];

  return (
    <StudentsManager
      initialStudents={initialStudents}
      initialCourses={initialCourses}
    />
  );
}
