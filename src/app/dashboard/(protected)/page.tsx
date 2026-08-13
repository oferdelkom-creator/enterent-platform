import { createClient } from "@/lib/supabase/server";
import ProfileForm from "./profile-form";

export default async function DashboardProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: host } = await supabase
    .from("hosts")
    .select("full_name, phone, city, country, airbnb_profile_url, verification_status")
    .eq("user_id", user!.id)
    .maybeSingle();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Your profile</h1>
      <p className="mt-1 text-sm text-slate-500">
        Keep this up to date — verified hosts get priority for swaps and backup requests.
      </p>

      <div className="mt-6">
        <ProfileForm host={host} />
      </div>
    </div>
  );
}
