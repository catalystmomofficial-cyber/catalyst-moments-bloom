import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, instruction } = await req.json();
    
    if (!content || !instruction) {
      return new Response(
        JSON.stringify({ error: 'Content and instruction are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Processing AI edit request with instruction:', instruction);

    const systemPrompt = `You are an expert blog content editor for Catalyst Mom, a maternal wellness brand. Your job is to edit blog post content based on user instructions.

CRITICAL RULES:
1. ONLY return the edited content - no explanations, no commentary
2. Preserve ALL HTML formatting and structure
3. Make ONLY the changes requested - don't add or remove content unless asked
4. Maintain the same writing style and tone
5. Keep all existing links, images, and formatting intact
6. If asked to remove something, remove it cleanly without leaving artifacts
7. If asked to rewrite something, maintain the same general meaning unless told otherwise

COMMON EDITING TASKS:
- "Remove the first paragraph" → Delete the first <p> tag and its content
- "Make it shorter" → Condense while keeping key points
- "Fix grammar" → Correct grammar/spelling without changing meaning
- "Make it more engaging" → Add power words and better hooks
- "Remove mentions of X" → Find and remove all references to X
- "Add a CTA" → Insert a compelling call-to-action

Return ONLY the edited HTML content, nothing else.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Here is the blog content to edit:

---CONTENT START---
${content}
---CONTENT END---

EDITING INSTRUCTION: ${instruction}

Return ONLY the edited content with no explanation.`
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const editedContent = data.choices?.[0]?.message?.content;

    if (!editedContent) {
      throw new Error('No edited content returned from AI');
    }

    // Clean up the response - remove any markdown code blocks if present
    let cleanContent = editedContent
      .replace(/^```html\n?/i, '')
      .replace(/^```\n?/, '')
      .replace(/\n?```$/g, '')
      .trim();

    console.log('AI edit completed successfully');

    return new Response(
      JSON.stringify({ editedContent: cleanContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-edit-blog:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process edit request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
