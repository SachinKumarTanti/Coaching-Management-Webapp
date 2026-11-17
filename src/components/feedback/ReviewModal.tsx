"use client";

import * as React from "react";
import { Star, CheckCircle2, MessageSquarePlus, X } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ReviewModal({ isOpen, onClose, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = React.useState(5);
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);
  const [authorName, setAuthorName] = React.useState("");
  const [authorRole, setAuthorRole] = React.useState("");
  const [content, setContent] = React.useState("");
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
            .select("full_name")
            .eq("id", user.id)
            .single();
          if (profile?.full_name && !authorName) {
            setAuthorName(profile.full_name);
          }
        }
      } catch {
        // Guest mode fallback
      }
    };
    fetchUser();
  }, [isOpen]);

  const resetForm = () => {
    setRating(5);
    setHoverRating(null);
    setContent("");
    setAuthorRole("");
    setSubmitted(false);
    setErrorMessage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) {
      setErrorMessage("Please fill in your name and review message.");
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

      const { error } = await supabase.from("reviews").insert({
        author_name: authorName.trim(),
        author_role: authorRole.trim() || "Student Aspirant",
        rating,
        content: content.trim(),
        is_published: false,
        user_id: userId,
      });

      if (error) throw error;

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to submit review. Please try again.";
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={submitted ? "Review Submitted" : "Share Your Experience with Vishal Sir"}
      className="max-w-md"
    >
      {submitted ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Thank You for Your Feedback!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Your review has been submitted for verification. Once approved by Vishal Sir, it will be published on the website.
            </p>
          </div>
          <div className="pt-3">
            <Button variant="primary" onClick={handleClose} className="w-full">
              Done
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

          {/* Star Rating Selector */}
          <div className="space-y-1.5 text-center py-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
              How would you rate your learning experience?
            </label>
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating ?? rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setRating(star)}
                    className="p-1 text-slate-300 hover:scale-110 transition-transform focus:outline-none"
                    aria-label={`Rate ${star} star`}
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        active
                          ? "fill-accent text-accent"
                          : "text-slate-300 dark:text-slate-700"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] font-bold text-accent">
              {rating === 5 && "Outstanding (5/5)"}
              {rating === 4 && "Very Good (4/5)"}
              {rating === 3 && "Good (3/5)"}
              {rating === 2 && "Fair (2/5)"}
              {rating === 1 && "Needs Improvement (1/5)"}
            </p>
          </div>

          <Input
            label="Your Full Name"
            placeholder="e.g. Rahul Sharma"
            required
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />

          <Input
            label="Exam / Target Course (Optional)"
            placeholder="e.g. SSC CGL Aspirant, Railway NTPC Batch"
            value={authorRole}
            onChange={(e) => setAuthorRole(e.target.value)}
            helperText="e.g. Which competitive exam or batch you attended"
          />

          <Textarea
            label="Your Honest Review"
            placeholder="Share what you liked about Vishal Sir's teaching method, DPP sheets, or mock tests..."
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

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
              className="gap-2"
            >
              <MessageSquarePlus className="h-4 w-4" />
              <span>Submit Review</span>
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
