"use client";

import * as React from "react";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
  Facebook,
  Instagram,
  Youtube,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CONTACT_INFO } from "@/lib/constants";

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    targetExam: "",
    message: "",
  });

  const whatsappMessage = encodeURIComponent(
    `Hello Vishal Sir, my name is ${formData.name || "[Name]"}. I am preparing for ${
      formData.targetExam || "competitive exams"
    } and would like information about admissions at Laxmi Competition Classes, Sangrampur.`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <Badge variant="warning" className="uppercase tracking-wider">
            Get In Touch
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Contact Laxmi Competition Classes
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Have questions about upcoming batches, offline counseling, or digital study notes? Reach out to Vishal Sir.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Center Information & Socials */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Coaching Center Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 text-sm text-slate-700 dark:text-slate-300">
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-primary dark:text-blue-300 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">Center Address</span>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5">{CONTACT_INFO.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">Direct Inquiry Phone</span>
                      <a
                        href={CONTACT_INFO.phoneHref}
                        className="text-primary dark:text-accent hover:underline font-medium"
                      >
                        {CONTACT_INFO.phoneDisplay}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">Email Address</span>
                      <a
                        href={CONTACT_INFO.emailHref}
                        className="text-primary dark:text-accent hover:underline"
                      >
                        {CONTACT_INFO.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">Center Timings</span>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5">{CONTACT_INFO.timings}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Direct WhatsApp Callout */}
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-6 text-emerald-950 dark:text-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-100 flex items-center justify-center sm:justify-start gap-2">
                    <MessageCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    Instant WhatsApp Support
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                    Chat directly with Vishal Sir on {CONTACT_INFO.phoneDisplay} for batch schedules, fee inquiries, and seat availability.
                  </p>
                </div>
                <a
                  href={`${CONTACT_INFO.whatsappHref}?text=${encodeURIComponent(
                    "Hello Vishal Sir, I want to inquire about batches at Laxmi Competition Classes Sangrampur."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0"
                >
                  <Button variant="accent" size="md" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Chat on WhatsApp
                  </Button>
                </a>
              </div>

              {/* Official Social Media Channels */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Connect with Vishal Sir Online</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Follow official video lectures, exam analysis, and daily updates directly on Vishal Sir&apos;s channels:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    {/* YouTube */}
                    <a
                      href={CONTACT_INFO.socials.youtube.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-red-500/50 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center flex-shrink-0">
                        <Youtube className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-red-600 dark:group-hover:text-red-400">
                          YouTube
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {CONTACT_INFO.socials.youtube.username}
                        </p>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-red-500 flex-shrink-0" />
                    </a>

                    {/* Facebook */}
                    <a
                      href={CONTACT_INFO.socials.facebook.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <Facebook className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          Facebook
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {CONTACT_INFO.socials.facebook.username}
                        </p>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-500 flex-shrink-0" />
                    </a>

                    {/* Instagram */}
                    <a
                      href={CONTACT_INFO.socials.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-pink-500/50 hover:bg-pink-50/50 dark:hover:bg-pink-950/20 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-950/60 text-pink-600 flex items-center justify-center flex-shrink-0">
                        <Instagram className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-pink-600 dark:group-hover:text-pink-400">
                          Instagram
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {CONTACT_INFO.socials.instagram.username}
                        </p>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-pink-500 flex-shrink-0" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Inquiry Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send an Online Inquiry</CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="p-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Inquiry Received!</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                      Thank you, {formData.name}. Vishal Sir or the center team will respond to your phone number ({formData.phone}) shortly.
                    </p>
                    <div className="pt-3">
                      <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                        Send Another Inquiry
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="Your Full Name"
                      placeholder="e.g. Ramesh Kumar"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <Input
                      label="10-Digit Mobile Number"
                      type="tel"
                      placeholder="e.g. 9534932440"
                      required
                      pattern="[0-9]{10}"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />

                    <Input
                      label="Target Examination"
                      placeholder="e.g. SSC CGL, Railway NTPC, Bihar Police"
                      value={formData.targetExam}
                      onChange={(e) => setFormData({ ...formData, targetExam: e.target.value })}
                    />

                    <Textarea
                      label="Your Question or Inquiry"
                      placeholder="Ask about batch timings, fees, or study materials..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />

                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <Button type="submit" variant="primary" className="w-full sm:w-auto gap-2">
                        <Send className="h-4 w-4" />
                        Submit Inquiry
                      </Button>
                      <a
                        href={`${CONTACT_INFO.whatsappHref}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto"
                      >
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 gap-2"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Send via WhatsApp
                        </Button>
                      </a>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
