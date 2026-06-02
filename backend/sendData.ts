import { supabase } from "@/src/utils/supabase";
import { getCurrentUser } from "./auth";

export const updateBodyStats = async (age: string, height: string) => {
  const userId = await getCurrentUser();
  const { data, error } = await supabase
    .from("profile")
    .upsert(
      {
        id: userId,
        age: age ? Number(age) : null,
        height: height ? Number(height) : null,
      },
      { onConflict: "id" },
    )
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
  targetWeight: string,
) => {
  const userId = await getCurrentUser();
  const { data, error } = await supabase
    .from("profile")
    .upsert(
      {
        id: userId,
        weight: weight ? Number(weight) : null,
        target_weight: targetWeight ? Number(targetWeight) : null,
      },
      { onConflict: "id" },
    )
    .select()
    .single();
  if (error) {
    console.error("Error saving weight stats:", error.message);
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
  fiber: number,
) => {
  const userId = await getCurrentUser();
  const { data, error } = await supabase
    .from("initial-details")
    .upsert(
      {
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
      },
      { onConflict: "id" },
    )
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
    .upsert({ id: userId, gender }, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateName = async (full_name: string) => {
  const userId = await getCurrentUser();
  const { data, error } = await supabase
    .from("profile")
    .upsert({ id: userId, full_name }, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateGoal = async (goal: string) => {
  const userId = await getCurrentUser();
  const { data, error } = await supabase
    .from("profile")
    .upsert({ id: userId, goal }, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ─── updateDailyIntake ────────────────────────────────────────────────────
// Uses composite PK (id, date).
// Each calendar day gets its own row — totals accumulate within a day.
// On a new day the existing row for that date doesn't exist → starts at 0.
export const updateDailyIntake = async (
  mealCalories: number,
  mealProtein: number,
  mealCarbs: number,
  mealFat: number,
  mealSugar: number,
  mealSodium: number,
  mealFiber: number,
) => {
  const userId = await getCurrentUser();
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  // Step 1: Read today's existing row by (id, date)
  const { data: existing, error: fetchError } = await supabase
    .from("daily_intake")
    .select("*")
    .eq("id", userId)
    .eq("date", today)
    .maybeSingle();

  if (fetchError) {
    console.error("Error fetching existing intake:", fetchError.message);
    throw fetchError;
  }

  // Step 2: Accumulate on top of what already exists today
  const row = {
    id: userId,
    date: today,
    total_calories: Number(existing?.total_calories || 0) + mealCalories,
    total_carbs: Number(existing?.total_carbs || 0) + mealCarbs,
    total_protein: Number(existing?.total_protein || 0) + mealProtein,
    total_fat: Number(existing?.total_fat || 0) + mealFat,
    total_sugar: Number(existing?.total_sugar || 0) + mealSugar,
    total_sodium: Number(existing?.total_sodium || 0) + mealSodium,
    total_fiber: Number(existing?.total_fiber || 0) + mealFiber,
    created_at: new Date().toISOString(),
  };

  // Step 3: Upsert on composite PK (id, date)
  // First meal today → INSERT. Subsequent meals → UPDATE.
  const { data, error } = await supabase
    .from("daily_intake")
    .upsert(row, { onConflict: "id,date", ignoreDuplicates: false })
    .select()
    .single();

  if (error) {
    console.error("Error updating daily intake:", error.message);
    throw error;
  }

  return data;
};

export const updateOnboading = async (onboarding: boolean) => {
  const userId = await getCurrentUser();
  const { data, error } = await supabase
    .from("profile")
    .upsert({ id: userId, onboarding }, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  return data;
};
