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
  name: "search_blog_posts",
  title: "Search blog posts",
  description:
    "Search Catalyst Mom's published blog posts by keyword and optional tag. Returns slug, title, excerpt, tags, author, and published_at for the top matches.",
  inputSchema: {
    query: z.string().trim().default("").describe("Keyword to match in title, excerpt, or content. Empty returns most recent posts."),
    tag: z
      .enum(["pregnancy", "postpartum", "ttc", "wellness", "nutrition", "fitness"])
      .optional()
      .describe("Optional category tag filter."),
    limit: z.number().int().min(1).max(25).default(10),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, tag, limit }) => {
    const supabase = anonClient();
    let q = supabase
      .from("blogs")
      .select("slug, title, excerpt, tags, author, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit);

    if (query) {
      const pattern = `%${query.replace(/[%_]/g, (m) => `\\${m}`)}%`;
      q = q.or(`title.ilike.${pattern},excerpt.ilike.${pattern},content.ilike.${pattern}`);
    }
    if (tag) q = q.contains("tags", [tag]);

    const { data, error } = await q;
    if (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { results: data ?? [] },
    };
  },
});
