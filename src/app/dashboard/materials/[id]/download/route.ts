import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const materialId = params.id;
  const supabase = createClient();

  // 1. Check user authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required to download study materials." },
      { status: 401 }
    );
  }

  // 2. Fetch Material Details
  const { data: material, error: materialError } = await supabase
    .from("study_materials")
    .select("id, file_path, course_id, title")
    .eq("id", materialId)
    .single();

  if (materialError || !material) {
    return NextResponse.json(
      { error: "Study material not found." },
      { status: 404 }
    );
  }

  // 3. Verify Admin or Student Enrollment
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  if (!isAdmin) {
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("student_id", user.id)
      .eq("course_id", material.course_id)
      .single();

    if (!enrollment) {
      return NextResponse.json(
        { error: "Access denied. You are not enrolled in this course." },
        { status: 403 }
      );
    }
  }

  // 4. Generate a secure short-lived signed URL (valid for 60 seconds)
  const { data: signedData, error: signError } = await supabase.storage
    .from("study-materials")
    .createSignedUrl(material.file_path, 60, {
      download: true,
    });

  if (signError || !signedData?.signedUrl) {
    // If the file does not physically exist in bucket (e.g. dummy test file path),
    // return a clean JSON message
    return NextResponse.json(
      {
        error: "File is temporarily unavailable in storage. Please contact Vishal Sir.",
        filePath: material.file_path,
      },
      { status: 404 }
    );
  }

  // 5. Redirect the client to the signed secure URL
  return NextResponse.redirect(signedData.signedUrl);
}
