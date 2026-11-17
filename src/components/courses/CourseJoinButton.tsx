"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, Send, AlertCircle, LogIn, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface CourseJoinButtonProps {
  courseId: string;
  courseTitle?: string;
  initialStatus?: "enrolled" | "approved" | "pending" | "rejected" | "none";
  isLoggedIn?: boolean;
  className?: string;
}

export function CourseJoinButton({
  courseId,
  courseTitle = "this course",
  initialStatus = "none",
  isLoggedIn = false,
  className,
}: CourseJoinButtonProps) {
  const router = useRouter();
  const [status, setStatus] = React.useState<"enrolled" | "approved" | "pending" | "rejected" | "none">(initialStatus);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  React.useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  if (status === "enrolled" || status === "approved") {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
        <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
        <span>Enrolled & Active</span>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold">
        <Clock className="h-3.5 w-3.5 flex-shrink-0 text-accent animate-pulse" />
        <span>Request Pending Approval</span>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <Link href={`/login?redirectTo=/courses/${courseId}`}>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <LogIn className="h-3.5 w-3.5" />
          <span>Login to Join</span>
        </Button>
      </Link>
    );
  }

  const handleRequestJoin = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/login?redirectTo=/courses/${courseId}`);
        return;
      }

      // Check if already in enrollments
      const { data: existingEnrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("student_id", user.id)
        .eq("course_id", courseId)
        .maybeSingle();

      if (existingEnrollment) {
        setStatus("enrolled");
        setMessage({ type: "success", text: "You are already enrolled in this course!" });
        setLoading(false);
        return;
      }

      // Insert into course_requests
      const { error } = await supabase
        .from("course_requests")
        .insert({
          student_id: user.id,
          course_id: courseId,
          status: "pending",
        });

      if (error) {
        // If unique constraint violation or request already exists
        if (error.code === "23505" || error.message?.includes("duplicate")) {
          setStatus("pending");
          setMessage({ type: "success", text: "Your request is already submitted and pending review." });
        } else {
          throw error;
        }
      } else {
        setStatus("pending");
        setMessage({ type: "success", text: "Request sent to Vishal Sir! Approval is pending." });
        router.refresh();
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to submit request." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <Button
        variant="primary"
        size="sm"
        onClick={handleRequestJoin}
        isLoading={loading}
        className="gap-1.5 text-xs font-semibold shadow-sm"
      >
        <Send className="h-3.5 w-3.5" />
        <span>Request to Join Batch</span>
      </Button>

      {message && (
        <p
          className={`text-[11px] font-medium ${
            message.type === "success"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-600 dark:text-rose-400"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
