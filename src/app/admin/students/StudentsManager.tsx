"use client";

import * as React from "react";
import {
  Users,
  BookOpen,
  Calendar,
  Phone,
  Trash2,
  AlertCircle,
  Plus,
  Search,
  X,
  CheckCircle2,
  XCircle,
  CheckCheck,
  Clock,
  Filter,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { createClient } from "@/lib/supabase/client";
import { Course } from "@/types";
import { formatDate } from "@/lib/utils";

export interface StudentWithDetails {
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

export interface CourseRequestWithDetails {
  id: string;
  student_id: string;
  course_id: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  profiles?: {
    id: string;
    full_name: string;
    phone: string | null;
  };
  courses?: {
    id: string;
    title: string;
    category?: string;
  };
}

interface StudentsManagerProps {
  initialStudents: StudentWithDetails[];
  initialCourses: Course[];
  initialRequests?: CourseRequestWithDetails[];
}

export function StudentsManager({
  initialStudents,
  initialCourses,
  initialRequests = [],
}: StudentsManagerProps) {
  const [students, setStudents] = React.useState<StudentWithDetails[]>(initialStudents);
  const [courses] = React.useState<Course[]>(initialCourses);
  const [requests, setRequests] = React.useState<CourseRequestWithDetails[]>(initialRequests);
  const [loading, setLoading] = React.useState(false);

  // Search and Filter States
  const [searchInput, setSearchInput] = React.useState("");
  const [activeSearch, setActiveSearch] = React.useState("");
  const [selectedCourseFilter, setSelectedCourseFilter] = React.useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = React.useState("all");

  // Requests Action Loading States
  const [requestActionLoading, setRequestActionLoading] = React.useState<string | null>(null);
  const [acceptAllLoading, setAcceptAllLoading] = React.useState(false);
  const [isAcceptAllConfirmOpen, setIsAcceptAllConfirmOpen] = React.useState(false);

  // Manual Enroll modal
  const [isEnrollModalOpen, setIsEnrollModalOpen] = React.useState(false);
  const [targetStudent, setTargetStudent] = React.useState<StudentWithDetails | null>(null);
  const [selectedCourseId, setSelectedCourseId] = React.useState(
    initialCourses.length > 0 ? initialCourses[0].id : ""
  );
  const [enrollLoading, setEnrollLoading] = React.useState(false);
  const [enrollError, setEnrollError] = React.useState<string | null>(null);

  // Remove enrollment modal
  const [enrollmentToRemove, setEnrollmentToRemove] = React.useState<{
    id: string;
    courseTitle: string;
    studentName: string;
  } | null>(null);
  const [removeLoading, setRemoveLoading] = React.useState(false);

  // Fetch full data refresh
  const fetchData = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      const [profilesRes, requestsRes] = await Promise.all([
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

      if (profilesRes.data) {
        setStudents(profilesRes.data as any);
      }
      if (requestsRes.data) {
        setRequests(requestsRes.data as any);
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  // Search submission handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setActiveSearch("");
  };

  const handleResetAllFilters = () => {
    setSearchInput("");
    setActiveSearch("");
    setSelectedCourseFilter("all");
    setSelectedStatusFilter("all");
  };

  // Multi-field search and filter logic
  const filteredStudents = React.useMemo(() => {
    return students.filter((student) => {
      // 1. Course Filter
      if (selectedCourseFilter !== "all") {
        const hasCourse = student.enrollments?.some(
          (en) => en.course_id === selectedCourseFilter
        );
        if (!hasCourse) return false;
      }

      // 2. Status Filter
      if (selectedStatusFilter === "enrolled" && (!student.enrollments || student.enrollments.length === 0)) {
        return false;
      }
      if (selectedStatusFilter === "unenrolled" && student.enrollments && student.enrollments.length > 0) {
        return false;
      }

      // 3. Search Query Filter (Checks name, phone, or batch titles)
      const query = activeSearch.toLowerCase().trim();
      if (!query) return true;

      const matchesName = student.full_name?.toLowerCase().includes(query);
      const matchesPhone = student.phone?.toLowerCase().includes(query);
      const matchesBatch = student.enrollments?.some((en) =>
        en.courses?.title?.toLowerCase().includes(query)
      );

      return matchesName || matchesPhone || matchesBatch;
    });
  }, [students, activeSearch, selectedCourseFilter, selectedStatusFilter]);

  // Request Action: Accept Single Request
  const handleAcceptRequest = async (req: CourseRequestWithDetails) => {
    setRequestActionLoading(req.id);
    try {
      const supabase = createClient();

      // 1. Insert into enrollments
      const { error: enrollError } = await supabase.from("enrollments").insert({
        student_id: req.student_id,
        course_id: req.course_id,
      });

      // Ignore duplicate error if already enrolled
      if (enrollError && enrollError.code !== "23505") {
        throw enrollError;
      }

      // 2. Update course_requests status to approved
      await supabase
        .from("course_requests")
        .update({ status: "approved" })
        .eq("id", req.id);

      await fetchData();
    } catch (err: any) {
      alert("Failed to accept request: " + (err.message || "Unknown error"));
    } finally {
      setRequestActionLoading(null);
    }
  };

  // Request Action: Reject Single Request
  const handleRejectRequest = async (req: CourseRequestWithDetails) => {
    setRequestActionLoading(req.id);
    try {
      const supabase = createClient();
      await supabase
        .from("course_requests")
        .update({ status: "rejected" })
        .eq("id", req.id);

      await fetchData();
    } catch (err: any) {
      alert("Failed to reject request: " + (err.message || "Unknown error"));
    } finally {
      setRequestActionLoading(null);
    }
  };

  // Request Action: Accept All Requests
  const handleConfirmAcceptAll = async () => {
    if (requests.length === 0) return;
    setAcceptAllLoading(true);

    try {
      const supabase = createClient();

      // Prepare enrollments payload
      const enrollmentInserts = requests.map((req) => ({
        student_id: req.student_id,
        course_id: req.course_id,
      }));

      // Insert all enrollments
      await supabase.from("enrollments").upsert(enrollmentInserts, {
        onConflict: "student_id,course_id",
      });

      // Update all requests status to approved
      const requestIds = requests.map((r) => r.id);
      await supabase
        .from("course_requests")
        .update({ status: "approved" })
        .in("id", requestIds);

      setIsAcceptAllConfirmOpen(false);
      await fetchData();
    } catch (err: any) {
      alert("Failed to accept all requests: " + (err.message || "Unknown error"));
    } finally {
      setAcceptAllLoading(false);
    }
  };

  // Manual Enroll Submit
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

    const alreadyEnrolled = targetStudent.enrollments?.some(
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

  // Remove Enrollment Confirm
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
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Student & Enrollment Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 dark:bg-primary/25 text-primary dark:text-blue-300">
              {students.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search registered students, review join requests, and grant batch access to study materials
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          disabled={loading}
          className="gap-1.5 self-start sm:self-auto text-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* FEATURE 1: PENDING COURSE JOIN REQUESTS TRAY */}
      {requests.length > 0 && (
        <Card className="border-amber-300 dark:border-amber-900/60 bg-gradient-to-r from-amber-50/50 via-white to-amber-50/20 dark:from-amber-950/20 dark:via-slate-900 dark:to-amber-950/10 shadow-md">
          <CardHeader className="pb-3 border-b border-amber-200/60 dark:border-amber-900/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="h-9 w-9 rounded-lg bg-accent text-slate-950 flex items-center justify-center font-bold shadow-sm">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base sm:text-lg text-slate-900 dark:text-white">
                      Pending Course Join Requests
                    </CardTitle>
                    <Badge variant="warning" className="font-bold">
                      {requests.length} Pending
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Students who requested admission into batches through the portal
                  </p>
                </div>
              </div>

              {/* Accept All Button */}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAcceptAllConfirmOpen(true)}
                className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow"
              >
                <CheckCheck className="h-4 w-4" />
                <span>Accept All Requests ({requests.length})</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {requests.map((req) => {
                const isProcessing = requestActionLoading === req.id;
                const studentName = req.profiles?.full_name || "Student";
                const studentPhone = req.profiles?.phone;
                const courseTitle = req.courses?.title || "Course Batch";
                const category = req.courses?.category || "General";

                return (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-white dark:bg-slate-900 shadow-sm space-y-2.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {studentName}
                        </span>
                        <Badge variant="secondary" className="text-[10px]">
                          {category}
                        </Badge>
                      </div>

                      <p className="text-xs font-semibold text-primary dark:text-accent line-clamp-1">
                        {courseTitle}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        {studentPhone && (
                          <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                            <Phone className="h-3 w-3 text-accent" />
                            {studentPhone}
                          </span>
                        )}
                        <span>{formatDate(req.created_at)}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRejectRequest(req)}
                        disabled={isProcessing}
                        className="h-8 px-2.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-900/40 gap-1"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Reject</span>
                      </Button>

                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => handleAcceptRequest(req)}
                        disabled={isProcessing}
                        isLoading={isProcessing}
                        className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Accept</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* FEATURE 2: SEARCH & FILTER TOOLBAR */}
      <Card className="shadow-sm">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5">
            {/* Search Input Box */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search student by name, mobile number, or enrolled batch..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  // Live filter as user types
                  setActiveSearch(e.target.value.trim());
                }}
                className="w-full h-11 pl-10 pr-10 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Dedicated Search Button */}
            <Button
              type="submit"
              variant="primary"
              className="gap-1.5 h-11 px-5 font-bold shadow-sm flex-shrink-0"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Button>
          </form>

          {/* Filter Dropdowns and Results Stats */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" />
                Filter by:
              </span>

              {/* Course Filter */}
              <select
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
                className="h-8 px-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Courses / Batches</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="h-8 px-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Students</option>
                <option value="enrolled">With Active Batches</option>
                <option value="unenrolled">Not Enrolled Yet</option>
              </select>

              {(activeSearch || selectedCourseFilter !== "all" || selectedStatusFilter !== "all") && (
                <button
                  type="button"
                  onClick={handleResetAllFilters}
                  className="text-primary dark:text-accent font-semibold hover:underline ml-1"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Results counter badge */}
            <div className="text-slate-500 dark:text-slate-400 font-medium">
              Showing <span className="font-bold text-slate-900 dark:text-white">{filteredStudents.length}</span> of {students.length} students
            </div>
          </div>
        </CardContent>
      </Card>

      {/* STUDENTS LIST */}
      {filteredStudents.length > 0 ? (
        <div className="space-y-4">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="hover:border-primary/40 dark:hover:border-accent/40 transition-all shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base sm:text-lg">{student.full_name}</CardTitle>
                      <Badge variant={student.role === "admin" ? "warning" : "default"} className="capitalize text-[11px]">
                        {student.role}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      {student.phone && (
                        <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
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
                    className="gap-1.5 text-xs self-start sm:self-auto border-primary/30 text-primary dark:text-blue-400 hover:bg-primary/5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Enroll in Course</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Enrolled Batches ({student.enrollments?.length || 0})
                  </p>
                  {student.enrollments && student.enrollments.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {student.enrollments.map((en) => (
                        <span
                          key={en.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800 text-xs font-medium"
                        >
                          <BookOpen className="h-3 w-3 text-primary dark:text-blue-400 flex-shrink-0" />
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
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                      No active enrollments. Click &apos;Enroll in Course&apos; to assign a batch.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8 sm:p-12 text-center space-y-3">
          <Users className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
            {activeSearch || selectedCourseFilter !== "all" || selectedStatusFilter !== "all"
              ? "No students match your search criteria"
              : "No students registered yet"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {activeSearch || selectedCourseFilter !== "all" || selectedStatusFilter !== "all"
              ? `No student found for "${activeSearch || "filtered selection"}". Try searching by another keyword or resetting filters.`
              : "Students who register online will appear here."}
          </p>
          {(activeSearch || selectedCourseFilter !== "all" || selectedStatusFilter !== "all") && (
            <div className="pt-2">
              <Button variant="outline" size="sm" onClick={handleResetAllFilters}>
                Reset Search Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Manual Enroll Modal */}
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
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
              Select Course Batch
            </label>
            <select
              className="flex h-11 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-base text-slate-900 dark:text-slate-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
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

      {/* Accept All Requests Confirmation */}
      <ConfirmModal
        isOpen={isAcceptAllConfirmOpen}
        onClose={() => setIsAcceptAllConfirmOpen(false)}
        onConfirm={handleConfirmAcceptAll}
        title="Accept All Course Requests"
        message={`Are you sure you want to accept all ${requests.length} pending course join requests? All students will immediately be enrolled in their respective batches and granted access to study materials.`}
        confirmText={`Accept All (${requests.length})`}
        variant="primary"
        isLoading={acceptAllLoading}
      />
    </div>
  );
}
