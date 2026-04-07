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

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("daily_intake")
    .select(
      "total_calories, total_carbs, total_protein, total_fat, total_sugar, total_sodium, total_fiber"
    )
    .eq("id", user.id)
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`)
    .maybeSingle();

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

  if (!data) {
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
