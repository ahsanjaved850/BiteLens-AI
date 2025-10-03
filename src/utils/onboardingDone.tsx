import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function useOnboardingDone() {
  const [onboardingSeen, setOnboardingSeen] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem("onboarding_seen");
        setOnboardingSeen(value === "true");
      } catch (e) {
        console.error("Error reading onboarding status", e);
      }
    };

    checkOnboarding();
  }, []);

  return onboardingSeen;
}
