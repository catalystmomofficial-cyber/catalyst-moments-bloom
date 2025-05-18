
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    
    if (!image) {
      return new Response(
        JSON.stringify({ error: "Missing image data" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Extract the base64 part
    const base64Data = image.split(',')[1];
    
    // Convert base64 to blob for the API request
    const binaryData = atob(base64Data);
    const bytes = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'image/jpeg' });
    
    // Create FormData to send to the Hugging Face API
    const formData = new FormData();
    formData.append('file', blob, 'food.jpg');

    // Call Hugging Face API for food detection
    const response = await fetch(
      "https://api-inference.huggingface.co/models/Salesforce/blip-food",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("HUGGING_FACE_ACCESS_TOKEN")}`,
        },
        body: formData,
      }
    );

    // Process the response from the Hugging Face API
    if (!response.ok) {
      const error = await response.text();
      console.error("Hugging Face API error:", error);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    console.log("Food detection result:", result);

    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Query our food database to find nutritional information
    let detectedFood = result?.generated_text;
    if (!detectedFood) {
      detectedFood = "Unknown food";
    }

    // Simplify the food name for better matching
    const simplifiedFoodName = detectedFood.toLowerCase().split(' ')[0];
    
    // Query the food_items table for the match
    const { data: foodData, error: foodError } = await supabase
      .from('food_items')
      .select('*')
      .ilike('name', `%${simplifiedFoodName}%`)
      .limit(1)
      .single();

    if (foodError && foodError.code !== 'PGRST116') {
      console.error("Database query error:", foodError);
    }

    // Prepare response with food detection and nutritional info
    const responseData = {
      detectedFood,
      nutritionalInfo: foodData || null,
      message: foodData ? 
        `Detected: ${detectedFood}. Found nutritional information.` : 
        `Detected: ${detectedFood}. No precise nutritional information available.`
    };

    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in detect-food function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
