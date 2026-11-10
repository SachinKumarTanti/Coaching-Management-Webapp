"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone || null,
          },
        },
      });

      if (authError) {
        setError(authError.message || "Failed to create account");
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // If email confirmation is enabled on Supabase, notify the user.
        // If autoconfirm is enabled, session is available immediately.
        if (data.session) {
          router.push("/dashboard");
          router.refresh();
        } else {
          setSuccess(true);
        }
      }
    } catch {
      setError("An unexpected error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Registration Successful!</h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Your account has been created. If your Supabase project requires email verification, please check your inbox to confirm your email. Otherwise, you can log in right away.
        </p>
        <div className="pt-2">
          <Link href="/login">
            <Button variant="primary" className="w-full">
              Proceed to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold text-slate-900">Create Student Account</h1>
        <p className="text-xs text-slate-500">
          Join Laxmi Competition Classes to access digital notes & enrolled batches
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Full Name"
          placeholder="e.g. Ramesh Kumar"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Mobile Number (Optional)"
          type="tel"
          placeholder="10-digit mobile number"
          pattern="[0-9]{10}"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          helperText="Used for batch notifications from Vishal Sir"
        />

        <Input
          label="Password (min. 6 characters)"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full gap-2 mt-4"
          isLoading={isLoading}
        >
          <UserPlus className="h-4 w-4" />
          Create Account
        </Button>
      </form>

      <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-600">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
