"use client";

import * as React from "react";
import Link from "next/link";
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Bug,
  MessageSquarePlus,
} from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";
import { BugReportModal } from "@/components/feedback/BugReportModal";
import { ReviewModal } from "@/components/feedback/ReviewModal";

export function Footer() {
  const [bugModalOpen, setBugModalOpen] = React.useState(false);
  const [reviewModalOpen, setReviewModalOpen] = React.useState(false);

  const whatsappText = encodeURIComponent(
    "Hello Vishal Sir, I want to inquire about admission at Laxmi Competition Classes."
  );

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand Info & Socials */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-slate-950 font-bold">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {CONTACT_INFO.centerName}
                </h3>
                <p className="text-xs text-accent font-semibold">
                  Sangrampur • Directed by {CONTACT_INFO.director}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Empowering youth from Sangrampur and neighboring regions with concept-based coaching, daily practice tests, and structured guidance for SSC, Railway, Banking, and State Government competitive exams.
            </p>

            {/* Direct Connect Buttons: WhatsApp & Socials */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={`${CONTACT_INFO.whatsappHref}?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Vishal Sir</span>
              </a>

              <div className="flex items-center gap-2">
                <a
                  href={CONTACT_INFO.socials.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Vishal Sir on YouTube"
                  className="h-9 w-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-500 hover:border-red-500/50 flex items-center justify-center transition-colors"
                  title="YouTube - Lakshmi Classes"
                >
                  <Youtube className="h-4 w-4" />
                </a>

                <a
                  href={CONTACT_INFO.socials.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Vishal Sir on Facebook"
                  className="h-9 w-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-500 hover:border-blue-500/50 flex items-center justify-center transition-colors"
                  title="Facebook - Vishal Raj"
                >
                  <Facebook className="h-4 w-4" />
                </a>

                <a
                  href={CONTACT_INFO.socials.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Vishal Sir on Instagram"
                  className="h-9 w-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-pink-500 hover:border-pink-500/50 flex items-center justify-center transition-colors"
                  title="Instagram - @mr.vishal__raj"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-accent transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="hover:text-accent transition-colors">
                  Notices & Updates
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  About Vishal Sir
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">
                  Contact Center
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-accent transition-colors">
                  Student Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Center Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Center Details
            </h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-start space-x-2.5">
                <MapPin className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                <span>{CONTACT_INFO.addressShort}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-accent flex-shrink-0" />
                <a
                  href={CONTACT_INFO.phoneHref}
                  className="hover:text-white transition-colors"
                >
                  {CONTACT_INFO.phoneDisplay} (Inquiry)
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 text-accent flex-shrink-0" />
                <a
                  href={CONTACT_INFO.emailHref}
                  className="hover:text-white transition-colors"
                >
                  {CONTACT_INFO.email}
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Clock className="h-4 w-4 text-accent flex-shrink-0" />
                <span>Mon - Sat: 6:30 AM - 6:30 PM</span>
              </div>
            </div>

            {/* Feedback & Bug Reporting Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => setReviewModalOpen(true)}
                className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-accent transition-colors text-left"
              >
                <MessageSquarePlus className="h-3.5 w-3.5 text-accent" />
                <span>Submit Student Feedback</span>
              </button>
              <button
                onClick={() => setBugModalOpen(true)}
                className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors text-left"
              >
                <Bug className="h-3.5 w-3.5 text-rose-400" />
                <span>Report Website Bug / Issue</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Laxmi Competition Classes, Sangrampur. Directed by Vishal Sir.</p>
          <div className="flex items-center gap-4">
            <a
              href={CONTACT_INFO.socials.youtube.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              YouTube
            </a>
            <span>•</span>
            <a
              href={CONTACT_INFO.socials.facebook.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              Facebook
            </a>
            <span>•</span>
            <a
              href={CONTACT_INFO.socials.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              Instagram
            </a>
            <span>•</span>
            <button
              onClick={() => setBugModalOpen(true)}
              className="hover:text-rose-400 transition-colors flex items-center gap-1"
            >
              <Bug className="h-3 w-3" />
              <span>Report Bug</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Bug Report Modal */}
      <BugReportModal
        isOpen={bugModalOpen}
        onClose={() => setBugModalOpen(false)}
      />

      {/* Global Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
      />
    </footer>
  );
}
