import Link from "next/link";
import {
  FileText,
  Download,
  Calendar,
  HardDrive,
  BookOpen,
  Filter,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatFileSize } from "@/lib/utils";

interface MaterialsPageProps {
  searchParams: {
    courseId?: string;
  };
}

export default async function StudentMaterialsPage({ searchParams }: MaterialsPageProps) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let materials: any[] = [];
  let enrolledCourses: any[] = [];
  const selectedCourseId = searchParams?.courseId;

  if (user) {
    // 1. Fetch enrolled courses for filter pill buttons
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select(`
        courses (
          id,
          title
        )
      `)
      .eq("student_id", user.id);

    if (enrollments) {
      enrolledCourses = enrollments.map((e: any) => e.courses).filter(Boolean);
    }

    // 2. Fetch materials for enrolled courses
    if (enrolledCourses.length > 0) {
      const enrolledCourseIds = enrolledCourses.map((c: any) => c.id);

      let query = supabase
        .from("study_materials")
        .select(`
          id,
          title,
          description,
          file_path,
          file_size,
          file_type,
          created_at,
          courses (
            id,
            title,
            category
          )
        `)
        .in("course_id", enrolledCourseIds)
        .order("created_at", { ascending: false });

      if (selectedCourseId && enrolledCourseIds.includes(selectedCourseId)) {
        query = query.eq("course_id", selectedCourseId);
      }

      const { data } = await query;
      if (data) {
        materials = data;
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Study Materials & Class Notes
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Chapter PDFs, problem sheets, and formula digests provided by Vishal Sir
        </p>
      </div>

      {/* Course Filter Pills */}
      {enrolledCourses.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 flex-shrink-0">
            <Filter className="h-3.5 w-3.5" />
            Filter:
          </span>
          <Link href="/dashboard/materials">
            <Button
              variant={!selectedCourseId ? "primary" : "outline"}
              size="sm"
              className="text-xs h-8 rounded-full px-3"
            >
              All Courses
            </Button>
          </Link>
          {enrolledCourses.map((c) => (
            <Link key={c.id} href={`/dashboard/materials?courseId=${c.id}`}>
              <Button
                variant={selectedCourseId === c.id ? "primary" : "outline"}
                size="sm"
                className="text-xs h-8 rounded-full px-3 truncate max-w-[200px]"
              >
                {c.title}
              </Button>
            </Link>
          ))}
        </div>
      )}

      {/* Materials List */}
      {materials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {materials.map((item) => (
            <Card key={item.id} className="flex flex-col justify-between hover:border-primary/40 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <Badge variant="default" className="text-[11px] truncate max-w-[180px]">
                    {item.courses?.title || "Course Material"}
                  </Badge>
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(item.created_at)}
                  </span>
                </div>
                <CardTitle className="text-base font-bold text-slate-900 leading-snug">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {item.description && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <HardDrive className="h-3.5 w-3.5 text-accent" />
                    <span>{formatFileSize(item.file_size)}</span>
                  </div>

                  <a
                    href={`/dashboard/materials/${item.id}/download`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary" size="sm" className="gap-1.5 text-xs h-9 min-h-[36px]">
                      <Download className="h-3.5 w-3.5" />
                      <span>Download PDF</span>
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 sm:p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-700 mx-auto flex items-center justify-center">
            <FileText className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              No study materials available yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              {enrolledCourses.length === 0
                ? "You need to be enrolled in an active course to view and download study notes."
                : "No notes have been uploaded for your enrolled batches yet. Vishal Sir will upload materials soon."}
            </p>
          </div>
          {enrolledCourses.length === 0 && (
            <div className="pt-2">
              <Link href="/courses">
                <Button variant="outline" size="sm">
                  View Available Courses
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
