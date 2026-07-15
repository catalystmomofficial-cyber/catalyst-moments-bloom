import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

function anonClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export default defineTool({
  name: "get_blog_post",
  title: "Get blog post",
  description:
    "Fetch a single published Catalyst Mom blog post by slug, including the full HTML content, tags, author, and published date.",
  inputSchema: {
    slug: z.string().trim().min(1).describe("Blog post slug (from search_blog_posts)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }) => {
    const supabase = anonClient();
    const { data, error } = await supabase
      .from("blogs")
      .select("slug, title, excerpt, content, tags, author, featured_image_url, published_at")
      .eq("status", "published")
      .eq("slug", slug)
      .maybeSingle();

    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    if (!data) return { content: [{ type: "text", text: `No published post found for slug "${slug}".` }], isError: true };

    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { post: data },
    };
  },
});
