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
    .single();

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

  await supabase.from("meals").delete().eq("id", user.id);
  await supabase.from("daily details").delete().eq("id", user.id);

  return true;
};

export const getTodayIntake = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Not authenticated");

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("daily_intake")
    .select("*")
    .eq("user_id", user.id)
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error fetching today's intake:", error);
    // Return default values if no data exists
    return {
      total_calories: 0,
      total_carbs: 0,
      total_protien: 0,
      total_fat: 0,
      total_sugar: 0,
      total_sodium: 0,
      total_fiber: 0,
    };
  }

  // If no data for today, return zeros
  if (!data || data.length === 0) {
    return {
      total_calories: 0,
      total_carbs: 0,
      total_protien: 0,
      total_fat: 0,
      total_sugar: 0,
      total_sodium: 0,
      total_fiber: 0,
    };
  }

  return data[0];
};
