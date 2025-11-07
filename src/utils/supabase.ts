import { createClient } from "@supabase/supabase-js";

const dataBaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const dataBaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

export const supabase = createClient(dataBaseUrl, dataBaseKey);
