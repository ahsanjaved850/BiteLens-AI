import { supabase } from "./supabase";

export type NutritionData = {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  sugar: string;
  sodium: string;
  fiber: string;
  ingredients: string[];
};

export const sendImageToAI = async (
  base64Image: string
): Promise<NutritionData> => {
  if (!base64Image) {
    throw new Error("Image data is empty");
  }

  try {
    const { data, error } = await supabase.functions.invoke(
      "analyze-food-image",
      {
        body: { base64Image },
      }
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
      ingredients: [],
    };

    console.log("Nutrition data received:", nutritionData);
    return nutritionData;
  } catch (error: any) {
    console.error("Error in sendImageToAI:", error.message);
    throw error;
  }
};
