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

    const { mealName, ingredients } = await req.json();

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return new Response(
        JSON.stringify({ error: "ingredients array is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const ingredientsList = ingredients
      .map(
        (item: any, i: number) =>
          `${i + 1}. ${item.name} — ${item.grams}g`,
      )
      .join("\n");

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
            content: `You are a certified dietitian and food scientist with deep expertise in ingredient-based nutritional analysis. You have memorized USDA FoodData Central, FDA nutrition labels, and restaurant nutrition databases.

Your estimates must reflect real-world database values — not guesses. Always return valid JSON only. No markdown, no explanation, no extra text.`,
          },
          {
            role: "user",
            content: `Calculate the total nutrition for this dish with the precision of a registered dietitian, based on its exact ingredient list and gram amounts.

This is a recalculation after the user edited the ingredient list, so treat the list below as complete and authoritative for the whole dish — do not add, remove, assume, or substitute any ingredient, and do not fall back on a "typical" version of the dish.

Dish: ${mealName || "Meal"}

Ingredients:
${ingredientsList}

PER-INGREDIENT METHOD (do this for every single ingredient above, in order):
1. Identify the specific food this ingredient refers to, accounting for how it's likely prepared (e.g. "grilled chicken" is cooked/lean, "olive oil" is pure fat, "white rice" is cooked unless stated raw).
2. Recall its per-100g nutrition from USDA FoodData Central or known restaurant/brand nutrition data.
3. Scale that per-100g value to the ingredient's actual gram weight: value × (grams / 100). An ingredient at 0g contributes 0 to every field.
4. Keep every ingredient's scaled values in mind — the dish total is the sum across ALL ingredients listed, none skipped, none merged together.

NUTRITION ACCURACY RULES:
- Base ALL values on USDA FoodData Central or known restaurant/brand nutrition data
- Calories: must be mathematically consistent with protein×4 + carbs×4 + fat×9 (±10% for fiber/alcohol)
- Carbs: total carbohydrates in grams
- Sugar: must be ≤ carbs (sugar is a subset of total carbs), in grams
- Fiber: must be ≤ carbs, in grams
- Sodium: in MILLIGRAMS (mg), not grams — typical range: 100–3000mg per meal
- Fat: total fat in grams
- Protein: in grams
- All values must be plain numbers — no units inside JSON values

Return ONLY this JSON — the SUM across all ingredients above:
{
  "calories": 240,
  "protein": 8,
  "carbs": 44,
  "fat": 4,
  "sugar": 6,
  "sodium": 360,
  "fiber": 2
}`,
          },
        ],
        max_tokens: 300,
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

    const nutritionData = {
      calories: Math.max(0, Number(parsed.calories) || 0),
      protein: Math.max(0, Number(parsed.protein) || 0),
      carbs: Math.max(0, Number(parsed.carbs) || 0),
      fat: Math.max(0, Number(parsed.fat) || 0),
      sugar: Math.max(0, Number(parsed.sugar) || 0),
      sodium: Math.max(0, Number(parsed.sodium) || 0),
      fiber: Math.max(0, Number(parsed.fiber) || 0),
    };

    console.log("recalculate-meal-nutrition result:", JSON.stringify(nutritionData));

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
