import { supabase } from "@/src/utils/supabase";
import { getCurrentUser } from "./auth";

export const updatePhysique = async (
  age: string,
  height: string,
  weight: string,
  targetWeight: string
) => {
  const userId = await getCurrentUser();

  const { data, error } = await supabase
    .from("profile")
    .upsert(
      {
        id: userId,
        age: age ? Number(age) : null,
        height: height ? Number(height) : null,
        weight: weight ? Number(weight) : null,
        target_weight: targetWeight ? Number(targetWeight) : null,
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (error) {
    console.error("Error saving physique:", error.message);
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

export const updateGoal = async (goal: string) => {
  const userId = await getCurrentUser();

  const { data, error } = await supabase
    .from("profile")
    .update({ goal })
    .eq("id", userId);

  if (error) throw error;
  return data;
};
