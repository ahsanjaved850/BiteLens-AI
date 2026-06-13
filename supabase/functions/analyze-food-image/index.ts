import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: any) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) throw new Error("OpenAI API key not configured");

    const { base64Image } = await req.json();
    if (!base64Image) {
      return new Response(JSON.stringify({ error: "Image data is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
            content: `You are a certified dietitian and food scientist with deep expertise in visual portion estimation and nutritional analysis. You have memorized USDA FoodData Central, FDA nutrition labels, and restaurant nutrition databases.

Your estimates must reflect real-world database values — not guesses. Always return valid JSON only. No markdown, no explanation, no extra text.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this food image with the precision of a registered dietitian.

                PORTION DETECTION RULES:
                1. Use visual reference cues to estimate portion size: plate diameter (~25cm standard dinner plate), hand size, packaging, utensils, or any other visible objects.
                2. Identify the most natural countable unit for this food:
                  - Discrete items → count them (e.g. 3 cookies, 2 slices, 6 nuggets)
                  - Packaged food → use package size (e.g. 1 bag 30g, 1 bottle 500ml)
                  - Plated meals → estimate weight in grams (e.g. 350g pasta)
                  - Beverages → estimate in ml
                3. Be specific: "2 slices toast" not "1 serving"; "340g steak" not "1 plate"

                NUTRITION ACCURACY RULES:
                - Base ALL values on USDA FoodData Central or known restaurant/brand nutrition data
                - Calories: must be mathematically consistent with protein×4 + carbs×4 + fat×9 (±10% for fiber/alcohol)
                - Carbs: total carbohydrates in grams
                - Sugar: must be ≤ carbs (sugar is a subset of total carbs), in grams
                - Fiber: must be ≤ carbs, in grams
                - Sodium: in MILLIGRAMS (mg), not grams — typical range: 100–3000mg per meal
                - Fat: total fat in grams
                - Protein: in grams

                CALCULATION:
                - perUnitNutrition = nutrition for exactly 1 of the detectedUnit
                - Total fields = perUnitNutrition × detectedQuantity
                - All values must be plain numbers — no units inside JSON values

                If image is unclear or not food, return zeros and name "Unidentified".

                Return ONLY this JSON:
                {
                  "name": "Precise dish name (e.g. Grilled Chicken Caesar Salad, not just Salad)",
                  "detectedQuantity": 2,
                  "detectedUnit": "slices",
                  "perUnitNutrition": {
                    "calories": 120,
                    "protein": 4,
                    "carbs": 22,
                    "fat": 2,
                    "sugar": 3,
                    "sodium": 180,
                    "fiber": 1
                  },
                  "calories": 240,
                  "protein": 8,
                  "carbs": 44,
                  "fats": 4,
                  "sugar": 6,
                  "sodium": 360,
                  "fiber": 2,
                  "ingredients": ["ingredient 1", "ingredient 2"]
                }`,
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
        max_tokens: 600,
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
    if (!content) throw new Error("No content received from OpenAI API");

    const cleanedContent = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const parsed = JSON.parse(cleanedContent);

    if (!parsed.calories || !parsed.protein || !parsed.carbs || !parsed.fats) {
      throw new Error("Missing required nutrition fields in response");
    }

    // Build perUnitNutrition — fallback to total/1 if AI didn't return it
    const perUnit = parsed.perUnitNutrition ?? {
      calories: parsed.calories,
      protein: parsed.protein,
      carbs: parsed.carbs,
      fat: parsed.fats,
      sugar: parsed.sugar,
      sodium: parsed.sodium,
      fiber: parsed.fiber,
    };

    const nutritionData = {
      name: String(parsed.name),
      // Flat fields — backward compatible with existing MealData shape
      calories: String(parsed.calories),
      protein: String(parsed.protein),
      carbs: String(parsed.carbs),
      fats: String(parsed.fats),
      sugar: String(parsed.sugar ?? "0"),
      sodium: String(parsed.sodium ?? "0"),
      fiber: String(parsed.fiber ?? "0"),
      ingredients: parsed.ingredients ?? [],
      // New portion fields
      portion_data: {
        detectedQuantity: Number(parsed.detectedQuantity ?? 1),
        detectedUnit: String(parsed.detectedUnit ?? "serving"),
        perUnitNutrition: {
          calories: Number(perUnit.calories),
          protein: Number(perUnit.protein),
          carbs: Number(perUnit.carbs),
          fat: Number(perUnit.fat ?? perUnit.fats ?? 0),
          sugar: Number(perUnit.sugar ?? 0),
          sodium: Number(perUnit.sodium ?? 0),
          fiber: Number(perUnit.fiber ?? 0),
        },
      },
    };

    console.log("analyze-food-image result:", JSON.stringify(nutritionData));

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
