"use client";

import * as React from "react";
import {
  Upload,
  Trash2,
  FileText,
  Calendar,
  HardDrive,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
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
import { formatDate, formatFileSize } from "@/lib/utils";

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = React.useState<any[]>([]);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Upload modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedCourseId, setSelectedCourseId] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const [uploadLoading, setUploadLoading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  // Delete state
  const [materialToDelete, setMaterialToDelete] = React.useState<any | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const fetchData = async () => {
    try {
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

      if (materialsRes.data) setMaterials(materialsRes.data);
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

  const handleOpenUpload = () => {
    setTitle("");
    setDescription("");
    setSelectedFile(null);
    setUploadError(null);
    if (courses.length > 0) {
      setSelectedCourseId(courses[0].id);
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Max 50MB
      if (file.size > 52428800) {
        setUploadError("File size exceeds 50MB limit");
        return;
      }
      setSelectedFile(file);
      if (!title) {
        // Auto-fill title from filename minus extension
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError("Please select a file to upload");
      return;
    }
    if (!selectedCourseId) {
      setUploadError("Please select an associated course");
      return;
    }

    setUploadError(null);
    setUploadLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      // Clean filename and make unique
      const timestamp = Date.now();
      const cleanFileName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `${selectedCourseId}/${timestamp}-${cleanFileName}`;

      // 1. Upload to Supabase Storage Bucket
      const { error: storageError } = await supabase.storage
        .from("study-materials")
        .upload(storagePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (storageError) throw storageError;

      // 2. Insert record into study_materials table
      const { error: dbError } = await supabase.from("study_materials").insert({
        course_id: selectedCourseId,
        title,
        description: description || null,
        file_path: storagePath,
        file_size: selectedFile.size,
        file_type: selectedFile.type || "application/pdf",
        uploaded_by: user?.id || null,
      });

      if (dbError) throw dbError;

      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload study material");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!materialToDelete) return;
    setIsDeleting(true);

    try {
      const supabase = createClient();

      // 1. Delete from storage bucket
      await supabase.storage
        .from("study-materials")
        .remove([materialToDelete.file_path]);

      // 2. Delete from database table
      const { error } = await supabase
        .from("study_materials")
        .delete()
        .eq("id", materialToDelete.id);

      if (error) throw error;

      setMaterialToDelete(null);
      fetchData();
    } catch (err: any) {
      alert("Failed to delete material: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Study Material Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Upload chapter PDFs and problem sheets for enrolled students
          </p>
        </div>
        <Button onClick={handleOpenUpload} variant="accent" className="gap-2 self-start sm:self-auto font-bold">
          <Upload className="h-4 w-4" />
          <span>Upload Study Material</span>
        </Button>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-sm text-slate-500">Loading materials...</div>
      ) : materials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {materials.map((item) => (
            <Card key={item.id} className="flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="default" className="text-[11px] truncate max-w-[200px]">
                    {item.courses?.title || "Assigned Course"}
                  </Badge>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(item.created_at)}
                  </span>
                </div>
                <CardTitle className="text-base font-bold text-slate-900 leading-snug">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {item.description && (
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <HardDrive className="h-3.5 w-3.5 text-accent" />
                    {formatFileSize(item.file_size)}
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/dashboard/materials/${item.id}/download`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="text-xs h-8 px-2 gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Preview
                      </Button>
                    </a>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setMaterialToDelete(item)}
                      className="text-xs h-8 px-2 gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center space-y-3">
          <FileText className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800">No study materials uploaded yet</h3>
          <p className="text-xs text-slate-500">Upload PDF sheets to share with enrolled batch students.</p>
          <Button onClick={handleOpenUpload} variant="accent" size="sm">
            Upload First PDF
          </Button>
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Study Material / PDF"
        description="Uploaded files are securely accessible only to students enrolled in the selected course."
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          {uploadError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-600" />
              <span>{uploadError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-800">
              Target Course Batch
            </label>
            <select
              className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-base text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              required
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Material Title"
            placeholder="e.g. Percentage & Ratio Formula Booklet (Part 1)"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            label="Description / Notes for Students (Optional)"
            placeholder="e.g. Contains 50 practice questions with solved answer key..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-800">
              Select PDF or Document (Max 50MB)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              required
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover cursor-pointer border border-slate-300 rounded-lg p-1.5 bg-slate-50"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={uploadLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={uploadLoading}>
              Upload & Save
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!materialToDelete}
        onClose={() => setMaterialToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Study Material"
        message={`Are you sure you want to delete "${materialToDelete?.title}"? The file will be permanently removed from storage.`}
        confirmText="Delete Material"
        isLoading={isDeleting}
      />
    </div>
  );
}
