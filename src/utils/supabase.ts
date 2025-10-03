import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const dataBaseUrl = Constants.expoConfig?.extra?.DATABASE_URL;
const dataBaseKey = Constants.expoConfig?.extra?.DATABAE_KEY;

export const supabase = createClient(dataBaseUrl, dataBaseKey);
