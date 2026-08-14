import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function logDebug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  event: string,
  details: Record<string, unknown>
) {
  try {
    await supabase.from("oauth_debug_log").insert({ event, details });
  } catch {
    // best-effort logging only
  }
}

export async function GET(request: Request) {
  const { searchParams, origin, host, hostname } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const supabase = await createClient();

  await logDebug(supabase, "callback_received", {
    origin,
    host,
    hostname,
    hasCode: !!code,
    next,
    fullUrl: request.url,
  });

  if (code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        await logDebug(supabase, "exchange_error", {
          message: error.message,
          status: error.status,
          name: error.name,
        });
        return NextResponse.redirect(
          `${origin}/login?error=${encodeURIComponent(error.message)}`
        );
      }

      if (data.user) {
        await logDebug(supabase, "exchange_success", {
          userId: data.user.id,
          email: data.user.email,
        });

        const { data: existingHost } = await supabase
          .from("hosts")
          .select("id")
          .eq("user_id", data.user.id)
          .maybeSingle();

        if (!existingHost) {
          const meta = data.user.user_metadata as Record<string, unknown>;
          const fullName =
            (meta.full_name as string) || (meta.name as string) || data.user.email || "New host";

          const { error: insertError } = await supabase.from("hosts").insert({
            user_id: data.user.id,
            full_name: fullName,
            email: data.user.email ?? "",
          });

          if (insertError) {
            await logDebug(supabase, "host_insert_error", { message: insertError.message });
          }
        }

        return NextResponse.redirect(`${origin}${next}`);
      }
    } catch (e) {
      await logDebug(supabase, "exchange_threw", {
        message: e instanceof Error ? e.message : String(e),
      });
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent("Unexpected error during sign-in")}`
      );
    }
  }

  await logDebug(supabase, "no_code_fallback", {});
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
