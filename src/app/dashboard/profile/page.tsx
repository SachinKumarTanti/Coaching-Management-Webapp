import { getCurrentUser, getCurrentProfile } from "@/lib/supabase/server";
import { ProfileForm } from "./ProfileForm";

export default async function StudentProfilePage() {
  const user = await getCurrentUser();
  const profile = user ? await getCurrentProfile(user.id) : null;

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

      <ProfileForm
        initialEmail={user?.email || ""}
        initialFullName={profile?.full_name || ""}
        initialPhone={profile?.phone || ""}
        initialRole={profile?.role || "student"}
      />
    </div>
  );
}
