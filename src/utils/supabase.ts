import { createClient } from "@supabase/supabase-js";
import * as FileSystem from "expo-file-system/legacy";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
 * @param imageUri Local file URI
 * @param userId User ID for organizing images
 * @returns Public URL of uploaded image
 */
export const uploadMealImage = async (
  imageUri: string,
  userId: string
): Promise<string> => {
  try {
    // Read image as base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Create unique filename
    const fileExt = imageUri.split(".").pop() || "jpg";
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    // Convert base64 to blob
    const arrayBuffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("meal-images")
      .upload(fileName, arrayBuffer, {
        contentType: `image/${fileExt}`,
        upsert: false,
      });

    if (error) {
      console.error("Error uploading image:", error);
      throw error;
    }

    // Get public URL
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
 * @param mealData Meal information including nutrition and image
 * @returns Saved meal data with ID
 */
export const saveMealToDatabase = async (mealData: MealData): Promise<void> => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase.from("daily_meals").insert({
      user_id: user.id,
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

    if (error) {
      console.error("Database error:", error);
      throw new Error(`Failed to save meal: ${error.message}`);
    }

    console.log("Meal saved successfully");
  } catch (error: any) {
    console.error("Error in saveMealToDatabase:", error);
    throw error;
  }
};

/**
 * Fetch all meals for current user
 * @returns Array of meals ordered by created_at descending
 */
export const fetchUserMeals = async (): Promise<MealData[]> => {
  try {
    const { data, error } = await supabase
      .from("daily_meals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching meals:", error);
      throw error;
    }

    return data as MealData[];
  } catch (error) {
    console.error("Error in fetchUserMeals:", error);
    throw error;
  }
};

/**
 * Delete a meal by ID
 * @param mealId Meal ID to delete
 */
export const deleteMeal = async (mealId: string): Promise<void> => {
  try {
    // First, get the meal to find the image URL
    const { data: meal, error: fetchError } = await supabase
      .from("daily_meals")
      .select("meal_image")
      .eq("id", mealId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Delete the image from storage if it exists
    if (meal?.meal_image) {
      const imageUrl = meal.meal_image;
      const fileName = imageUrl.split("/").slice(-2).join("/"); // Get userId/filename.jpg

      await supabase.storage.from("meal-images").remove([fileName]);
    }

    // Delete the meal record
    const { error: deleteError } = await supabase
      .from("daily_meals")
      .delete()
      .eq("id", mealId);

    if (deleteError) {
      throw deleteError;
    }
  } catch (error) {
    console.error("Error in deleteMeal:", error);
    throw error;
  }
};

/**
 * Get today's total nutrition
 * @returns Aggregated nutrition data for today
 */
export const getTodayNutrition = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("daily_meals")
      .select("calories, protein, carbs, fat, sugar, sodium, fiber")
      .gte("created_at", today.toISOString());

    if (error) {
      throw error;
    }

    // Sum up all nutrition values
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
