import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Bell,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  PhoneCall,
  Download,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

// Fallback data in case database is freshly created or keys pending
const fallbackCourses = [
  {
    id: "c1",
    title: "General Competition Foundation Batch",
    description: "Complete preparation for SSC, Railway, State Exams & Banking with daily problem sheets and concept clarity.",
    category: "Foundation",
  },
  {
    id: "c2",
    title: "SSC CGL / CHSL Special Batch",
    description: "Intensive training in Advanced Quantitative Aptitude, English Comprehension, Reasoning & General Studies.",
    category: "SSC",
  },
  {
    id: "c3",
    title: "Railway NTPC & Group D Crash Course",
    description: "Focused fast-track revision covering General Science, Numerical Ability, and weekly all-India pattern mock tests.",
    category: "Railway",
  },
];

const fallbackAnnouncements = [
  {
    id: "a1",
    title: "Admissions Open for New Morning Batch 2026-2027",
    content: "New batches starting this Monday at our Sangrampur center. Visit center or contact Vishal Sir directly.",
    published_at: new Date().toISOString(),
  },
  {
    id: "a2",
    title: "Sunday Special Full-Length Mock Test",
    content: "All registered students are invited for the offline test followed by instant solution discussions.",
    published_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export default async function HomePage() {
  let courses = fallbackCourses;
  let announcements = fallbackAnnouncements;

  try {
    const supabase = createClient();
    const [coursesRes, announcementsRes] = await Promise.all([
      supabase.from("courses").select("*").eq("is_active", true).limit(3),
      supabase
        .from("announcements")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(2),
    ]);

    if (coursesRes.data && coursesRes.data.length > 0) {
      courses = coursesRes.data;
    }
    if (announcementsRes.data && announcementsRes.data.length > 0) {
      announcements = announcementsRes.data;
    }
  } catch {
    // Keep fallback data
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary via-slate-900 to-slate-950 text-white py-14 sm:py-20 lg:py-24">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-accent border border-accent/20 backdrop-blur">
              <Sparkles className="h-4 w-4" />
              <span>Sangrampur’s Premier Competitive Coaching Center</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Laxmi Competition <br className="hidden sm:block" />
              <span className="text-accent">Classes</span>
            </h1>

            <p className="text-lg sm:text-xl font-medium text-slate-300">
              Guided with dedication & precision by{" "}
              <strong className="text-white underline decoration-accent decoration-2 underline-offset-4">
                Vishal Sir
              </strong>
            </p>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Your gateway to cracking SSC, Railway, State Police, and Banking examinations. High-quality teaching, structured notes, and mobile PDF access right here in Sangrampur.
            </p>

            {/* Clear Primary CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link href="/courses" className="w-full sm:w-auto">
                <Button size="lg" variant="accent" className="w-full gap-2 shadow-lg">
                  <BookOpen className="h-5 w-5" />
                  Explore Courses
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <GraduationCap className="h-5 w-5" />
                  Student Portal Login
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" variant="ghost" className="w-full gap-2 text-slate-200 hover:text-white hover:bg-white/10">
                  <PhoneCall className="h-5 w-5" />
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Bar */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-primary">500+</div>
              <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Students Guided</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-primary">100%</div>
              <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Syllabus Coverage</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-primary">Weekly</div>
              <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Mock Tests</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-primary">Mobile PWA</div>
              <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Instant PDF Notes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Vishal Sir Introduction Section */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-2xl bg-gradient-to-tr from-primary to-blue-700 flex flex-col items-center justify-center text-white flex-shrink-0 shadow-md">
              <Award className="h-14 w-14 text-accent mb-2" />
              <span className="font-extrabold text-sm sm:text-base">Vishal Sir</span>
              <span className="text-[11px] text-accent font-semibold">Founder & Mentor</span>
            </div>

            <div className="space-y-4 flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4" />
                Mentorship that builds careers
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                Learn with Clarity, Practice with Discipline
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                At Laxmi Competition Classes, Vishal Sir focuses on simplifying tricky mathematics, reasoning puzzles, and competitive general studies. Every student is provided with individual attention, regular doubt resolution, and exam-oriented shortcut techniques needed to succeed in modern competitive tests.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="default">Basic to Advanced Math</Badge>
                <Badge variant="default">Reasoning Tricks</Badge>
                <Badge variant="default">Current Affairs & GS</Badge>
                <Badge variant="default">Special Doubt Sessions</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-12 sm:py-16 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-accent">
                Targeted Preparation
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Featured Batches & Courses
              </h2>
            </div>
            <Link href="/courses">
              <Button variant="outline" size="sm" className="gap-1.5">
                <span>View All Courses</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="flex flex-col hover:border-primary/40 hover:shadow-md transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="secondary">{course.category || "General"}</Badge>
                    <span className="text-xs font-semibold text-emerald-600">Active Batch</span>
                  </div>
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <CardDescription className="line-clamp-3 text-slate-600 leading-relaxed mb-4">
                    {course.description}
                  </CardDescription>
                  <Link href={`/courses/${course.id}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full justify-between">
                      <span>View Course Details</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Announcements Section */}
      <section className="py-12 sm:py-16 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-accent">
                Stay Updated
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Latest Notices & Announcements
              </h2>
            </div>
            <Link href="/announcements">
              <Button variant="outline" size="sm" className="gap-1.5">
                <span>All Announcements</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-primary/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 mb-2 font-medium">
                    <Bell className="h-3.5 w-3.5 text-accent" />
                    <span>{formatDate(item.published_at)}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {item.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Laxmi Classes */}
      <section className="py-12 sm:py-16 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Why Students Choose Laxmi Classes
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Designed for serious aspirants who want disciplined preparation in Sangrampur.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-primary flex items-center justify-center font-bold">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Complete Study Material</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Handcrafted chapter-wise theory notes and targeted problem sheets provided directly in class and online.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Download className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Mobile PDF Access</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enrolled students can access and download study materials directly on their smartphones anytime, anywhere.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Direct Mentorship</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Regular face-to-face interaction with Vishal Sir for exam strategy, confidence building, and doubt clearance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-primary text-white py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
            Ready to Begin Your Exam Preparation?
          </h2>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            Join hundreds of aspirants preparing for government examinations with Vishal Sir at Laxmi Competition Classes, Sangrampur.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="accent" className="w-full font-bold">
                Register as Student
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
                Visit Sangrampur Center
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
