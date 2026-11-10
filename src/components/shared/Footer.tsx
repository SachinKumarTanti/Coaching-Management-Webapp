import Link from "next/link";
import { GraduationCap, MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";

export function Footer() {
  const whatsappNumber = "919876543210"; // Placeholder config
  const whatsappText = encodeURIComponent("Hello Vishal Sir, I want to inquire about admission at Laxmi Competition Classes.");

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-slate-950 font-bold">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">
                  Laxmi Competition Classes
                </h3>
                <p className="text-xs text-accent font-semibold">
                  Sangrampur • Directed by Vishal Sir
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Empowering youth from Sangrampur and neighboring regions with concept-based coaching, daily practice tests, and structured guidance for SSC, Railway, Banking, and State Government competitive exams.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat on WhatsApp</span>
              </a>
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
                <span>Main Market Road, Sangrampur, Bihar</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-accent flex-shrink-0" />
                <span>+91 98765 43210 (Inquiry)</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 text-accent flex-shrink-0" />
                <span>info@laxmiclasses.com</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Clock className="h-4 w-4 text-accent flex-shrink-0" />
                <span>Mon - Sat: 6:30 AM - 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Laxmi Competition Classes, Sangrampur. All rights reserved.</p>
          <p>Designed for mobile students & fast learning.</p>
        </div>
      </div>
    </footer>
  );
}
