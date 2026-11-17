"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  GraduationCap,
  Award,
  FileText,
  CheckCircle2,
  PhoneCall,
  Clock,
  Flame,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SlideData {
  badge: string;
  badgeIcon: React.ElementType;
  title: string;
  titleHighlight: string;
  subtitle: string;
  description: string;
  primaryCta: { label: string; href: string; icon: React.ElementType };
  secondaryCta: { label: string; href: string; icon: React.ElementType };
  featurePills: string[];
  graphicType: "foundation" | "pwa" | "tests";
}

const slides: SlideData[] = [
  {
    badge: "Admissions Open for Session 2026-2027",
    badgeIcon: Flame,
    title: "Crack SSC, Railway & State Exams with",
    titleHighlight: "Laxmi Competition Classes",
    subtitle: "Directed with dedicated mentorship by Vishal Sir in Sangrampur",
    description:
      "Comprehensive syllabus coverage, daily math shortcut techniques, and disciplined classroom coaching crafted to make you exam-ready.",
    primaryCta: { label: "Explore Batches", href: "/courses", icon: BookOpen },
    secondaryCta: { label: "Student Login", href: "/login", icon: GraduationCap },
    featurePills: ["Daily Practice Sheets", "Maths & Reasoning Tricks", "Offline + App Access"],
    graphicType: "foundation",
  },
  {
    badge: "Smart Learning Ecosystem",
    badgeIcon: Sparkles,
    title: "Handcrafted Study Notes &",
    titleHighlight: "Instant Mobile PDF Access",
    subtitle: "Revision anywhere, anytime on your smartphone",
    description:
      "All enrolled students receive curated chapter notes, formula sheets, and solved previous year questions accessible directly through our student portal.",
    primaryCta: { label: "View Study Materials", href: "/courses", icon: FileText },
    secondaryCta: { label: "Contact Vishal Sir", href: "/contact", icon: PhoneCall },
    featurePills: ["Instant PDF Download", "Mobile PWA Ready", "Updated GS & Current Affairs"],
    graphicType: "pwa",
  },
  {
    badge: "Sunday All-India Pattern Test Series",
    badgeIcon: Award,
    title: "Rigorous Mock Tests &",
    titleHighlight: "Real-Time Doubt Clearance",
    subtitle: "Speed, accuracy, and examination temperament",
    description:
      "Weekly full-length mock tests strictly aligned with the latest SSC CGL/CHSL, Railway NTPC, and Bihar Police exam blueprints with live question breakdowns.",
    primaryCta: { label: "Check Announcements", href: "/announcements", icon: Award },
    secondaryCta: { label: "Visit Our Center", href: "/contact", icon: Clock },
    featurePills: ["OMR & Speed Practice", "Personalized Weakness Analysis", "Exam Temperament"],
    graphicType: "tests",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  const totalSlides = slides.length;

  const nextSlide = React.useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = React.useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-play interval
  React.useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const current = slides[currentSlide];
  const BadgeIcon = current.badgeIcon;
  const PrimaryIcon = current.primaryCta.icon;
  const SecondaryIcon = current.secondaryCta.icon;

  return (
    <div
      className="relative overflow-hidden bg-gradient-to-b from-primary via-slate-900 to-slate-950 text-white select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Decorative background grid and gradients */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Slide Content Area */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Text & Call to Actions */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-5">
            {/* Slide Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-accent border border-accent/25 backdrop-blur-md shadow-sm">
              <BadgeIcon className="h-4 w-4" />
              <span>{current.badge}</span>
            </div>

            {/* Title with Gradient Highlight */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {current.title} <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-amber-300 to-yellow-200">
                {current.titleHighlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg font-medium text-slate-300">
              {current.subtitle}
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {current.description}
            </p>

            {/* Feature Check Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              {current.featurePills.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-xs font-medium text-slate-200"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  <span>{pill}</span>
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link href={current.primaryCta.href} className="w-full sm:w-auto">
                <Button size="lg" variant="accent" className="w-full gap-2 shadow-lg font-bold">
                  <PrimaryIcon className="h-5 w-5" />
                  <span>{current.primaryCta.label}</span>
                </Button>
              </Link>

              <Link href={current.secondaryCta.href} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  <SecondaryIcon className="h-5 w-5" />
                  <span>{current.secondaryCta.label}</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Graphic Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Outer decorative glow */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-accent/30 via-primary/40 to-blue-600/30 blur-lg opacity-75" />

              {/* Graphic Card Canvas */}
              <div className="relative rounded-2xl bg-slate-900/90 border border-slate-700/80 p-6 sm:p-7 shadow-2xl backdrop-blur-md space-y-4">
                {current.graphicType === "foundation" && (
                  <div className="space-y-4">
                    {/* Mentor Photo Spotlight */}
                    <div className="relative rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950/80 aspect-[4/3] group">
                      <Image
                        src="/images/professional_vishal_sir.jpeg"
                        alt="Vishal Sir - Founder & Director, Laxmi Competition Classes"
                        fill
                        priority
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                      
                      {/* Overlay Badge */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-accent text-slate-950 text-[11px] font-extrabold uppercase tracking-wider mb-1">
                            Chief Instructor
                          </div>
                          <h4 className="text-base font-extrabold text-white leading-tight">
                            Vishal Sir
                          </h4>
                          <p className="text-xs text-accent font-medium">
                            Maths, Reasoning & General Studies
                          </p>
                        </div>
                        <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700 px-2 py-1 rounded-lg">
                          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                          <span className="text-xs font-bold text-white">4.9/5</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Highlights */}
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="p-2 rounded-lg bg-slate-800/70 border border-slate-700/60">
                        <p className="font-bold text-accent">500+ Aspirants</p>
                        <p className="text-[10px] text-slate-400">Trained in Sangrampur</p>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-800/70 border border-slate-700/60">
                        <p className="font-bold text-emerald-400">Daily DPP & Tests</p>
                        <p className="text-[10px] text-slate-400">Offline + Mobile Portal</p>
                      </div>
                    </div>
                  </div>
                )}

                {current.graphicType === "pwa" && (
                  <>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center space-x-2">
                        <div className="h-9 w-9 rounded-lg bg-blue-500 text-white flex items-center justify-center font-black">
                          PDF
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Study Notes Portal</p>
                          <p className="text-[11px] text-blue-300 font-medium">LCC Mobile Student App</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        PWA Ready
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="p-3 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-accent flex-shrink-0" />
                        <div className="truncate">
                          <p className="text-xs font-bold text-white truncate">Quantitative Aptitude Formulae</p>
                          <p className="text-[11px] text-slate-400">Geometry, Algebra & Arithmetic</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-accent flex-shrink-0" />
                        <div className="truncate">
                          <p className="text-xs font-bold text-white truncate">General Science Fast Revision</p>
                          <p className="text-[11px] text-slate-400">Physics, Chemistry, Biology Notes</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                      <span>Available 24/7 on Phone</span>
                      <span className="text-emerald-400 font-semibold">1-Click Downloads</span>
                    </div>
                  </>
                )}

                {current.graphicType === "tests" && (
                  <>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center space-x-2">
                        <div className="h-9 w-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                          100
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Weekly Mock Test Series</p>
                          <p className="text-[11px] text-accent font-medium">Sunday Offline Test</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Strict Timing
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-3 rounded-lg bg-slate-800/70 border border-slate-700/60">
                        <p className="text-lg font-black text-accent">100 Qs</p>
                        <p className="text-[11px] text-slate-400">Exam Pattern</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-800/70 border border-slate-700/60">
                        <p className="text-lg font-black text-emerald-400">Instant</p>
                        <p className="text-[11px] text-slate-400">Discussion</p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300 text-center font-medium">
                      Concept explanations & error review led by Vishal Sir
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Controls (Arrows + Dot Indicators) */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between">
          {/* Slide Indicator Dots */}
          <div className="flex items-center space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "w-8 bg-accent"
                    : "w-2.5 bg-slate-700 hover:bg-slate-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
            <span className="text-xs text-slate-400 ml-2 font-medium">
              0{currentSlide + 1} / 0{totalSlides}
            </span>
          </div>

          {/* Prev / Next Arrow Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
