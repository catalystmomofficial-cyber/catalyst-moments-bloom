import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VideoScene {
  id: number;
  duration: number;
  imagePrompt: string;
  narration: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { scenes } = await req.json() as { scenes: VideoScene[] };

    if (!scenes || !Array.isArray(scenes)) {
      throw new Error("Scenes array is required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY not configured");
    }

    console.log(`Generating ${scenes.length} scenes...`);

    const generatedScenes = [];

    for (const scene of scenes) {
      console.log(`Generating scene ${scene.id}: Image + Audio`);

      // Generate image using Lovable AI
      const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [
            {
              role: "user",
              content: scene.imagePrompt
            }
          ],
          modalities: ["image", "text"]
        })
      });

      if (!imageResponse.ok) {
        const errorText = await imageResponse.text();
        console.error(`Image generation failed for scene ${scene.id}:`, errorText);
        throw new Error(`Image generation failed: ${errorText}`);
      }

      const imageData = await imageResponse.json();
      const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (!imageUrl) {
        throw new Error(`No image generated for scene ${scene.id}`);
      }

      console.log(`✓ Scene ${scene.id} image generated`);

      // Generate audio using OpenAI TTS
      const audioResponse = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tts-1",
          input: scene.narration,
          voice: "nova",
          response_format: "mp3",
        }),
      });

      if (!audioResponse.ok) {
        const errorText = await audioResponse.text();
        console.error(`Audio generation failed for scene ${scene.id}:`, errorText);
        throw new Error(`Audio generation failed: ${errorText}`);
      }

      const audioBuffer = await audioResponse.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

      console.log(`✓ Scene ${scene.id} audio generated`);

      generatedScenes.push({
        id: scene.id,
        duration: scene.duration,
        imageUrl,
        audioBase64: base64Audio,
        narration: scene.narration
      });
    }

    console.log(`✓ All ${scenes.length} scenes generated successfully`);

    return new Response(
      JSON.stringify({ scenes: generatedScenes }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-welcome-video:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
