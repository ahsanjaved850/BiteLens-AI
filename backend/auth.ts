import { deleteUserData } from "@/backend/getData";
import { dataAnalysis } from "@/src/utils/dataAnalysis";
import {
  clearOnboardingData,
  getOnboardingData,
} from "@/src/utils/onboarding/onboardingStorage";
import { supabase } from "@/src/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Purchases from "react-native-purchases";

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("onboarding")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError) {
    await supabase.auth.signOut();
    throw profileError;
  }

  if (!profile || profile.onboarding !== true) {
    await supabase.auth.signOut();
    throw new Error("No account found for this email. Please sign up first.");
  }

  await AsyncStorage.setItem("session", JSON.stringify(data.session));

  // Returning user signin — transfer any anonymous RC session to real user ID.
  // This is safe to call even if RC already has the correct user ID.
  try {
    await Purchases.logIn(data.user.id);
  } catch (e) {
    console.warn("RevenueCat logIn failed (sign in):", e);
  }

  return data.user;
};

export const finalizeNewAccount = async (user: {
  id: string;
  email?: string | null;
}) => {
  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData?.session) {
    await AsyncStorage.setItem("session", JSON.stringify(sessionData.session));
  }

  const od = await getOnboardingData();

  const { error: profileError } = await supabase.from("profile").upsert({
    id: user.id,
    full_name: od.full_name ?? null,
    gender: od.gender ?? null,
    goal: od.goal ?? null,
    age: od.age ?? null,
    height: od.height ?? null,
    weight: od.weight ?? null,
    target_weight: od.target_weight ?? null,
    onboarding: false,
  });

  if (profileError) {
    console.error("Profile flush failed:", profileError.message);
    throw profileError;
  }

  if (od.weight) {
    const { error: weightLogError } = await supabase
      .from("weight_logs")
      .insert({ user_id: user.id, weight: od.weight.toString() });

    if (weightLogError) {
      console.warn("Initial weight log failed:", weightLogError.message);
    }
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

  const { error: onboardingError } = await supabase
    .from("profile")
    .update({ onboarding: true })
    .eq("id", user.id);

  if (onboardingError) {
    console.warn("Onboarding flag update failed:", onboardingError.message);
  }

  try {
    await Purchases.logIn(user.id);
    console.log("RevenueCat: purchase transferred to", user.id);
  } catch (e: any) {
    const message: string = e?.message ?? String(e);
    const code: number = e?.code ?? e?.userInfo?.code ?? -1;

    if (message.includes("already another active subscriber") || code === 7) {
      // Sandbox / TestFlight duplicate receipt — safe to ignore.
      // The entitlement is still valid on the original RC identity.
      console.warn(
        "RevenueCat: receipt already linked (error 7) — continuing:",
        message,
      );
    } else {
      // Any other RC error — log it but still do not block the user.
      console.error("RevenueCat logIn failed (finalize):", message);
    }
  }

  await clearOnboardingData();
};

// Sign Up (email + password)
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  const user = data.user;
  if (!user) throw new Error("Sign up succeeded but no user returned.");

  await finalizeNewAccount(user);
  return user;
};

export const deleteAuthUser = async (): Promise<void> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("No active session — cannot delete auth user.");
  }

  const supabaseUrl = "https://zfwtxejwsuqibjjolfmh.supabase.co";

  const response = await fetch(`${supabaseUrl}/functions/v1/delete-user`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      body?.error ??
        `delete-user Edge Function failed with status ${response.status}`,
    );
  }
};

export const deleteAccount = async (): Promise<void> => {
  // 1. Delete all Supabase table rows
  await deleteUserData();

  // 2. Log out of RevenueCat BEFORE deleting the auth user.
  //    Resets RC to an anonymous ID so a future signup can
  //    alias and restore the purchase without error 7.
  try {
    await Purchases.logOut();
  } catch (e) {
    console.warn("RevenueCat logOut failed (delete account):", e);
  }

  // 3. Delete from auth.users via Edge Function
  await deleteAuthUser();

  // 4. Clear local session
  await signOut();
};

// Sign Out
export const signOut = async () => {
  await AsyncStorage.removeItem("session");
  await supabase.auth.signOut();
  try {
    await Purchases.logOut();
  } catch (e) {
    console.warn("RevenueCat logOut failed:", e);
  }
};

// Helpers
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
