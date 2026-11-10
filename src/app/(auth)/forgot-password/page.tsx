"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=/dashboard/profile`,
      });

      if (resetError) {
        setError(resetError.message || "Failed to send reset email");
      } else {
        setIsSuccess(true);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Login</span>
      </Link>

      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold text-slate-900">Reset Your Password</h1>
        <p className="text-xs text-slate-500">
          Enter your registered email address to receive password reset instructions
        </p>
      </div>

      {isSuccess ? (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
            Password reset link has been dispatched to <strong>{email}</strong>. Please check your inbox and follow the instructions.
          </p>
          <div className="pt-2">
            <Link href="/login">
              <Button variant="outline" size="sm" className="w-full">
                Return to Login
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Registered Email"
            type="email"
            placeholder="your.email@example.com"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full gap-2"
            isLoading={isLoading}
          >
            <Mail className="h-4 w-4" />
            Send Reset Instructions
          </Button>
        </form>
      )}
    </div>
  );
}
