"use client";

import * as React from "react";
import { Bug, CheckCircle2, AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

interface BugReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function BugReportModal({
  isOpen,
  onClose,
  onSuccess,
}: BugReportModalProps) {
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState<
    "ui" | "auth" | "courses" | "materials" | "performance" | "other"
  >("ui");
  const [severity, setSeverity] = React.useState<
    "low" | "medium" | "high" | "critical"
  >("medium");
  const [description, setDescription] = React.useState("");
  const [reporterName, setReporterName] = React.useState("");
  const [reporterContact, setReporterContact] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Pre-fill user data if signed in
  React.useEffect(() => {
    if (!isOpen) return;
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, phone")
            .eq("id", user.id)
            .single();
          if (profile?.full_name && !reporterName) {
            setReporterName(profile.full_name);
          }
          if (profile?.phone && !reporterContact) {
            setReporterContact(profile.phone);
          } else if (user.email && !reporterContact) {
            setReporterContact(user.email);
          }
        }
      } catch {
        // Guest mode fallback
      }
    };
    fetchUser();
  }, [isOpen]);

  const resetForm = () => {
    setTitle("");
    setCategory("ui");
    setSeverity("medium");
    setDescription("");
    setSubmitted(false);
    setErrorMessage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMessage("Please enter an issue title and description.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      let userId: string | null = null;
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) userId = user.id;
      } catch {
        // Guest mode
      }

      const { error } = await supabase.from("bug_reports").insert({
        title: title.trim(),
        category,
        severity,
        description: description.trim(),
        reporter_name: reporterName.trim() || null,
        reporter_contact: reporterContact.trim() || null,
        status: "open",
        user_id: userId,
      });

      if (error) throw error;

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to submit bug report. Please try again.";
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={submitted ? "Report Received" : "Report a Bug or Technical Issue"}
      className="max-w-md"
    >
      {submitted ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Bug Report Submitted!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Thank you for helping us improve Laxmi Competition Classes. Our technical team and Vishal Sir will review this issue and resolve it promptly.
            </p>
          </div>
          <div className="pt-3">
            <Button variant="primary" onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
              {errorMessage}
            </div>
          )}

          <Input
            label="Brief Issue Summary"
            placeholder="e.g. PDF notes not opening on mobile browser"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value as
                      | "ui"
                      | "auth"
                      | "courses"
                      | "materials"
                      | "performance"
                      | "other"
                  )
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ui">Website UI / Display</option>
                <option value="auth">Login & Account</option>
                <option value="materials">Study Notes / PDF</option>
                <option value="courses">Course Enrollment</option>
                <option value="performance">Slow Loading / Lag</option>
                <option value="other">Other Inquiry</option>
              </select>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) =>
                  setSeverity(
                    e.target.value as "low" | "medium" | "high" | "critical"
                  )
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="low">Low (Minor annoyance)</option>
                <option value="medium">Medium (Functionality affected)</option>
                <option value="high">High (Cannot complete task)</option>
                <option value="critical">Critical (Page crashed/blocked)</option>
              </select>
            </div>
          </div>

          <Textarea
            label="What happened? (Steps to reproduce)"
            placeholder="Describe what button you clicked, which device/browser you are using, or what error was shown..."
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Your Name (Optional)"
              placeholder="e.g. Aman Verma"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
            />

            <Input
              label="Phone or Email (Optional)"
              placeholder="e.g. 9534932440"
              value={reporterContact}
              onChange={(e) => setReporterContact(e.target.value)}
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={submitting}
              className="gap-2 bg-rose-600 hover:bg-rose-700 text-white"
            >
              <Bug className="h-4 w-4" />
              <span>Submit Bug Report</span>
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
