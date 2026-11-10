import { GraduationCap, Award, Target, BookOpen, HeartHandshake, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="flex flex-col">
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
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Mission */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Our Mission
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              Laxmi Competition Classes was founded in Sangrampur with a straightforward purpose: to bridge the educational opportunity gap for rural and semi-urban students aspiring for central and state government jobs.
            </p>
            <p className="text-slate-600 leading-relaxed text-base">
              We believe that quality preparation for competitive examinations should not require students to leave their hometowns or incur exorbitant expenses in distant metropolitan cities. Our mission is to provide the exact same caliber of pedagogy, rigorous practice tests, and structured notes right here in Sangrampur.
            </p>
          </div>

          {/* Vishal Sir Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary text-accent flex items-center justify-center font-extrabold text-xl">
                V
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">About Vishal Sir</h3>
                <p className="text-xs text-accent font-semibold">Founder & Chief Instructor</p>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Vishal Sir is an experienced educator and mentor known across Sangrampur for his clear teaching style in Mathematics, Reasoning, and General Studies. Over the years, he has guided hundreds of students to crack prestigious exams across SSC, Indian Railways, Bihar State Police, and Banking services.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              His pedagogical approach focuses on establishing fundamental concept mastery before introducing shortcuts. This ensures students can tackle unexpected question patterns in competitive examinations with total confidence.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Concept clarity over blind memorization</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Weekly offline mock exams with negative marking</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Personalized guidance for weaker areas</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Mobile digital PDF notes for 24/7 revision</span>
              </div>
            </div>
          </div>

          {/* Key Goals */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <HeartHandshake className="h-6 w-6 text-primary" />
              Our Core Commitments
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2">
                <h4 className="font-bold text-slate-900">Affordable Quality</h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  Keeping fees accessible for families in Sangrampur without sacrificing teaching standard or study resources.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2">
                <h4 className="font-bold text-slate-900">Disciplined Routine</h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  Strict attendance, daily practice problem sheets (DPPs), and scheduled syllabus milestones.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2">
                <h4 className="font-bold text-slate-900">Exam-Oriented Syllabus</h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  Curriculum continuously updated based on latest changes in TCS/NTA exam patterns.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2">
                <h4 className="font-bold text-slate-900">Digital Accessibility</h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  Enabling smartphone-friendly PWA access so students can revise lecture notes anytime.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-6 text-center border-t border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Want to meet Vishal Sir?</h3>
            <p className="text-sm text-slate-600 mb-4">
              Visit our coaching center in Sangrampur or call us to attend a free counseling session.
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
