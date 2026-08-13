import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(error.message)}`
      );
    }

    if (data.user) {
      const { data: existingHost } = await supabase
        .from("hosts")
        .select("id")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (!existingHost) {
        const meta = data.user.user_metadata as Record<string, unknown>;
        const fullName =
          (meta.full_name as string) || (meta.name as string) || data.user.email || "New host";

        await supabase.from("hosts").insert({
          user_id: data.user.id,
          full_name: fullName,
          email: data.user.email ?? "",
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
