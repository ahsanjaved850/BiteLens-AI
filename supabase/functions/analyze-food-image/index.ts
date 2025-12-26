import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: any) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the OpenAI API key from environment variables (set in Supabase dashboard)
    const openaiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiKey) {
      throw new Error("OpenAI API key not configured");
    }

    // Parse the request body
    const { base64Image } = await req.json();

    if (!base64Image) {
      return new Response(JSON.stringify({ error: "Image data is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `You are a nutrition expert. Analyze this food image and estimate the calories and macronutrients.
                
                Return ONLY a valid JSON object in this exact format (no markdown, no code blocks):
                {
                  "name": "Name of the dish/meal",
                  "calories": "150",
                  "protein": "8",
                  "carbs": "20",
                  "fats": "5",
                  "sugar": "3",
                  "sodium": "200",
                  "fiber": "4",
                  "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"]
                }

                Important: Use only numbers in the JSON values, no units.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: "low",
                },
              },
            ],
          },
        ],
        max_tokens: 400,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API Error:", error);
      throw new Error(`OpenAI API Error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content received from OpenAI API");
    }

    // Clean the response
    const cleanedContent = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const parsed = JSON.parse(cleanedContent);

    // Validate response
    if (!parsed.calories || !parsed.protein || !parsed.carbs || !parsed.fats) {
      throw new Error("Missing required nutrition fields in response");
    }

    // Ensure values are strings
    const nutritionData = {
      name: String(parsed.name),
      calories: String(parsed.calories),
      protein: String(parsed.protein),
      carbs: String(parsed.carbs),
      fats: String(parsed.fats),
      sugar: String(parsed.sugar),
      sodium: String(parsed.sodium),
      fiber: String(parsed.fiber),
      ingredients: parsed.ingredients,
    };

    return new Response(JSON.stringify(nutritionData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});