"use client";

import * as React from "react";
import { User, Phone, Mail, Lock, CheckCircle2, AlertCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

export default function StudentProfilePage() {
  const [loading, setLoading] = React.useState(true);
  const [updating, setUpdating] = React.useState(false);
  const [updatingPassword, setUpdatingPassword] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("student");
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [profileMessage, setProfileMessage] = React.useState<{ text: string; type: "success" | "error" } | null>(null);
  const [passwordMessage, setPasswordMessage] = React.useState<{ text: string; type: "success" | "error" } | null>(null);

  React.useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          setEmail(user.email || "");
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profile) {
            setFullName(profile.full_name || "");
            setPhone(profile.phone || "");
            setRole(profile.role || "student");
          }
        }
      } catch {
        //
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    setUpdating(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone: phone || null,
        })
        .eq("id", user.id);

      if (error) {
        setProfileMessage({ text: error.message, type: "error" });
      } else {
        setProfileMessage({ text: "Profile updated successfully!", type: "success" });
      }
    } catch {
      setProfileMessage({ text: "Failed to update profile", type: "error" });
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({ text: "Password must be at least 6 characters", type: "error" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: "Passwords do not match", type: "error" });
      return;
    }

    setUpdatingPassword(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setPasswordMessage({ text: error.message, type: "error" });
      } else {
        setPasswordMessage({ text: "Password changed successfully!", type: "success" });
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPasswordMessage({ text: "Failed to change password", type: "error" });
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-500 text-sm">
        Loading profile details...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          My Account Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your student identity and account security
        </p>
      </div>

      {/* Basic Profile Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Personal Details</CardTitle>
            <Badge variant={role === "admin" ? "warning" : "default"} className="capitalize">
              {role} Account
            </Badge>
          </div>
          <CardDescription>
            Your registered details with Laxmi Competition Classes, Sangrampur.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profileMessage && (
            <div
              className={`p-3 rounded-lg mb-4 text-xs sm:text-sm flex items-center gap-2 ${
                profileMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              {profileMessage.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
              )}
              <span>{profileMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <Input
              label="Registered Email"
              type="email"
              value={email}
              disabled
              helperText="Email cannot be changed directly"
            />

            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              label="Mobile Number (10 digits)"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              pattern="[0-9]{10}"
              placeholder="9876543210"
              helperText="Used for batch reminders and SMS updates"
            />

            <div className="pt-2">
              <Button type="submit" variant="primary" isLoading={updating} className="w-full sm:w-auto">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Change Password</CardTitle>
          <CardDescription>
            Keep your account secure with a strong password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {passwordMessage && (
            <div
              className={`p-3 rounded-lg mb-4 text-xs sm:text-sm flex items-center gap-2 ${
                passwordMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              {passwordMessage.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
              )}
              <span>{passwordMessage.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="outline"
                isLoading={updatingPassword}
                className="w-full sm:w-auto"
              >
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
