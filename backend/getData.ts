import { supabase } from "@/src/utils/supabase";

export const getProfile = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const getInitialDetails = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("initial_details")
    .select("*")
    .eq("id", user.id)
    .single();
  if (error) throw error;
  return data;
};

export const deleteUserData = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Not authenticated");
  await supabase.from("profile").delete().eq("id", user.id);
  await supabase.from("initial_details").delete().eq("id", user.id);
  await supabase.from("daily_meals").delete().eq("user_id", user.id);
  await supabase.from("daily_intake").delete().eq("id", user.id);
  return true;
};

const EMPTY_INTAKE = {
  total_calories: 0,
  total_carbs: 0,
  total_protein: 0,
  total_fat: 0,
  total_sugar: 0,
  total_sodium: 0,
  total_fiber: 0,
};

export const getTodayIntake = async (date?: string) => {
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
    .eq("date", targetDate) // ← exact date column match
    .maybeSingle();

  if (error) {
    console.error("Error fetching intake:", error);
    return EMPTY_INTAKE;
  }
  if (!data) return EMPTY_INTAKE;

  return {
    total_calories: Number(data.total_calories || 0),
    total_carbs: Number(data.total_carbs || 0),
    total_protein: Number(data.total_protein || 0),
    total_fat: Number(data.total_fat || 0),
    total_sugar: Number(data.total_sugar || 0),
    total_sodium: Number(data.total_sodium || 0),
    total_fiber: Number(data.total_fiber || 0),
  };
};
