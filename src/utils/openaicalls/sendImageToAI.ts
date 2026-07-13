import { Ingredient, supabase } from "@/src/utils/supabase";

export type NutritionData = {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  sugar: string;
  sodium: string;
  fiber: string;
  ingredients: Ingredient[];
};

export const sendImageToAI = async (
  base64Image: string,
): Promise<NutritionData> => {
  if (!base64Image) {
    throw new Error("Image data is empty");
  }

  try {
    const { data, error } = await supabase.functions.invoke(
      "analyze-food-image",
      {
        body: { base64Image },
      },
    );

    if (error) {
      console.error("Edge Function Error:", error);
      throw new Error(`Edge Function Error: ${error.message}`);
    }

    if (!data) {
      throw new Error("No data received from Edge Function");
    }

    // Edge function returns simplified data, map it to full NutritionData
    const nutritionData: NutritionData = {
      name: String(data.name),
      calories: String(data.calories),
      protein: String(data.protein),
      carbs: String(data.carbs),
      fats: String(data.fats),
      sugar: String(data.sugar),
      sodium: String(data.sodium),
      fiber: String(data.fiber),
      // The edge function returns ingredients as { name, grams } objects.
      // Normalize defensively (tolerate legacy plain strings) instead of
      // dropping them (this was previously hardcoded to []).
      ingredients: Array.isArray(data.ingredients)
        ? data.ingredients
            .map((item: any): Ingredient => {
              if (typeof item === "string") {
                return { name: item.trim(), grams: 0 };
              }
              return {
                name: String(item?.name ?? "").trim(),
                grams: Math.max(0, Math.round(Number(item?.grams) || 0)),
              };
            })
            .filter((item: Ingredient) => item.name.length > 0)
        : [],
    };

    console.log("Nutrition data received:", nutritionData);
    return nutritionData;
  } catch (error: any) {
    console.error("Error in sendImageToAI:", error.message);
    throw error;
  }
};
