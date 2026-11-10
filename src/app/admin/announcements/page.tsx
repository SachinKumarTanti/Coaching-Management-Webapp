"use client";

import * as React from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Bell,
  Eye,
  EyeOff,
  Calendar,
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
import { Announcement } from "@/types";
import { formatDate } from "@/lib/utils";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<Announcement | null>(null);
  const [formData, setFormData] = React.useState({
    title: "",
    content: "",
    is_published: true,
  });
  const [formLoading, setFormLoading] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  // Delete
  const [itemToDelete, setItemToDelete] = React.useState<Announcement | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const fetchAnnouncements = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .order("published_at", { ascending: false });

      if (data) {
        setAnnouncements(data);
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      content: "",
      is_published: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Announcement) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      is_published: item.is_published,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (item: Announcement) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("announcements")
        .update({ is_published: !item.is_published })
        .eq("id", item.id);

      if (error) throw error;
      fetchAnnouncements();
    } catch (err: any) {
      alert("Failed to toggle announcement: " + err.message);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (editingItem) {
        const { error } = await supabase
          .from("announcements")
          .update({
            title: formData.title,
            content: formData.content,
            is_published: formData.is_published,
          })
          .eq("id", editingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("announcements")
          .insert({
            title: formData.title,
            content: formData.content,
            is_published: formData.is_published,
            created_by: user?.id || null,
          });

        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchAnnouncements();
    } catch (err: any) {
      setFormError(err.message || "Failed to save announcement");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", itemToDelete.id);

      if (error) throw error;
      setItemToDelete(null);
      fetchAnnouncements();
    } catch (err: any) {
      alert("Failed to delete notice: " + err.message);
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
            Announcements & Notices
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Publish official notices for test schedules, admissions, and holidays at Sangrampur center
          </p>
        </div>
        <Button onClick={handleOpenCreate} variant="primary" className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          <span>Post New Notice</span>
        </Button>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-sm text-slate-500">Loading notices...</div>
      ) : announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map((item) => (
            <Card key={item.id} className="hover:border-primary/30 transition-all">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-accent" />
                      {formatDate(item.published_at)}
                    </span>
                    {item.is_published ? (
                      <Badge variant="success" className="text-[11px]">Published</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[11px]">Draft / Unpublished</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTogglePublish(item)}
                      title={item.is_published ? "Unpublish" : "Publish"}
                      className="text-xs h-8 px-2"
                    >
                      {item.is_published ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5 mr-1" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                          Publish
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(item)}
                      className="text-xs h-8 px-2 gap-1"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setItemToDelete(item)}
                      className="text-xs h-8 px-2 gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg mt-2">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center space-y-3">
          <Bell className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800">No announcements posted yet</h3>
          <p className="text-xs text-slate-500">Keep students updated by posting the first center notice.</p>
          <Button onClick={handleOpenCreate} variant="primary" size="sm">
            Post First Notice
          </Button>
        </div>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Announcement" : "Create New Announcement"}
        description="Notices are visible on the public website and inside the student dashboard."
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          <Input
            label="Notice Title"
            placeholder="e.g. Schedule for Next Sunday's All-India Mock Test"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <Textarea
            label="Notice Content"
            placeholder="Write clear instructions for students..."
            rows={5}
            required
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <label htmlFor="is_published" className="text-sm font-medium text-slate-700">
              Publish immediately (visible to all students)
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
              {editingItem ? "Save Changes" : "Post Notice"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Announcement"
        message={`Are you sure you want to delete notice "${itemToDelete?.title}"? This cannot be undone.`}
        confirmText="Delete Notice"
        isLoading={isDeleting}
      />
    </div>
  );
}
