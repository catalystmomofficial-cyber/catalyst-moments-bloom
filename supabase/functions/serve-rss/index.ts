import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const BASE_URL = "https://catalystmomofficial.com";
const FEED_URL = "https://moxxceccaftkeuaowctw.supabase.co/functions/v1/serve-rss";

function escapeXml(str: string): string {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(dateStr: string): string {
  try {
    return new Date(dateStr).toUTCString();
  } catch {
    return new Date().toUTCString();
  }
}

function stripHtml(html: string): string {
  return (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: blogs, error } = await supabase
      .from("blogs")
      .select("id, title, slug, excerpt, content, author, published_at, tags, featured_image_url")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    const now = new Date().toUTCString();

    const items = (blogs || []).map((blog) => {
      const url = `${BASE_URL}/blog/${blog.slug}`;
      const title = escapeXml(blog.title);
      const description = escapeXml(
        blog.excerpt || stripHtml(blog.content).substring(0, 200)
      );
      const pubDate = toRfc822(blog.published_at);
      const categories = (blog.tags || [])
        .map((tag: string) => `      <category>${escapeXml(tag)}</category>`)
        .join("\n");
      const image = blog.featured_image_url
        ? `      <media:content url="${escapeXml(blog.featured_image_url)}" medium="image"/>\n      <enclosure url="${escapeXml(blog.featured_image_url)}" type="image/jpeg" length="0"/>`
        : "";

      return `    <item>\n      <title>${title}</title>\n      <link>${url}</link>\n      <guid isPermaLink="true">${url}</guid>\n      <description>${description}</description>\n      <pubDate>${pubDate}</pubDate>\n      <dc:creator>${escapeXml(blog.author || "Catalyst Mom Team")}</dc:creator>\n${categories}\n${image}\n    </item>`;
    }).join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"\n  xmlns:atom="http://www.w3.org/2005/Atom"\n  xmlns:media="http://search.yahoo.com/mrss/"\n  xmlns:content="http://purl.org/rss/1.0/modules/content/"\n  xmlns:dc="http://purl.org/dc/elements/1.1/">\n  <channel>\n    <title>Catalyst Mom - Maternal Wellness Blog</title>\n    <link>${BASE_URL}/blog</link>\n    <description>Evidence-based articles on pregnancy, postpartum recovery, breastfeeding, and maternal wellness - written for real moms by Catalyst Mom.</description>\n    <language>en-us</language>\n    <copyright>Copyright 2025 Catalyst Mom. All rights reserved.</copyright>\n    <managingEditor>hello@catalystmomofficial.com (Catalyst Mom Team)</managingEditor>\n    <lastBuildDate>${now}</lastBuildDate>\n    <ttl>1440</ttl>\n    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml"/>\n    <image>\n      <url>${BASE_URL}/catalyst-mom-logo.png</url>\n      <title>Catalyst Mom - Maternal Wellness Blog</title>\n      <link>${BASE_URL}/blog</link>\n      <width>144</width>\n      <height>144</height>\n    </image>\n${items}\n  </channel>\n</rss>`;

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
