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
// export const userDetails = async () => {
//   try {
//     const user = await getProfile();
//     const details = await dataAnalysis(
//       user.weight,
//       user.height,
//       user.age,
//       user.targetWeight,
//       user.gender,
//       user.goal,
//     );
//     console.log(details);
//   } catch (error) {
//     console.error("Error getting the initial details:", error);
//   }
// };

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
    .lte("created_at", `${today}T23:59:59`);

  if (error) {
    console.error("Error fetching today's intake:", error);
    return {
      total_calories: 0,
      total_carbs: 0,
      total_protein: 0,
      total_fat: 0,
      total_sugar: 0,
      total_sodium: 0,
      total_fiber: 0,
    };
  }

  // If no meals for today, return zeros
  if (!data || data.length === 0) {
    return {
      total_calories: 0,
      total_carbs: 0,
      total_protein: 0,
      total_fat: 0,
      total_sugar: 0,
      total_sodium: 0,
      total_fiber: 0,
    };
  }

  // Calculate totals from all meals
  const totals = data.reduce(
    (acc, meal) => ({
      total_calories: acc.total_calories + (meal.calories || 0),
      total_carbs: acc.total_carbs + (meal.carbs || 0),
      total_protein: acc.total_protein + (meal.protein || 0),
      total_fat: acc.total_fat + (meal.fat || 0),
      total_sugar: acc.total_sugar + (meal.sugar || 0),
      total_sodium: acc.total_sodium + (meal.sodium || 0),
      total_fiber: acc.total_fiber + (meal.fiber || 0),
    }),
    {
      total_calories: 0,
      total_carbs: 0,
      total_protein: 0,
      total_fat: 0,
      total_sugar: 0,
      total_sodium: 0,
      total_fiber: 0,
    },
  );

  return totals;
};
