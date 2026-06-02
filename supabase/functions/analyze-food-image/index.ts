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
            role: "system",
            content: `You are a certified nutrition expert and food scientist specializing in visual food analysis.
            Your job is to accurately identify dishes from images and estimate their nutritional content based on:
            - Visible portion size and plate/bowl dimensions as reference
            - Cooking method (fried, steamed, grilled, baked, raw)
            - Ingredient density and visible quantities
            - Standard serving sizes from nutrition databases (USDA, FDA)
            Always return valid JSON only. No markdown, no explanation, no extra text.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this food image and return accurate nutritional estimates.

                ANALYSIS STEPS:
                1. Identify the dish/meal name precisely (e.g. "Grilled Chicken Caesar Salad" not just "Salad")
                2. Estimate portion size using visual cues (plate size, utensils, packaging)
                3. Identify all visible ingredients and estimate their quantities
                4. Calculate total nutrition based on ingredients + cooking method:
                  - Calories: account for oils/butter if fried or sautéed
                  - Protein (g): sum from all protein sources
                  - Carbs (g): include starches, bread, rice, sauces
                  - Fats (g): include cooking oil, dressings, fatty meats
                  - Sugar (g): natural + added sugars
                  - Sodium (mg): account for sauces, seasoning, processed items
                  - Fiber (g): from vegetables, legumes, whole grains
                5. List all identifiable ingredients

                If the image is unclear or not food, return:
                {
                  "name": "Unidentified",
                  "calories": "0",
                  "protein": "0",
                  "carbs": "0",
                  "fats": "0",
                  "sugar": "0",
                  "sodium": "0",
                  "fiber": "0",
                  "ingredients": []
                }

                Return ONLY this JSON:
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
                  detail: "high",
                },
              },
            ],
          },
        ],
        max_tokens: 400,
        temperature: 0.1,
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
    console.log(cleanedContent);
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
