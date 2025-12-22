import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import * as FileSystem from "expo-file-system/legacy";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create Supabase client with AsyncStorage for session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Only needed for web
  },
});

export interface MealData {
  id?: string;
  created_at?: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  sodium: number;
  fiber: number;
  ingredients: string[];
  meal_image: string;
}

/**
 * Upload image to Supabase Storage
 */
export const uploadMealImage = async (
  imageUri: string,
  userId: string
): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileExt = imageUri.split(".").pop() || "jpg";
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const arrayBuffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    const { data, error } = await supabase.storage
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

/**
 * Save meal data to Supabase database
 */
export const saveMealToDatabase = async (mealData: MealData): Promise<void> => {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      throw new Error("User not authenticated or session missing");
    }

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

    console.log("Meal saved successfully");
  } catch (error: any) {
    console.error("Error in saveMealToDatabase:", error);
    throw error;
  }
};

/**
 * Fetch meals for current user
 */
export const fetchUserMeals = async (): Promise<MealData[]> => {
  try {
    const { data, error } = await supabase
      .from("daily_meals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data as MealData[];
  } catch (error) {
    console.error("Error in fetchUserMeals:", error);
    throw error;
  }
};

/**
 * Delete a meal by ID
 */
export const deleteMeal = async (mealId: string): Promise<void> => {
  try {
    const { data: meal, error: fetchError } = await supabase
      .from("daily_meals")
      .select("meal_image")
      .eq("id", mealId)
      .single();

    if (fetchError) throw fetchError;

    if (meal?.meal_image) {
      const imageUrl = meal.meal_image;
      const fileName = imageUrl.split("/").slice(-2).join("/");
      await supabase.storage.from("meal-images").remove([fileName]);
    }

    const { error: deleteError } = await supabase
      .from("daily_meals")
      .delete()
      .eq("id", mealId);

    if (deleteError) throw deleteError;
  } catch (error) {
    console.error("Error in deleteMeal:", error);
    throw error;
  }
};

/**
 * Get today's total nutrition
 */
export const getTodayNutrition = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("daily_meals")
      .select("calories, protein, carbs, fat, sugar, sodium, fiber")
      .gte("created_at", today.toISOString());

    if (error) throw error;

    const totals = data.reduce(
      (acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fat: acc.fat + (meal.fat || 0),
        sugar: acc.sugar + (meal.sugar || 0),
        sodium: acc.sodium + (meal.sodium || 0),
        fiber: acc.fiber + (meal.fiber || 0),
      }),
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sugar: 0,
        sodium: 0,
        fiber: 0,
      }
    );

    return totals;
  } catch (error) {
    console.error("Error in getTodayNutrition:", error);
    throw error;
  }
};
