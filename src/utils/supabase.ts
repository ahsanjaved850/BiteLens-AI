import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import * as FileSystem from "expo-file-system/legacy";

const supabaseUrl = "https://zfwtxejwsuqibjjolfmh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmd3R4ZWp3c3VxaWJqam9sZm1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NTE0NTcsImV4cCI6MjA2NjQyNzQ1N30.u_gdHQvtEwfYa_xqHqceb51j8qlT78NvA3ZDzYNixWY";

// Create Supabase client with AsyncStorage for session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
  },
});

export interface MealData {
  id: string;
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

    const arrayBuffer = Uint8Array.from(atob(base64), (c) =>
      c.charCodeAt(0)
    );

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
  } catch (error) {
    console.error("Error in saveMealToDatabase:", error);
    throw error;
  }
};

/**
 * Fetch meals for current user only
 */
export const fetchUserMeals = async (): Promise<MealData[]> => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("daily_meals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data ?? []) as MealData[];
  } catch (error) {
    console.error("Error in fetchUserMeals:", error);
    throw error;
  }
};

/**
 * Get today's nutrition totals for current user
 *
 * Based on your daily_intake schema:
 * - primary key is `id`
 * - nutrition fields are `total_*`
 * - protein column is `total_protein` (not total_protien)
 */
export const getTodayNutrition = async (): Promise<TodayNutrition> => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("daily_intake")
      .select(
        "total_calories, total_carbs, total_protein, total_fat, total_sugar, total_sodium, total_fiber"
      )
      .eq("id", user.id)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return EMPTY_NUTRITION;
    }

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