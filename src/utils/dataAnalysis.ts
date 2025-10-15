import { getCurrentUser } from "@/backend/auth";
import Constants from "expo-constants";
import { supabase } from "./supabase";

const openaiKey = Constants.expoConfig?.extra?.OPENAI_API_KEY;

export const dataAnalysis = async (
  weight: number,
  height: number,
  age: number,
  targetWeight: number,
  gender: string,
  goal: string
) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1",
      messages: [
        {
          role: "user",
          content: `Estimate the daily calories and macronutrients (carbs, protein, fats) a person requires based on the following data:
          Weight: ${weight} kg,
          Height: ${height} cm,
          Age: ${age} years,
          TargetWeight: ${targetWeight},
          Goal: ${goal},
          Gender: ${gender}.
          Also, calculate the BMI. Based on BMI, indicate the category (e.g., underweight, normal, overweight, obese).

          Return ONLY a valid JSON object in the following format:
          {
            "BMI": "24",
            "Category": "Normal",
            "calories": "123 kcal",
            "protein": "10 g",
            "carbs": "20 g",
            "fats": "5 g"
          }

          Do not include any explanation, heading, or surrounding text. Only return valid JSON.`,
        },
      ],
      max_tokens: 100,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API Error: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  try {
    const parsed = JSON.parse(content);
    const userId = await getCurrentUser();
    const { data, error } = await supabase
      .from("initial_details")
      .upsert({
        id: userId,
        protein: parsed.protein
          ? Number(parsed.protein.replace(" g", ""))
          : null,
        carbs: parsed.carbs ? Number(parsed.carbs.replace(" g", "")) : null,
        fats: parsed.fats ? Number(parsed.fats.replace(" g", "")) : null,
        calories: parsed.calories
          ? Number(parsed.calories.replace(" kcal", ""))
          : null,
        bmi: parsed.BMI,
        bmi_category: parsed.Category,
      })
      .select()
      .single();
    if (error) {
      console.error("Error saving initial details:", error.message);
      throw error;
    }
    return data;
  } catch (error) {
    console.log(error);
    console.error("Failed to parse JSON:", content);
    throw new Error("Invalid JSON response from AI.");
  }
};
