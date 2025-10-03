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
