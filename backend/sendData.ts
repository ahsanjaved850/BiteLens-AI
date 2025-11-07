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
  fats: null
) => {
  const userId = await getCurrentUser();

  const { data, error } = await supabase
    .from("initial-details")
    .upsert({
      id: userId,
      calories: calories ? Number(calories) : null,
      carbs: carbs ? Number(carbs) : null,
      protein: proteins ? Number(proteins) : null,
      fats: fats ? Number(fats) : null,
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
