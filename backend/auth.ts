import { supabase } from "@/src/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  await AsyncStorage.setItem("session", JSON.stringify(data.session));
  return data.user;
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  if (data.session) {
    await AsyncStorage.setItem("session", JSON.stringify(data.session));
  }
  return data.user;
};

export const signOut = async () => {
  await AsyncStorage.removeItem("session");
  await supabase.auth.signOut();
};

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
