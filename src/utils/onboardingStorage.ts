import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "orca_onboarding_data";

export interface OnboardingData {
  full_name?: string;
  gender?: string;
  goal?: string;
  age?: number;
  height?: number;
  weight?: number;
  target_weight?: number;
}

export const saveOnboardingData = async (
  data: Partial<OnboardingData>,
): Promise<void> => {
  try {
    const existing = await getOnboardingData();
    await AsyncStorage.setItem(KEY, JSON.stringify({ ...existing, ...data }));
  } catch (e) {
    console.error("onboardingStorage.save error:", e);
  }
};

export const getOnboardingData = async (): Promise<OnboardingData> => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("onboardingStorage.get error:", e);
    return {};
  }
};

export const clearOnboardingData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (e) {
    console.error("onboardingStorage.clear error:", e);
  }
};
