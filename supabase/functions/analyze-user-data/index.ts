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
      }
    );

    const { weight, height, age, targetWeight, gender, goal } =
      await req.json();

    if (!weight || !height || !age || !targetWeight || !gender || !goal) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
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
            content: `Estimate the daily calories and macronutrients (carbs, protein, fats) a person requires based on the following data:
            Weight: ${weight} kg,
            Height: ${height} cm,
            Age: ${age} years,
            TargetWeight: ${targetWeight} kg,
            Goal: ${goal},
            Gender: ${gender}.
            Also, calculate the BMI. Based on BMI, indicate the category (e.g., underweight, normal, overweight, obese).

            Return ONLY a valid JSON object in the following format (NO markdown, NO explanations):
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
            }

            Use only numbers in values, no units.`,
          },
        ],
        max_tokens: 200,
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
      throw new Error("No content received from OpenAI");
    }

    // Clean the response
    let cleanedContent = content.trim();
    cleanedContent = cleanedContent.replace(/```json\n?/g, "");
    cleanedContent = cleanedContent.replace(/```\n?/g, "");
    cleanedContent = cleanedContent.replace(/^```/gm, "");
    cleanedContent = cleanedContent.replace(/`/g, "");
    cleanedContent = cleanedContent.trim();

    console.log("Cleaned content:", cleanedContent);

    const parsed = JSON.parse(cleanedContent);

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error("User error:", userError);
      throw new Error("User not authenticated");
    }

    console.log("User ID:", user.id); // Debug log

    // Save to database
    const { data: savedData, error: dbError } = await supabaseClient
      .from("initial_details")
      .upsert({
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
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log("Data saved successfully:", savedData);

    return new Response(JSON.stringify(savedData), {
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
