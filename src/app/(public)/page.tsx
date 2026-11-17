import Link from "next/link";
import Image from "next/image";
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
  Star,
  Quote,
  ShieldCheck,
  MessageCircle,
  Youtube,
  Facebook,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroSlider } from "@/components/landing/HeroSlider";
import { CourseCategoryFilter } from "@/components/landing/CourseCategoryFilter";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { createPublicClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { CONTACT_INFO } from "@/lib/constants";
import { Review } from "@/types";

// Enable Incremental Static Regeneration (ISR) - cached at the Edge and refreshed every 60s
export const revalidate = 60;

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
  {
    id: "c4",
    title: "Bihar Police & Daroga Special Target",
    description: "Dedicated batch focusing on Bihar Special GK, History, Geography, Science, and Hindi with weekly practice sets.",
    category: "State Police",
  },
];

const fallbackAnnouncements = [
  {
    id: "a1",
    title: "Admissions Open for New Morning Batch 2026-2027",
    content: "New batches starting this Monday at our Sangrampur center. Visit center or contact Vishal Sir directly for seat reservation.",
    published_at: new Date().toISOString(),
  },
  {
    id: "a2",
    title: "Sunday Special Full-Length Mock Test",
    content: "All registered students are invited for the offline test followed by instant solution discussions and rank declaration.",
    published_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const testimonials = [
  {
    name: "Rakesh Kumar",
    exam: "Qualified Railway Group D",
    location: "Sangrampur",
    quote:
      "Vishal Sir's unique shortcuts in General Science and Mathematics transformed my score. The Sunday mock tests helped me manage time under real exam pressure.",
  },
  {
    name: "Pooja Kumari",
    exam: "SSC CHSL Aspirant",
    location: "Tarapur",
    quote:
      "Having mobile PDF notes readily available on the portal allowed me to revise formulas while traveling. Individual doubt sessions by Vishal Sir make a huge difference.",
  },
  {
    name: "Amit Singh",
    exam: "Bihar Police Selection",
    location: "Sangrampur",
    quote:
      "Disciplined environment, daily problem sheets, and concept-based GS discussions helped me stay focused and clear the competitive cutoff.",
  },
];

export default async function HomePage() {
  let courses = fallbackCourses;
  let announcements = fallbackAnnouncements;
  let reviews: Review[] = [];

  try {
    const supabase = createPublicClient();
    const [coursesRes, announcementsRes, reviewsRes] = await Promise.all([
      supabase.from("courses").select("id, title, description, category").eq("is_active", true).limit(6),
      supabase
        .from("announcements")
        .select("id, title, content, published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(2),
      supabase
        .from("reviews")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

    if (coursesRes.data && coursesRes.data.length > 0) {
      courses = coursesRes.data;
    }
    if (announcementsRes.data && announcementsRes.data.length > 0) {
      announcements = announcementsRes.data;
    }
    if (reviewsRes.data && reviewsRes.data.length > 0) {
      reviews = reviewsRes.data;
    }
  } catch {
    // Keep fallback data
  }

  const whatsappText = encodeURIComponent("Hello Vishal Sir, I want to inquire about admission at Laxmi Competition Classes.");

  return (
    <div className="flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* 1. Interactive Hero Slider */}
      <HeroSlider />

      {/* 2. Highlights Stat Bar */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black text-primary dark:text-accent">500+</div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Students Guided</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black text-primary dark:text-accent">100%</div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Syllabus Coverage</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black text-primary dark:text-accent">Weekly</div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Mock Test Series</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black text-primary dark:text-accent">Mobile PWA</div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Instant PDF Notes</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Vishal Sir Introduction & Mentorship Section */}
      <section className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm flex flex-col md:flex-row items-center gap-8 transition-colors">
            {/* Visual Icon Badge */}
            <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-2xl bg-gradient-to-tr from-primary to-blue-700 flex flex-col items-center justify-center text-white flex-shrink-0 shadow-lg border border-white/10">
              <Award className="h-14 w-14 text-accent mb-2" />
              <span className="font-extrabold text-base sm:text-lg">Vishal Sir</span>
              <span className="text-xs text-accent font-semibold">Founder & Lead Mentor</span>
            </div>

            <div className="space-y-4 flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4" />
                Mentorship that builds careers
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug">
                Learn with Clarity, Practice with Discipline
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                At Laxmi Competition Classes, Vishal Sir focuses on simplifying tricky mathematics, reasoning puzzles, and competitive general studies. Every student receives personal attention, regular doubt resolution, and exam-oriented shortcut techniques needed to succeed in modern competitive tests.
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

      {/* 4. Interactive Featured Courses Section */}
      <section className="py-12 sm:py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-accent">
                Targeted Preparation
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
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

          {/* Instant Client Filter Component */}
          <CourseCategoryFilter initialCourses={courses} />
        </div>
      </section>

      {/* 5. Mentor Spotlight: Vishal Sir in Classroom */}
      <section className="py-12 sm:py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            {/* Image Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-slate-950 group">
                <Image
                  src="/images/casual_vishal_sir.jpeg"
                  alt="Vishal Sir mentoring competitive exam aspirants"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 450px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div>
                    <p className="text-xs font-semibold text-accent uppercase tracking-wider">Sangrampur Coaching</p>
                    <p className="text-base font-bold">Vishal Sir in Session</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm border border-white/30">
                    Offline Batches
                  </span>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
                <Users className="h-3.5 w-3.5" />
                Personal Guidance & Concept Mastery
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Learn Directly from Vishal Sir
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Competitive exams require more than just rote learning. Vishal Sir breaks down complex mathematical formulas and logical reasoning patterns into intuitive, step-by-step techniques tailored for students in Sangrampur.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Concept building from zero level</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Time-saving exam shortcuts</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Handcrafted daily practice sheets (DPP)</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>After-class 1-on-1 doubt clearing</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={`${CONTACT_INFO.whatsappHref}?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="accent" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>Inquire on WhatsApp</span>
                  </Button>
                </a>
                <Link href="/about">
                  <Button variant="outline" className="gap-2">
                    <span>Learn More About Vishal Sir</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Dynamic Testimonials & User Reviews */}
      <TestimonialsSection initialReviews={reviews} />

      {/* 6. Latest Announcements Section */}
      <section className="py-12 sm:py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-accent">
                Stay Updated
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
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
                className="bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-primary/40 dark:hover:border-accent/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                    <Bell className="h-3.5 w-3.5 text-accent" />
                    <span>{formatDate(item.published_at)}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {item.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Why Choose Laxmi Classes Grid */}
      <section className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Why Students Choose Laxmi Classes
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Designed for serious aspirants who want disciplined preparation in Sangrampur.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-primary dark:text-blue-300 flex items-center justify-center font-bold">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Complete Study Material</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Handcrafted chapter-wise theory notes and targeted problem sheets provided directly in class and online.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                <Download className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Mobile PDF Access</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Enrolled students can access and download study materials directly on their smartphones anytime, anywhere.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Direct Mentorship</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Regular face-to-face interaction with Vishal Sir for exam strategy, confidence building, and doubt clearance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Bottom CTA Banner with WhatsApp & Center Contact */}
      <section className="bg-gradient-to-r from-primary via-slate-900 to-primary text-white py-14 px-4 sm:px-6 lg:px-8 text-center border-t border-slate-800">
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3.5 py-1 text-xs font-semibold text-accent border border-accent/30">
            <Sparkles className="h-4 w-4" />
            <span>Start Your Government Job Journey</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black leading-tight">
            Ready to Begin Your Exam Preparation?
          </h2>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            Join hundreds of aspirants preparing for SSC, Railway, Banking, and Police examinations with Vishal Sir at Laxmi Competition Classes, Sangrampur.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="accent" className="w-full font-bold shadow-lg">
                Register as Student
              </Button>
            </Link>

            <a
              href={`${CONTACT_INFO.whatsappHref}?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
              >
                <MessageCircle className="h-5 w-5" />
                <span>WhatsApp Vishal Sir</span>
              </Button>
            </a>

            <Link href="/contact" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                Visit Center
              </Button>
            </Link>
          </div>

          {/* Social channels of Vishal Sir */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs text-slate-300">
            <span className="text-slate-400 font-medium">Connect with Vishal Sir:</span>
            <a
              href={CONTACT_INFO.socials.youtube.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-400 flex items-center gap-1.5 transition-colors font-medium"
            >
              <Youtube className="h-4 w-4 text-red-500" />
              <span>YouTube</span>
            </a>
            <span>•</span>
            <a
              href={CONTACT_INFO.socials.facebook.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 flex items-center gap-1.5 transition-colors font-medium"
            >
              <Facebook className="h-4 w-4 text-blue-500" />
              <span>Facebook</span>
            </a>
            <span>•</span>
            <a
              href={CONTACT_INFO.socials.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400 flex items-center gap-1.5 transition-colors font-medium"
            >
              <Instagram className="h-4 w-4 text-pink-500" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
