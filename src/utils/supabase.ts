import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import * as FileSystem from "expo-file-system/legacy";

const supabaseUrl = "https://zfwtxejwsuqibjjolfmh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmd3R4ZWp3c3VxaWJqam9sZm1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NTE0NTcsImV4cCI6MjA2NjQyNzQ1N30.u_gdHQvtEwfYa_xqHqceb51j8qlT78NvA3ZDzYNixWY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true },
});

export interface Ingredient {
  name: string;
  grams: number;
}

export interface MealData {
  id: string;
  meal_id?: string;
  created_at?: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  sodium: number;
  fiber: number;
  // Newer meals store { name, grams }; older meals may still hold plain strings.
  ingredients: (Ingredient | string)[];
  meal_image: string;
}

export interface TodayNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  sodium: number;
  fiber: number;
}

const EMPTY_NUTRITION: TodayNutrition = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  sugar: 0,
  sodium: 0,
  fiber: 0,
};

//  Upload meal image
export const uploadMealImage = async (
  imageUri: string,
  userId: string,
): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const fileExt = imageUri.split(".").pop() || "jpg";
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const arrayBuffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    const { error } = await supabase.storage
      .from("meal-images")
      .upload(fileName, arrayBuffer, {
        contentType: `image/${fileExt}`,
        upsert: false,
      });
    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("meal-images")
      .getPublicUrl(fileName);
    return urlData.publicUrl;
  } catch (error) {
    console.error("Error in uploadMealImage:", error);
    throw error;
  }
};

//  Save meal
export const saveMealToDatabase = async (mealData: MealData): Promise<void> => {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError || !session?.user)
      throw new Error("User not authenticated or session missing");

    const { error } = await supabase.from("daily_meals").insert({
      user_id: session.user.id,
      name: mealData.name,
      calories: mealData.calories,
      protein: mealData.protein,
      carbs: mealData.carbs,
      fat: mealData.fat,
      sugar: mealData.sugar,
      sodium: mealData.sodium,
      fiber: mealData.fiber,
      ingredients: mealData.ingredients || [],
      meal_image: mealData.meal_image,
    });
    if (error) throw error;
  } catch (error) {
    console.error("Error in saveMealToDatabase:", error);
    throw error;
  }
};

//  Fetch meals for a date (defaults to today)
// Pass "YYYY-MM-DD" to fetch a historical date's meal list.
export const fetchUserMeals = async (date?: string): Promise<MealData[]> => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error("Not authenticated");

    const targetDate = date ?? new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("daily_meals")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", `${targetDate}T00:00:00`)
      .lte("created_at", `${targetDate}T23:59:59`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map((row: any) => ({
      ...row,
      id: row.meal_id,
    })) as MealData[];
  } catch (error) {
    console.error("Error in fetchUserMeals:", error);
    throw error;
  }
};

//  Get nutrition totals for a date (defaults to today)
export const getTodayNutrition = async (
  date?: string,
): Promise<TodayNutrition> => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error("Not authenticated");

    const targetDate = date ?? new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("daily_intake")
      .select(
        "total_calories, total_carbs, total_protein, total_fat, total_sugar, total_sodium, total_fiber",
      )
      .eq("id", user.id)
      .eq("date", targetDate)
      .maybeSingle();

    if (error) throw error;
    if (!data) return EMPTY_NUTRITION;

    return {
      calories: Number(data.total_calories || 0),
      protein: Number(data.total_protein || 0),
      carbs: Number(data.total_carbs || 0),
      fat: Number(data.total_fat || 0),
      sugar: Number(data.total_sugar || 0),
      sodium: Number(data.total_sodium || 0),
      fiber: Number(data.total_fiber || 0),
    };
  } catch (error) {
    console.error("Error in getTodayNutrition:", error);
    throw error;
  }
};

//  Update a meal's ingredients list along with its recalculated nutrition
export const updateMealNutrition = async (
  mealId: string,
  ingredients: Ingredient[],
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
    sodium: number;
    fiber: number;
  },
): Promise<void> => {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError || !session?.user)
      throw new Error("User not authenticated or session missing");

    const { error } = await supabase
      .from("daily_meals")
      .update({
        ingredients,
        // calories is a bigint column — must be a whole number
        calories: Math.round(nutrition.calories),
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat,
        sugar: nutrition.sugar,
        sodium: nutrition.sodium,
        fiber: nutrition.fiber,
      })
      .eq("meal_id", mealId)
      .eq("user_id", session.user.id);

    if (error) throw error;
  } catch (error) {
    console.error("Error in updateMealNutrition:", error);
    throw error;
  }
};

//  Delete meal
export const deleteMeal = async (mealData: MealData): Promise<void> => {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError || !session?.user)
      throw new Error("User not authenticated or session missing");

    const userId = session.user.id;
    const targetDate = (mealData.created_at ?? new Date().toISOString()).split(
      "T",
    )[0];

    const { error: deleteError } = await supabase
      .from("daily_meals")
      .delete()
      .eq("meal_id", mealData.id)
      .eq("user_id", userId);

    if (deleteError) throw deleteError;

    const { data: intake, error: fetchError } = await supabase
      .from("daily_intake")
      .select(
        "total_calories, total_protein, total_carbs, total_fat, total_sugar, total_sodium, total_fiber",
      )
      .eq("id", userId)
      .eq("date", targetDate)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!intake) return;

    const { error: updateError } = await supabase
      .from("daily_intake")
      .update({
        total_calories: Math.max(
          0,
          (intake.total_calories ?? 0) - mealData.calories,
        ),
        total_protein: Math.max(
          0,
          (intake.total_protein ?? 0) - mealData.protein,
        ),
        total_carbs: Math.max(0, (intake.total_carbs ?? 0) - mealData.carbs),
        total_fat: Math.max(0, (intake.total_fat ?? 0) - mealData.fat),
        total_sugar: Math.max(0, (intake.total_sugar ?? 0) - mealData.sugar),
        total_sodium: Math.max(0, (intake.total_sodium ?? 0) - mealData.sodium),
        total_fiber: Math.max(0, (intake.total_fiber ?? 0) - mealData.fiber),
      })
      .eq("id", userId)
      .eq("date", targetDate);

    if (updateError) throw updateError;
  } catch (error) {
    console.error("Error in deleteMeal:", error);
    throw error;
  }
};
