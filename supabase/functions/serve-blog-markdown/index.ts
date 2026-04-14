import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/** Convert HTML blog content to clean Markdown */
function htmlToMarkdown(html: string): string {
  let md = html;

  // Remove hidden meta description tags
  md = md.replace(/<p[^>]*style="display:\s*none[^"]*"[^>]*>.*?<\/p>/gi, '');

  // Headings
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');

  // Bold / italic
  md = md.replace(/<(strong|b)>(.*?)<\/\1>/gi, '**$2**');
  md = md.replace(/<(em|i)>(.*?)<\/\1>/gi, '*$2*');

  // Links
  md = md.replace(/<a[^>]+href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // Images
  md = md.replace(/<img[^>]+src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
  md = md.replace(/<img[^>]+src="([^"]*)"[^>]*\/?>/gi, '![]($1)');

  // Lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) => {
    return inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n') + '\n';
  });
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
    let i = 0;
    return inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, () => {
      i++;
      return `${i}. ${arguments[1] || ''}\n`;
    }) + '\n';
  });
  // Fix ordered list (the above closure doesn't capture properly, redo)
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
    let idx = 0;
    return inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_m: string, text: string) => {
      idx++;
      return `${idx}. ${text.trim()}\n`;
    }) + '\n';
  });

  // Paragraphs & line breaks
  md = md.replace(/<br\s*\/?>/gi, '\n');
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n');

  // Strip remaining HTML tags
  md = md.replace(/<[^>]+>/g, '');

  // Decode common entities
  md = md.replace(/&amp;/g, '&');
  md = md.replace(/&lt;/g, '<');
  md = md.replace(/&gt;/g, '>');
  md = md.replace(/&quot;/g, '"');
  md = md.replace(/&#39;/g, "'");
  md = md.replace(/&nbsp;/g, ' ');

  // Clean up extra whitespace
  md = md.replace(/\n{3,}/g, '\n\n');
  md = md.trim();

  return md;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // If no slug, return an index of all published posts
    if (!slug) {
      const { data: blogs, error } = await supabase
        .from('blogs')
        .select('slug, title, excerpt, published_at, tags')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;

      const baseUrl = url.origin;
      let index = '# Catalyst Mom — Blog Index\n\n';
      index += `_${blogs?.length || 0} published articles_\n\n`;

      blogs?.forEach((b) => {
        index += `## [${b.title}](${baseUrl}/serve-blog-markdown?slug=${b.slug})\n`;
        if (b.excerpt) index += `${b.excerpt}\n`;
        if (b.published_at) index += `Published: ${b.published_at.slice(0, 10)}\n`;
        if (b.tags?.length) index += `Tags: ${b.tags.join(', ')}\n`;
        index += '\n---\n\n';
      });

      return new Response(index, {
        headers: { ...corsHeaders, 'Content-Type': 'text/markdown; charset=utf-8' },
      });
    }

    // Fetch single post
    const { data: blog, error } = await supabase
      .from('blogs')
      .select('title, content, excerpt, author, published_at, tags')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !blog) {
      return new Response('# 404 — Post Not Found\n', {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'text/markdown; charset=utf-8' },
      });
    }

    // Build markdown document
    let md = `# ${blog.title}\n\n`;
    if (blog.author) md += `**Author:** ${blog.author}  \n`;
    if (blog.published_at) md += `**Published:** ${blog.published_at.slice(0, 10)}  \n`;
    if (blog.tags?.length) md += `**Tags:** ${blog.tags.join(', ')}  \n`;
    md += '\n---\n\n';
    if (blog.excerpt) md += `> ${blog.excerpt}\n\n`;
    md += htmlToMarkdown(blog.content);

    return new Response(md, {
      headers: { ...corsHeaders, 'Content-Type': 'text/markdown; charset=utf-8' },
    });

  } catch (error) {
    console.error('[serve-blog-markdown] Error:', error);
    return new Response(`# Error\n\n${error.message}`, {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/markdown; charset=utf-8' },
    });
  }
});
