import { Bell, Calendar, Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

const defaultAnnouncements = [
  {
    id: "a1",
    title: "Admissions Open for New Morning Batch 2026-2027",
    content: "Fresh batches for SSC, Railway, and State Police are commencing from next Monday at our Sangrampur center. Students are requested to contact Vishal Sir or visit the center office between 7:00 AM and 5:00 PM for admissions.",
    published_at: new Date().toISOString(),
  },
  {
    id: "a2",
    title: "Special Sunday Mock Test & Doubt Session",
    content: "Every Sunday at 9:00 AM, a comprehensive mock test will be held followed by live question analysis by Vishal Sir. Please bring your student ID and practice notebook.",
    published_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "a3",
    title: "Digital Notes & PDF Portal Launched",
    content: "Students can now log in to the student portal on their mobile phones to view and download study materials, problem sheets, and formula cheat-sheets.",
    published_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export default async function AnnouncementsPage() {
  let announcements = defaultAnnouncements;

  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (data && data.length > 0) {
      announcements = data;
    }
  } catch {
    // Keep fallback
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <Badge variant="warning" className="uppercase tracking-wider">
            Notice Board
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Latest Announcements & Notices
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Stay informed with official updates, exam alerts, test schedules, and batch changes from Vishal Sir.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {announcements.map((item, index) => (
            <article
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-primary/40 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
                  <Calendar className="h-4 w-4 text-accent" />
                  <span>{formatDate(item.published_at)}</span>
                </div>
                {index === 0 && (
                  <Badge variant="default" className="text-[11px]">
                    Latest Notice
                  </Badge>
                )}
              </div>

              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {item.title}
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {item.content}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100">
                <span>Laxmi Competition Classes • Sangrampur</span>
                <span>By Vishal Sir</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
