import { dataAnalysis } from "@/src/utils/dataAnalysis";
import {
  clearOnboardingData,
  getOnboardingData,
} from "@/src/utils/onboardingStorage";
import { supabase } from "@/src/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Purchases from "react-native-purchases";

// Sign In
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  await AsyncStorage.setItem("session", JSON.stringify(data.session));

  try {
    await Purchases.logIn(data.user.id);
  } catch (e) {
    console.warn("RevenueCat logIn failed (sign in):", e);
  }

  return data.user;
};

export const finalizeNewAccount = async (
  user: { id: string; email?: string | null },

  fullNameOverride?: string | null,
) => {
  //  Save session to AsyncStorage

  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData?.session) {
    await AsyncStorage.setItem("session", JSON.stringify(sessionData.session));
  }

  const od = await getOnboardingData();

  const fullName = fullNameOverride ?? od.full_name ?? null;

  const { error: profileError } = await supabase.from("profile").upsert({
    id: user.id,
    full_name: fullName,
    gender: od.gender ?? null,
    goal: od.goal ?? null,
    age: od.age ?? null,
    height: od.height ?? null,
    weight: od.weight ?? null,
    target_weight: od.target_weight ?? null,
    onboarding: false, // flipped to true after dataAnalysis succeeds
  });

  if (profileError) {
    console.error("Profile flush failed:", profileError.message);
    throw profileError;
  }

  if (
    od.weight &&
    od.height &&
    od.age &&
    od.target_weight &&
    od.gender &&
    od.goal
  ) {
    try {
      await dataAnalysis(
        od.weight,
        od.height,
        od.age,
        od.target_weight,
        od.gender,
        od.goal,
      );
    } catch (e) {
      console.warn("dataAnalysis failed during signup:", e);
    }
  }

  //  Mark onboarding complete
  const { error: onboardingError } = await supabase
    .from("profile")
    .update({ onboarding: true })
    .eq("id", user.id);

  if (onboardingError) {
    console.warn("Onboarding flag update failed:", onboardingError.message);
  }

  //  Link RevenueCat purchase to permanent UUID
  try {
    await Purchases.logIn(user.id);
  } catch (e) {
    console.warn("RevenueCat logIn failed (sign up):", e);
  }

  //  Clear AsyncStorage onboarding scratch keys
  await clearOnboardingData();
};

//  Sign Up (email + password)

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  const user = data.user;
  if (!user) throw new Error("Sign up succeeded but no user returned.");

  await finalizeNewAccount(user);

  return user;
};

//  Sign Out
export const signOut = async () => {
  await AsyncStorage.removeItem("session");
  await supabase.auth.signOut();
  try {
    await Purchases.logOut();
  } catch (e) {
    console.warn("RevenueCat logOut failed:", e);
  }
};

//  Helpers
export const getSession = async () => {
  const sessionStr = await AsyncStorage.getItem("session");
  if (sessionStr) {
    const session = JSON.parse(sessionStr);
    supabase.auth.setSession(session);
    return session;
  }
  return null;
};

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user?.id;
};
