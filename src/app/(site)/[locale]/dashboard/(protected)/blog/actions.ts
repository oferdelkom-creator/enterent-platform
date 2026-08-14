"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function getOwnHostId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data: host } = await supabase
    .from("hosts")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!host) throw new Error("Complete your profile first");

  return host.id as string;
}

export async function createBlogPost(formData: FormData) {
  const supabase = await createClient();
  const hostId = await getOwnHostId(supabase);

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title || !content) throw new Error("Title and content are required");

  await supabase.from("blog_posts").insert({ host_id: hostId, title, content });

  revalidatePath("/blog");
  revalidatePath("/dashboard/blog");
}

export async function deleteBlogPost(postId: string) {
  const supabase = await createClient();
  await getOwnHostId(supabase);

  await supabase.from("blog_posts").delete().eq("id", postId);

  revalidatePath("/blog");
  revalidatePath("/dashboard/blog");
}
