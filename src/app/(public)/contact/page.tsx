"use client";

import * as React from "react";
import { MapPin, Phone, Mail, MessageCircle, Clock, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    targetExam: "",
    message: "",
  });

  const contactConfig = {
    centerName: "Laxmi Competition Classes",
    director: "Vishal Sir",
    address: "Main Market Road, Near Gandhi Chowk, Sangrampur, Bihar - 813212",
    phone: "+91 98765 43210",
    email: "contact@laxmiclasses.com",
    whatsappNumber: "919876543210",
    timings: "Monday – Saturday: 6:30 AM to 6:30 PM (Sunday: 8:00 AM – 1:00 PM)",
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Vishal Sir, my name is ${formData.name || "[Name]"}. I am preparing for ${formData.targetExam || "competitive exams"} and would like information about admissions at Laxmi Competition Classes, Sangrampur.`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
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
            {/* Center Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Coaching Center Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 text-sm text-slate-700">
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 text-primary flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Center Address</span>
                      <p className="text-slate-600 mt-0.5">{contactConfig.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Direct Inquiry Phone</span>
                      <a href={`tel:${contactConfig.phone}`} className="text-primary hover:underline font-medium">
                        {contactConfig.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Email Address</span>
                      <a href={`mailto:${contactConfig.email}`} className="text-primary hover:underline">
                        {contactConfig.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Center Timings</span>
                      <p className="text-slate-600 mt-0.5">{contactConfig.timings}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Direct WhatsApp Callout */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-bold text-emerald-900 flex items-center justify-center sm:justify-start gap-2">
                    <MessageCircle className="h-5 w-5 text-emerald-600" />
                    Instant WhatsApp Support
                  </h4>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Message directly on WhatsApp for quick batch schedule and admission queries.
                  </p>
                </div>
                <a
                  href={`https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(
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
                    <h3 className="text-lg font-bold text-slate-900">Inquiry Received!</h3>
                    <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
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
                      placeholder="e.g. 9876543210"
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
                        href={`https://wa.me/${contactConfig.whatsappNumber}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto"
                      >
                        <Button type="button" variant="outline" className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50 gap-2">
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
