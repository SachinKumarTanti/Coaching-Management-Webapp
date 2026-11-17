import { createClient } from "@/lib/supabase/server";
import { FeedbackManager } from "./FeedbackManager";
import { Review, BugReport } from "@/types";

export const metadata = {
  title: "Feedback & Bug Reports | Admin Dashboard",
  description: "Moderate student reviews and manage website bug reports",
};

export default async function AdminFeedbackPage() {
  const supabase = createClient();

  let reviews: Review[] = [];
  let bugReports: BugReport[] = [];

  try {
    const [reviewsRes, bugsRes] = await Promise.all([
      supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("bug_reports")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    if (reviewsRes.data) {
      reviews = reviewsRes.data;
    }
    if (bugsRes.data) {
      bugReports = bugsRes.data;
    }
  } catch (err) {
    console.error("Error loading feedback & bugs:", err);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Reviews & Bug Reports
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Approve student testimonials to appear on the public website and track reported technical bugs.
        </p>
      </div>

      <FeedbackManager
        initialReviews={reviews}
        initialBugReports={bugReports}
      />
    </div>
  );
}
