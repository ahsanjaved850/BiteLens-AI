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
