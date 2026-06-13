import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    if (!openaiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    const { weight, height, age, targetWeight, gender, goal } =
      await req.json();

    // Better validation - check if values exist (allow 0)
    if (
      weight == null ||
      height == null ||
      age == null ||
      targetWeight == null ||
      !gender ||
      !goal
    ) {
      console.error("Missing fields:", {
        weight,
        height,
        age,
        targetWeight,
        gender,
        goal,
      });
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log("Received data:", {
      weight,
      height,
      age,
      targetWeight,
      gender,
      goal,
    });

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
            content: `You are a certified sports nutritionist and dietitian. 
            Calculate precise nutritional requirements using the Mifflin-St Jeor equation for BMR and goal-based macro splitting.
            Always return valid JSON only. No markdown, no explanation, no extra text.`,
          },
          {
            role: "user",
            content: `Calculate personalized daily nutritional requirements for:

            PERSONAL DATA:
            - Gender: ${gender}
            - Age: ${age} years
            - Current Weight: ${weight} kg
            - Height: ${height} cm
            - Target Weight: ${targetWeight} kg
            - Goal: ${goal}

            INSTRUCTIONS:
            1. BMI = weight(kg) / height(m)²
              - Categories: Underweight <18.5 | Normal 18.5–24.9 | Overweight 25–29.9 | Obese ≥30
            2. BMR via Mifflin-St Jeor:
              - Male: (10 × weight) + (6.25 × height) - (5 × age) + 5
              - Female: (10 × weight) + (6.25 × height) - (5 × age) - 161
            3. TDEE = BMR × 1.55 (moderately active baseline)
            4. Adjust calories by goal:
              - Weight loss: TDEE - 400 to 500 (min 1200 female / 1500 male)
              - Muscle gain: TDEE + 200 to 300
              - Maintenance: TDEE
            5. Macros:
              - Protein (g): 1.8–2.2g per kg body weight
              - Fat (g): 25–30% of calories ÷ 9
              - Carbs (g): remaining calories ÷ 4
              - Sugar (g): ≤10% of total calories ÷ 4
              - Sodium (mg): 1500–2300 based on goal
              - Fiber (g): 25–38 based on gender and calorie intake

            Return ONLY this JSON:
            {
              "BMI": "24.5",
              "Category": "Normal",
              "calories": "2000",
              "protein": "150",
              "carbs": "250",
              "fat": "67",
              "sugar": "50",
              "sodium": "2300",
              "fiber": "30"
            }`,
          },
        ],
        max_tokens: 200,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API Error:", error);
      return new Response(
        JSON.stringify({ error: `OpenAI API failed: ${response.status}` }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content from OpenAI");
    }

    // Clean response
    let cleanedContent = content
      .trim()
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .replace(/^```/gm, "")
      .replace(/`/g, "")
      .trim();

    console.log("Cleaned content:", cleanedContent);

    let parsed;
    try {
      parsed = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Content was:", cleanedContent);
      return new Response(
        JSON.stringify({ error: "Failed to parse AI response" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Get user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error("User error:", userError);
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Saving for user:", user.id);

    // Save to database
    const { data: savedData, error: dbError } = await supabaseClient
      .from("initial_details")
      .upsert(
        {
          id: user.id,
          protein: parsed.protein ? Number(parsed.protein) : null,
          carbs: parsed.carbs ? Number(parsed.carbs) : null,
          fat: parsed.fat ? Number(parsed.fat) : null,
          sodium: parsed.sodium ? Number(parsed.sodium) : null,
          sugar: parsed.sugar ? Number(parsed.sugar) : null,
          fiber: parsed.fiber ? Number(parsed.fiber) : null,
          calories: parsed.calories ? Number(parsed.calories) : null,
          bmi: parsed.BMI ? String(parsed.BMI) : null,
          bmi_category: parsed.Category ? String(parsed.Category) : null,
        },
        { onConflict: "id" },
      )
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: `Database error: ${dbError.message}` }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log("Success! Saved data");

    return new Response(JSON.stringify(savedData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Unhandled error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
