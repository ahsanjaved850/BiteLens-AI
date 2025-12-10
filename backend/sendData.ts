import { supabase } from "@/src/utils/supabase";
import { getCurrentUser } from "./auth";

export const updateBodyStats = async (age: string, height: string) => {
  const userId = await getCurrentUser();

  const { data, error } = await supabase
    .from("profile")
    .upsert({
      id: userId,
      age: age ? Number(age) : null,
      height: height ? Number(height) : null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving physique:", error.message);
    throw error;
  }

  return data;
};
export const updateWeightStats = async (
  weight: string,
  targetWeight: string
) => {
  const userId = await getCurrentUser();

  const { data, error } = await supabase
    .from("profile")
    .upsert({
      id: userId,
      weight: weight ? Number(weight) : null,
      target_weight: targetWeight ? Number(targetWeight) : null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving physique:", error.message);
    throw error;
  }

  return data;
};
export const sendInitialDetails = async (
  BMI: number,
  Category: string,
  calories: number,
  proteins: number,
  carbs: number,
  fat: number,
  sugar: number,
  sodium: number,
  fiber: number
) => {
  const userId = await getCurrentUser();

  const { data, error } = await supabase
    .from("initial-details")
    .upsert({
      id: userId,
      calories: calories ? Number(calories) : null,
      carbs: carbs ? Number(carbs) : null,
      protein: proteins ? Number(proteins) : null,
      fat: fat ? Number(fat) : null,
      sugar: sugar ? Number(sugar) : null,
      sodium: sodium ? Number(sodium) : null,
      fiber: fiber ? Number(fiber) : null,
      bmi: BMI,
      "bmi-category": Category,
    })
    .select()
    .single();
  if (error) {
    console.error("Error saving initial details:", error.message);
    throw error;
  }
  return data;
};

export const updateGender = async (gender: string) => {
  const userId = await getCurrentUser();

  const { data, error } = await supabase
    .from("profile")
    .update({ gender })
    .eq("id", userId);

  if (error) throw error;
  return data;
};
export const updateName = async (full_name: string) => {
  const userId = await getCurrentUser();

  const { data, error } = await supabase
    .from("profile")
    .update({ full_name })
    .eq("id", userId);

  if (error) throw error;
  return data;
};

export const updateGoal = async (goal: string) => {
  const userId = await getCurrentUser();

  const { data, error } = await supabase
    .from("profile")
    .update({ goal })
    .eq("id", userId);

  if (error) throw error;
  return data;
};
export const updateDailyIntake = async (
  mealCalories: number,
  mealProtein: number,
  mealCarbs: number,
  mealFat: number,
  mealSugar: number,
  mealSodium: number,
  mealFiber: number
) => {
  const userId = await getCurrentUser();
  const today = new Date().toISOString().split("T")[0];

  // First, get today's existing intake
  const { data: existingData, error: fetchError } = await supabase
    .from("daily_intake")
    .select("*")
    .eq("id", userId)
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`)
    .order("created_at", { ascending: false })
    .limit(1);

  if (fetchError) {
    console.error("Error fetching existing intake:", fetchError);
  }

  // Calculate new totals
  const currentIntake =
    existingData && existingData.length > 0 ? existingData[0] : null;

  const newTotals = {
    id: userId,
    total_calories: (currentIntake?.total_calories || 0) + mealCalories,
    total_carbs: (currentIntake?.total_carbs || 0) + mealCarbs,
    total_protien: (currentIntake?.total_protien || 0) + mealProtein,
    total_fat: (currentIntake?.total_fat || 0) + mealFat,
    total_sugar: (currentIntake?.total_sugar || 0) + mealSugar,
    total_sodium: (currentIntake?.total_sodium || 0) + mealSodium,
    total_fiber: (currentIntake?.total_fiber || 0) + mealFiber,
    created_at: new Date().toISOString(),
  };

  // Insert or update today's intake
  const { data, error } = await supabase
    .from("daily_intake")
    .upsert(newTotals, {
      onConflict: "id",
      ignoreDuplicates: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error updating daily intake:", error.message);
    throw error;
  }

  return data;
};
