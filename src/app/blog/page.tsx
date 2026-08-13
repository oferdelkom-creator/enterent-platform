import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, content, created_at, hosts(full_name, city, country)")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-brand-teal-dark">
            EnterRent Blog
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Hosting stories</h1>
          <p className="mt-1 text-sm text-slate-500">
            Swap experiences, backup-hosting stories, and tips shared by the community.
          </p>
        </div>
        <Link
          href="/dashboard/blog"
          className="rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy-light"
        >
          Write a post
        </Link>
      </div>

      <div className="mt-10 space-y-6">
        {posts?.length ? (
          posts.map((post) => {
            const host = post.hosts as unknown as {
              full_name: string;
              city: string | null;
              country: string | null;
            } | null;

            return (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-teal"
              >
                <h2 className="text-lg font-semibold text-slate-900">{post.title}</h2>
                <p className="mt-1 text-xs text-slate-400">
                  {host?.full_name ?? "A host"}
                  {host?.city ? ` · ${[host.city, host.country].filter(Boolean).join(", ")}` : ""}
                  {" · "}
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
                <p className="mt-3 line-clamp-3 text-sm text-slate-600">{post.content}</p>
              </Link>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400">
            No posts yet — be the first to share a hosting story.
          </div>
        )}
      </div>
    </main>
  );
}
