import { createClient } from "@/lib/supabase/server";
import { AnnouncementsManager } from "./AnnouncementsManager";

export default async function AdminAnnouncementsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .order("published_at", { ascending: false });

  const initialAnnouncements = data || [];

  return <AnnouncementsManager initialAnnouncements={initialAnnouncements} />;
}
