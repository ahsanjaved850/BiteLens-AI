import { Ingredient, supabase } from "@/src/utils/supabase";

export type NutritionTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  sodium: number;
  fiber: number;
};

export const ZERO_NUTRITION: NutritionTotals = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  sugar: 0,
  sodium: 0,
  fiber: 0,
};

// Recomputes a dish's total nutrition from its ingredient list — used
// whenever the user adds, edits, or deletes an ingredient on a saved meal.
export const recalculateNutritionFromIngredients = async (
  mealName: string,
  ingredients: Ingredient[],
): Promise<NutritionTotals> => {
  if (ingredients.length === 0) return { ...ZERO_NUTRITION };

  try {
    const { data, error } = await supabase.functions.invoke(
      "recalculate-meal-nutrition",
      { body: { mealName, ingredients } },
    );

    if (error) {
      console.error("Edge Function Error:", error);
      throw new Error(`Edge Function Error: ${error.message}`);
    }

    if (!data) {
      throw new Error("No data received from Edge Function");
    }

    return {
      calories: Number(data.calories) || 0,
      protein: Number(data.protein) || 0,
      carbs: Number(data.carbs) || 0,
      fat: Number(data.fat) || 0,
      sugar: Number(data.sugar) || 0,
      sodium: Number(data.sodium) || 0,
      fiber: Number(data.fiber) || 0,
    };
  } catch (error: any) {
    console.error("Error in recalculateNutritionFromIngredients:", error.message);
    throw error;
  }
};
