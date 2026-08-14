import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import PostForm from "./post-form";
import DeletePostButton from "./delete-post-button";

export default async function DashboardBlogPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: host } = await supabase
    .from("hosts")
    .select("id")
    .eq("user_id", user!.id)
    .maybeSingle();

  const { data: posts } = host
    ? await supabase
        .from("blog_posts")
        .select("id, title, created_at")
        .eq("host_id", host.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  const t = await getTranslations("DashboardBlog");
  const locale = await getLocale();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">{t("title")}</h1>
      <p className="mt-1 text-sm text-slate-500">
        {t("subtitle")}{" "}
        <Link href="/blog" className="text-brand-teal-dark hover:underline">
          {t("viewPublicBlog")}
        </Link>
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="space-y-3 md:col-span-2">
          {posts?.length ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div>
                  <Link href={`/blog/${post.id}`} className="font-medium text-slate-900 hover:underline">
                    {post.title}
                  </Link>
                  <p className="text-xs text-slate-400">
                    {new Date(post.created_at).toLocaleDateString(locale)}
                  </p>
                </div>
                <DeletePostButton postId={post.id} />
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
              {t("noPostsYet")}
            </div>
          )}
        </div>

        <PostForm />
      </div>
    </div>
  );
}
