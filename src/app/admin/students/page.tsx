"use client";

import * as React from "react";
import {
  Users,
  UserPlus,
  BookOpen,
  Calendar,
  Phone,
  Mail,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { createClient } from "@/lib/supabase/client";
import { Course } from "@/types";
import { formatDate } from "@/lib/utils";

interface StudentWithDetails {
  id: string;
  full_name: string;
  phone: string | null;
  role: string;
  created_at: string;
  enrollments: {
    id: string;
    course_id: string;
    courses: {
      id: string;
      title: string;
    };
  }[];
}

export default function AdminStudentsPage() {
  const [students, setStudents] = React.useState<StudentWithDetails[]>([]);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Enroll modal
  const [isEnrollModalOpen, setIsEnrollModalOpen] = React.useState(false);
  const [targetStudent, setTargetStudent] = React.useState<StudentWithDetails | null>(null);
  const [selectedCourseId, setSelectedCourseId] = React.useState("");
  const [enrollLoading, setEnrollLoading] = React.useState(false);
  const [enrollError, setEnrollError] = React.useState<string | null>(null);

  // Remove enrollment modal
  const [enrollmentToRemove, setEnrollmentToRemove] = React.useState<{
    id: string;
    courseTitle: string;
    studentName: string;
  } | null>(null);
  const [removeLoading, setRemoveLoading] = React.useState(false);

  const fetchData = async () => {
    try {
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

      if (profilesRes.data) {
        setStudents(profilesRes.data as any);
      }
      if (coursesRes.data) {
        setCourses(coursesRes.data);
        if (coursesRes.data.length > 0 && !selectedCourseId) {
          setSelectedCourseId(coursesRes.data[0].id);
        }
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleOpenEnroll = (student: StudentWithDetails) => {
    setTargetStudent(student);
    setEnrollError(null);
    if (courses.length > 0) {
      setSelectedCourseId(courses[0].id);
    }
    setIsEnrollModalOpen(true);
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStudent || !selectedCourseId) return;

    // Check if already enrolled
    const alreadyEnrolled = targetStudent.enrollments.some(
      (en) => en.course_id === selectedCourseId
    );
    if (alreadyEnrolled) {
      setEnrollError("Student is already enrolled in this course.");
      return;
    }

    setEnrollError(null);
    setEnrollLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("enrollments").insert({
        student_id: targetStudent.id,
        course_id: selectedCourseId,
      });

      if (error) throw error;

      setIsEnrollModalOpen(false);
      fetchData();
    } catch (err: any) {
      setEnrollError(err.message || "Failed to enroll student");
    } finally {
      setEnrollLoading(false);
    }
  };

  const handleRemoveEnrollmentConfirm = async () => {
    if (!enrollmentToRemove) return;
    setRemoveLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("enrollments")
        .delete()
        .eq("id", enrollmentToRemove.id);

      if (error) throw error;

      setEnrollmentToRemove(null);
      fetchData();
    } catch (err: any) {
      alert("Failed to remove enrollment: " + err.message);
    } finally {
      setRemoveLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Student & Enrollment Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          View registered students and manage course enrollments to grant access to study materials
        </p>
      </div>

      {/* Students List */}
      {loading ? (
        <div className="text-center py-12 text-sm text-slate-500">Loading students...</div>
      ) : students.length > 0 ? (
        <div className="space-y-4">
          {students.map((student) => (
            <Card key={student.id} className="hover:border-primary/40 transition-all">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base sm:text-lg">{student.full_name}</CardTitle>
                      <Badge variant={student.role === "admin" ? "warning" : "default"} className="capitalize text-[11px]">
                        {student.role}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      {student.phone && (
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <Phone className="h-3 w-3 text-accent" />
                          {student.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        Joined {formatDate(student.created_at)}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEnroll(student)}
                    className="gap-1.5 text-xs self-start sm:self-auto border-primary/30 text-primary hover:bg-primary/5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Enroll in Course</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Enrolled Batches ({student.enrollments?.length || 0})
                  </p>
                  {student.enrollments && student.enrollments.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {student.enrollments.map((en) => (
                        <span
                          key={en.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 text-xs font-medium"
                        >
                          <BookOpen className="h-3 w-3 text-primary flex-shrink-0" />
                          <span>{en.courses?.title || "Batch"}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setEnrollmentToRemove({
                                id: en.id,
                                courseTitle: en.courses?.title || "Course",
                                studentName: student.full_name,
                              })
                            }
                            className="ml-1 text-slate-400 hover:text-rose-600 rounded p-0.5"
                            title="Remove enrollment"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      No active enrollments. Click &apos;Enroll in Course&apos; to assign a batch.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center space-y-3">
          <Users className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800">No students registered yet</h3>
          <p className="text-xs text-slate-500">Students who register online will appear here.</p>
        </div>
      )}

      {/* Enroll Modal */}
      <Modal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        title={`Enroll ${targetStudent?.full_name}`}
        description="Select an active batch to give this student instant access to study notes."
      >
        <form onSubmit={handleEnrollSubmit} className="space-y-4">
          {enrollError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-600" />
              <span>{enrollError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-800">
              Select Course Batch
            </label>
            <select
              className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-base text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              required
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.category})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEnrollModalOpen(false)}
              disabled={enrollLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={enrollLoading}>
              Confirm Enrollment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Remove Enrollment Confirmation */}
      <ConfirmModal
        isOpen={!!enrollmentToRemove}
        onClose={() => setEnrollmentToRemove(null)}
        onConfirm={handleRemoveEnrollmentConfirm}
        title="Remove Course Enrollment"
        message={`Are you sure you want to remove ${enrollmentToRemove?.studentName} from "${enrollmentToRemove?.courseTitle}"? The student will lose access to this course's study materials.`}
        confirmText="Remove Enrollment"
        isLoading={removeLoading}
      />
    </div>
  );
}
