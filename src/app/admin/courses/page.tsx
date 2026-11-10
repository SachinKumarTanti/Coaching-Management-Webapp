"use client";

import * as React from "react";
import {
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  CheckCircle,
  XCircle,
  Users,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { createClient } from "@/lib/supabase/client";
import { Course } from "@/types";

export default function AdminCoursesPage() {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [enrollmentCounts, setEnrollmentCounts] = React.useState<Record<string, number>>({});
  const [loading, setLoading] = React.useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCourse, setEditingCourse] = React.useState<Course | null>(null);
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    category: "General",
    is_active: true,
  });
  const [formLoading, setFormLoading] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  // Delete confirm state
  const [courseToDelete, setCourseToDelete] = React.useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const fetchCourses = async () => {
    try {
      const supabase = createClient();
      const { data: coursesData } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (coursesData) {
        setCourses(coursesData);

        // Fetch enrollment counts
        const { data: enrollments } = await supabase
          .from("enrollments")
          .select("course_id");

        if (enrollments) {
          const counts: Record<string, number> = {};
          enrollments.forEach((e) => {
            counts[e.course_id] = (counts[e.course_id] || 0) + 1;
          });
          setEnrollmentCounts(counts);
        }
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setFormData({
      title: "",
      description: "",
      category: "General",
      is_active: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category || "General",
      is_active: course.is_active,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    try {
      const supabase = createClient();

      if (editingCourse) {
        const { error } = await supabase
          .from("courses")
          .update({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            is_active: formData.is_active,
          })
          .eq("id", editingCourse.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("courses")
          .insert({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            is_active: formData.is_active,
          });

        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchCourses();
    } catch (err: any) {
      setFormError(err.message || "Failed to save course");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;
    setIsDeleting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseToDelete.id);

      if (error) throw error;

      setCourseToDelete(null);
      fetchCourses();
    } catch (err: any) {
      alert("Failed to delete course: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Course & Batch Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create, update, and manage competitive coaching batches for Sangrampur center
          </p>
        </div>
        <Button onClick={handleOpenCreate} variant="primary" className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          <span>Create New Course</span>
        </Button>
      </div>

      {/* Courses List */}
      {loading ? (
        <div className="text-center py-12 text-sm text-slate-500">Loading courses...</div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="secondary">{course.category || "General"}</Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <Users className="h-3.5 w-3.5 text-accent" />
                      {enrollmentCounts[course.id] || 0} Enrolled
                    </span>
                    {course.is_active ? (
                      <Badge variant="success" className="text-[11px]">Active</Badge>
                    ) : (
                      <Badge variant="destructive" className="text-[11px]">Inactive</Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {course.description}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(course)}
                    className="gap-1.5 text-xs"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setCourseToDelete(course)}
                    className="gap-1.5 text-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center space-y-3">
          <BookOpen className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800">No courses created yet</h3>
          <p className="text-xs text-slate-500">Add your first batch to start enrolling students.</p>
          <Button onClick={handleOpenCreate} variant="primary" size="sm">
            Create First Course
          </Button>
        </div>
      )}

      {/* Course Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourse ? "Edit Course Batch" : "Create New Course Batch"}
        description="Provide clear batch details for students at Sangrampur center."
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          <Input
            label="Course Title"
            placeholder="e.g. SSC CGL / CHSL Target Batch"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-800">
              Exam Category
            </label>
            <select
              className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-base text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Foundation">Foundation</option>
              <option value="SSC">SSC (CGL, CHSL, MTS, GD)</option>
              <option value="Railway">Railway (NTPC, Group D, ALP)</option>
              <option value="State Exams">State Exams (Bihar Police, Daroga)</option>
              <option value="Banking">Banking & Insurance</option>
              <option value="General">General Competition</option>
            </select>
          </div>

          <Textarea
            label="Course Description & Syllabus Highlights"
            placeholder="Detailed description of topics, syllabus coverage, and tests..."
            rows={4}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
              Active Batch (visible on public website and open for enrollment)
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={formLoading}>
              {editingCourse ? "Save Changes" : "Create Course"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!courseToDelete}
        onClose={() => setCourseToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Course Batch"
        message={`Are you sure you want to delete "${courseToDelete?.title}"? All associated student enrollments and study materials will also be permanently deleted.`}
        confirmText="Delete Course"
        isLoading={isDeleting}
      />
    </div>
  );
}
