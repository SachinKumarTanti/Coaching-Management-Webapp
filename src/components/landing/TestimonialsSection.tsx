"use client";

import * as React from "react";
import { Star, MessageSquarePlus, CheckCircle2, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewModal } from "@/components/feedback/ReviewModal";
import { Review } from "@/types";

interface TestimonialsSectionProps {
  initialReviews?: Review[];
}

const fallbackTestimonials = [
  {
    name: "Rakesh Kumar",
    exam: "Qualified Railway Group D",
    location: "Sangrampur",
    quote:
      "Vishal Sir's unique shortcuts in General Science and Mathematics transformed my score. The Sunday mock tests helped me manage time under real exam pressure.",
    rating: 5,
    isVerified: false,
  },
  {
    name: "Pooja Kumari",
    exam: "SSC CHSL Aspirant",
    location: "Tarapur",
    quote:
      "Having mobile PDF notes readily available on the portal allowed me to revise formulas while traveling. Individual doubt sessions by Vishal Sir make a huge difference.",
    rating: 5,
    isVerified: false,
  },
  {
    name: "Amit Singh",
    exam: "Bihar Police Selection",
    location: "Sangrampur",
    quote:
      "Disciplined environment, daily problem sheets, and concept-based GS discussions helped me stay focused and clear the competitive cutoff.",
    rating: 5,
    isVerified: false,
  },
];

export function TestimonialsSection({
  initialReviews = [],
}: TestimonialsSectionProps) {
  const [reviewModalOpen, setReviewModalOpen] = React.useState(false);
  const [reviews, setReviews] = React.useState<Review[]>(initialReviews);

  // Combine user-submitted published reviews with fallback curated testimonials
  const allTestimonials = React.useMemo(() => {
    const userReviews = reviews.map((r) => ({
      name: r.author_name,
      exam: r.author_role || "Student Aspirant",
      location: "Verified Student",
      quote: r.content,
      rating: r.rating,
      isVerified: true,
    }));

    return [...userReviews, ...fallbackTestimonials];
  }, [reviews]);

  return (
    <section className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent uppercase tracking-wider">
              <Star className="h-4 w-4 fill-accent" />
              Student Testimonials & Reviews
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Voices of Sangrampur Aspirants
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl">
              Real feedback from students preparing for SSC, Railway, Banking, and Police examinations with Vishal Sir.
            </p>
          </div>

          <Button
            onClick={() => setReviewModalOpen(true)}
            variant="outline"
            className="gap-2 border-primary/40 text-primary dark:text-accent hover:bg-primary/5 dark:hover:bg-accent/10 flex-shrink-0"
          >
            <MessageSquarePlus className="h-4 w-4" />
            <span>Share Your Review</span>
          </Button>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allTestimonials.slice(0, 6).map((t, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-primary/40 dark:hover:border-accent/40 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-accent">
                    {[...Array(t.rating || 5)].map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>

                  {t.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {t.name}
                  </p>
                  <p className="text-xs text-accent font-semibold">{t.exam}</p>
                </div>
                <span className="text-[11px] text-slate-400">{t.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
      />
    </section>
  );
}
