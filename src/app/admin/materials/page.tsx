import { createClient } from "@/lib/supabase/server";
import { MaterialsManager } from "./MaterialsManager";

export default async function AdminMaterialsPage() {
  const supabase = createClient();
  const [materialsRes, coursesRes] = await Promise.all([
    supabase
      .from("study_materials")
      .select(`
        *,
        courses (
          id,
          title
        )
      `)
      .order("created_at", { ascending: false }),
    supabase.from("courses").select("*").order("title"),
  ]);

  const initialMaterials = materialsRes.data || [];
  const initialCourses = coursesRes.data || [];

  return (
    <MaterialsManager
      initialMaterials={initialMaterials}
      initialCourses={initialCourses}
    />
  );
}
