import {
  GraduationCap,
  Award,
  Target,
  BookOpen,
  HeartHandshake,
  CheckCircle,
  Youtube,
  Facebook,
  Instagram,
  MessageCircle,
  Phone,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CONTACT_INFO } from "@/lib/constants";

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
            Sangrampur, Bihar
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            About Laxmi Competition Classes
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Committed to transforming aspirations into reality through disciplined coaching, high-standard study materials, and personal mentorship by Vishal Sir.
          </p>
        </div>
      </section>

      {/* Main Story & Vision */}
      <section className="py-12 sm:py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Mission */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="h-6 w-6 text-primary dark:text-accent" />
              Our Mission
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
              Laxmi Competition Classes was founded in Sangrampur with a straightforward purpose: to bridge the educational opportunity gap for rural and semi-urban students aspiring for central and state government jobs.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
              We believe that quality preparation for competitive examinations should not require students to leave their hometowns or incur exorbitant expenses in distant metropolitan cities. Our mission is to provide the exact same caliber of pedagogy, rigorous practice tests, and structured notes right here in Sangrampur.
            </p>
          </div>

          {/* Vishal Sir Section */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden ring-2 ring-accent/40 flex-shrink-0 shadow-md bg-slate-900">
                  <Image
                    src="/images/professional_vishal_sir.jpeg"
                    alt="Vishal Sir - Chief Instructor"
                    fill
                    className="object-cover object-top"
                    sizes="80px"
                  />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">About Vishal Sir</h3>
                  <p className="text-xs sm:text-sm text-accent font-semibold">Founder & Chief Instructor</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Sangrampur, Bihar</p>
                </div>
              </div>

              <a
                href={`${CONTACT_INFO.whatsappHref}?text=${encodeURIComponent(
                  "Hello Vishal Sir, I am interested in joining Laxmi Competition Classes Sangrampur."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-colors w-fit"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              Vishal Sir is an experienced educator and mentor known across Sangrampur for his clear teaching style in Mathematics, Reasoning, and General Studies. Over the years, he has guided hundreds of students to crack prestigious exams across SSC, Indian Railways, Bihar State Police, and Banking services.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              His pedagogical approach focuses on establishing fundamental concept mastery before introducing shortcuts. This ensures students can tackle unexpected question patterns in competitive examinations with total confidence.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Concept clarity over blind memorization</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Weekly offline mock exams with negative marking</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Personalized guidance for weaker areas</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Mobile digital PDF notes for 24/7 revision</span>
              </div>
            </div>

            {/* Social channels of Vishal Sir */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Official Channels & Profiles
              </span>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <a
                  href={CONTACT_INFO.socials.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-red-500 hover:text-red-600 transition-colors"
                >
                  <Youtube className="h-3.5 w-3.5 text-red-600" />
                  <span>YouTube ({CONTACT_INFO.socials.youtube.username})</span>
                </a>

                <a
                  href={CONTACT_INFO.socials.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  <Facebook className="h-3.5 w-3.5 text-blue-600" />
                  <span>Facebook</span>
                </a>

                <a
                  href={CONTACT_INFO.socials.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-pink-500 hover:text-pink-600 transition-colors"
                >
                  <Instagram className="h-3.5 w-3.5 text-pink-600" />
                  <span>Instagram</span>
                </a>

                <a
                  href={CONTACT_INFO.phoneHref}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-primary hover:text-primary transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-accent" />
                  <span>{CONTACT_INFO.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Classroom Atmosphere & Mentorship Spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 items-center transition-colors">
            <div className="md:col-span-5 relative aspect-[4/3] rounded-xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 bg-slate-900">
              <Image
                src="/images/casual_vishal_sir.jpeg"
                alt="Vishal Sir mentoring students in classroom"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 350px"
              />
            </div>
            <div className="md:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
                Classroom Culture
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Direct Mentorship & Real-Time Doubt Solving
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                At Laxmi Competition Classes, students are never treated as mere roll numbers. Vishal Sir stays after regular batch lectures to personally verify student calculations, address concept gaps, and provide exam-day temperament tips.
              </p>
              <div className="pt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>• Offline Doubt Clearing</span>
                <span>• Weekly OMR Practice</span>
                <span>• Free Counseling</span>
              </div>
            </div>
          </div>

          {/* Key Goals */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HeartHandshake className="h-6 w-6 text-primary dark:text-accent" />
              Our Core Commitments
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">Affordable Quality</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Keeping fees accessible for families in Sangrampur without sacrificing teaching standard or study resources.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">Disciplined Routine</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Strict attendance, daily practice problem sheets (DPPs), and scheduled syllabus milestones.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">Exam-Oriented Syllabus</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Curriculum continuously updated based on latest changes in TCS/NTA exam patterns.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">Digital Accessibility</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Enabling smartphone-friendly PWA access so students can revise lecture notes anytime.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-6 text-center border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Want to meet Vishal Sir?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Visit our coaching center in Sangrampur or call {CONTACT_INFO.phoneDisplay} to attend a free counseling session.
            </p>
            <div className="flex justify-center gap-3">
              <Link href="/contact">
                <Button variant="primary">Contact Our Center</Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline">Browse Courses</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
