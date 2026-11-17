"use client";

import * as React from "react";
import {
  Star,
  Bug,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  AlertTriangle,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  Search,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { createClient } from "@/lib/supabase/client";
import { Review, BugReport } from "@/types";
import { formatDate } from "@/lib/utils";

interface FeedbackManagerProps {
  initialReviews: Review[];
  initialBugReports: BugReport[];
}

export function FeedbackManager({
  initialReviews,
  initialBugReports,
}: FeedbackManagerProps) {
  const [activeTab, setActiveTab] = React.useState<"reviews" | "bugs">("reviews");

  // Reviews state
  const [reviews, setReviews] = React.useState<Review[]>(initialReviews);
  const [reviewFilter, setReviewFilter] = React.useState<"all" | "pending" | "published">("all");
  const [reviewSearch, setReviewSearch] = React.useState("");
  const [togglingReviewId, setTogglingReviewId] = React.useState<string | null>(null);

  // Bug reports state
  const [bugReports, setBugReports] = React.useState<BugReport[]>(initialBugReports);
  const [bugStatusFilter, setBugStatusFilter] = React.useState<"all" | "open" | "in_progress" | "resolved">("all");
  const [bugSeverityFilter, setBugSeverityFilter] = React.useState<string>("all");
  const [bugSearch, setBugSearch] = React.useState("");
  const [updatingBugId, setUpdatingBugId] = React.useState<string | null>(null);

  // Deletion modal state
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<{
    type: "review" | "bug";
    id: string;
    title: string;
  } | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  // Counters
  const pendingReviewsCount = reviews.filter((r) => !r.is_published).length;
  const openBugsCount = bugReports.filter((b) => b.status === "open").length;

  // Toggle Review Published Status
  const handleTogglePublish = async (review: Review) => {
    setTogglingReviewId(review.id);
    const newStatus = !review.is_published;
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("reviews")
        .update({ is_published: newStatus, updated_at: new Date().toISOString() })
        .eq("id", review.id);

      if (error) throw error;

      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, is_published: newStatus } : r))
      );
    } catch (err) {
      alert("Failed to update review status. Please try again.");
    } finally {
      setTogglingReviewId(null);
    }
  };

  // Update Bug Report Status
  const handleUpdateBugStatus = async (
    bugId: string,
    newStatus: "open" | "in_progress" | "resolved" | "closed"
  ) => {
    setUpdatingBugId(bugId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("bug_reports")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", bugId);

      if (error) throw error;

      setBugReports((prev) =>
        prev.map((b) => (b.id === bugId ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      alert("Failed to update bug status. Please try again.");
    } finally {
      setUpdatingBugId(null);
    }
  };

  // Confirm and Delete
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const supabase = createClient();
      if (itemToDelete.type === "review") {
        const { error } = await supabase
          .from("reviews")
          .delete()
          .eq("id", itemToDelete.id);
        if (error) throw error;
        setReviews((prev) => prev.filter((r) => r.id !== itemToDelete.id));
      } else {
        const { error } = await supabase
          .from("bug_reports")
          .delete()
          .eq("id", itemToDelete.id);
        if (error) throw error;
        setBugReports((prev) => prev.filter((b) => b.id !== itemToDelete.id));
      }
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      alert("Failed to delete item. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // Filtered reviews
  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === "pending" && r.is_published) return false;
    if (reviewFilter === "published" && !r.is_published) return false;
    if (reviewSearch) {
      const term = reviewSearch.toLowerCase();
      const matchName = r.author_name.toLowerCase().includes(term);
      const matchRole = r.author_role?.toLowerCase().includes(term) ?? false;
      const matchContent = r.content.toLowerCase().includes(term);
      if (!matchName && !matchRole && !matchContent) return false;
    }
    return true;
  });

  // Filtered bugs
  const filteredBugs = bugReports.filter((b) => {
    if (bugStatusFilter !== "all" && b.status !== bugStatusFilter) return false;
    if (bugSeverityFilter !== "all" && b.severity !== bugSeverityFilter) return false;
    if (bugSearch) {
      const term = bugSearch.toLowerCase();
      const matchTitle = b.title.toLowerCase().includes(term);
      const matchDesc = b.description.toLowerCase().includes(term);
      const matchReporter = b.reporter_name?.toLowerCase().includes(term) ?? false;
      if (!matchTitle && !matchDesc && !matchReporter) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Tab Navigation & Statistics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 p-1 bg-slate-200/80 dark:bg-slate-900 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "reviews"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <MessageSquare className="h-4 w-4 text-accent" />
            <span>Student Reviews</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs font-black ${
                pendingReviewsCount > 0
                  ? "bg-amber-500 text-slate-950"
                  : "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-300"
              }`}
            >
              {pendingReviewsCount > 0 ? `${pendingReviewsCount} new` : reviews.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("bugs")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "bugs"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Bug className="h-4 w-4 text-rose-500" />
            <span>Bug Reports</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs font-black ${
                openBugsCount > 0
                  ? "bg-rose-500 text-white"
                  : "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-300"
              }`}
            >
              {openBugsCount > 0 ? `${openBugsCount} open` : bugReports.length}
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          {activeTab === "reviews" ? (
            <span>
              Showing {filteredReviews.length} of {reviews.length} reviews
            </span>
          ) : (
            <span>
              Showing {filteredBugs.length} of {bugReports.length} reports
            </span>
          )}
        </div>
      </div>

      {/* TAB 1: REVIEWS MANAGEMENT */}
      {activeTab === "reviews" && (
        <div className="space-y-5">
          {/* Controls: Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by author, exam, or keyword..."
                value={reviewSearch}
                onChange={(e) => setReviewSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-200/60 dark:bg-slate-900 p-1 rounded-lg">
              <button
                onClick={() => setReviewFilter("all")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  reviewFilter === "all"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                All ({reviews.length})
              </button>
              <button
                onClick={() => setReviewFilter("pending")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  reviewFilter === "pending"
                    ? "bg-amber-500 text-slate-950 shadow-sm font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Pending Approval ({pendingReviewsCount})
              </button>
              <button
                onClick={() => setReviewFilter("published")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  reviewFilter === "published"
                    ? "bg-emerald-600 text-white shadow-sm font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Published ({reviews.length - pendingReviewsCount})
              </button>
            </div>
          </div>

          {/* Reviews List */}
          {filteredReviews.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <MessageSquare className="h-10 w-10 text-slate-400 mx-auto" />
              <p className="text-base font-bold text-slate-900 dark:text-white">
                No reviews found
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {reviewFilter === "pending"
                  ? "There are no pending reviews awaiting approval."
                  : "No reviews match your current search criteria."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReviews.map((review) => (
                <Card
                  key={review.id}
                  className={`transition-all ${
                    !review.is_published
                      ? "border-amber-300 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10"
                      : "hover:border-primary/40 dark:hover:border-accent/40"
                  }`}
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-1 text-accent mb-1">
                          {[...Array(review.rating)].map((_, s) => (
                            <Star key={s} className="h-4 w-4 fill-accent text-accent" />
                          ))}
                        </div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                          {review.author_name}
                        </h4>
                        <p className="text-xs text-accent font-semibold">
                          {review.author_role || "Student Aspirant"}
                        </p>
                      </div>

                      <div>
                        {review.is_published ? (
                          <Badge variant="success" className="gap-1">
                            <Eye className="h-3 w-3" />
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="warning" className="gap-1">
                            <Clock className="h-3 w-3" />
                            Pending Approval
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic bg-white/60 dark:bg-slate-950/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                      &ldquo;{review.content}&rdquo;
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                      <span>Submitted {formatDate(review.created_at)}</span>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={review.is_published ? "outline" : "primary"}
                          isLoading={togglingReviewId === review.id}
                          onClick={() => handleTogglePublish(review)}
                          className={
                            !review.is_published
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-xs"
                              : "text-xs gap-1"
                          }
                        >
                          {review.is_published ? (
                            <>
                              <EyeOff className="h-3.5 w-3.5" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Publish to Site
                            </>
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setItemToDelete({
                              type: "review",
                              id: review.id,
                              title: `Review by ${review.author_name}`,
                            });
                            setDeleteModalOpen(true);
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 p-1.5"
                          title="Delete Review"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BUG REPORTS MANAGEMENT */}
      {activeTab === "bugs" && (
        <div className="space-y-5">
          {/* Controls: Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by bug summary, description, reporter..."
                value={bugSearch}
                onChange={(e) => setBugSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={bugStatusFilter}
                onChange={(e) =>
                  setBugStatusFilter(
                    e.target.value as "all" | "open" | "in_progress" | "resolved"
                  )
                }
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Statuses ({bugReports.length})</option>
                <option value="open">Open Only ({openBugsCount})</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                value={bugSeverityFilter}
                onChange={(e) => setBugSeverityFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Bug Reports List */}
          {filteredBugs.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Bug className="h-10 w-10 text-slate-400 mx-auto" />
              <p className="text-base font-bold text-slate-900 dark:text-white">
                No bug reports found
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No bug reports match your current filter or search criteria.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBugs.map((bug) => {
                const isCritical = bug.severity === "critical";
                const isHigh = bug.severity === "high";

                return (
                  <Card
                    key={bug.id}
                    className={`transition-all ${
                      isCritical
                        ? "border-red-500/80 bg-red-50/20 dark:bg-red-950/20"
                        : isHigh
                        ? "border-rose-400/60"
                        : ""
                    }`}
                  >
                    <CardContent className="p-5 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Severity Badge */}
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider ${
                                bug.severity === "critical"
                                  ? "bg-red-600 text-white animate-pulse"
                                  : bug.severity === "high"
                                  ? "bg-rose-500 text-white"
                                  : bug.severity === "medium"
                                  ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                                  : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              {bug.severity} severity
                            </span>

                            {/* Category Tag */}
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 uppercase tracking-wide">
                              {bug.category}
                            </span>

                            {/* Status Badge */}
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                bug.status === "open"
                                  ? "bg-blue-600 text-white"
                                  : bug.status === "in_progress"
                                  ? "bg-purple-600 text-white"
                                  : "bg-emerald-600 text-white"
                              }`}
                            >
                              {bug.status === "open" && "Open"}
                              {bug.status === "in_progress" && "In Progress"}
                              {bug.status === "resolved" && "Resolved"}
                              {bug.status === "closed" && "Closed"}
                            </span>
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white pt-1">
                            {bug.title}
                          </h3>
                        </div>

                        {/* Status Switcher Actions */}
                        <div className="flex items-center gap-2">
                          <select
                            value={bug.status}
                            disabled={updatingBugId === bug.id}
                            onChange={(e) =>
                              handleUpdateBugStatus(
                                bug.id,
                                e.target.value as
                                  | "open"
                                  | "in_progress"
                                  | "resolved"
                                  | "closed"
                              )
                            }
                            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="open">Set: Open</option>
                            <option value="in_progress">Set: In Progress</option>
                            <option value="resolved">Set: Resolved</option>
                            <option value="closed">Set: Closed</option>
                          </select>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setItemToDelete({
                                type: "bug",
                                id: bug.id,
                                title: `Bug: ${bug.title}`,
                              });
                              setDeleteModalOpen(true);
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 p-1.5"
                            title="Delete Bug Report"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {bug.description}
                      </div>

                      {/* Footer Info: Reporter & Date */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <span>
                            Reported by:{" "}
                            <strong className="text-slate-800 dark:text-slate-200">
                              {bug.reporter_name || "Guest Visitor"}
                            </strong>
                          </span>
                          {bug.reporter_contact && (
                            <>
                              <span>•</span>
                              <span className="text-primary dark:text-accent font-medium">
                                {bug.reporter_contact}
                              </span>
                            </>
                          )}
                        </div>

                        <span>Reported on {formatDate(bug.created_at)}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        title={`Delete ${
          itemToDelete?.type === "review" ? "Review" : "Bug Report"
        }?`}
        message={`Are you sure you want to permanently delete "${itemToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        isLoading={deleting}
      />
    </div>
  );
}
