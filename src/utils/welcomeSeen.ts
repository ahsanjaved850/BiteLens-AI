import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const WELCOME_SEEN_KEY = "welcome_seen_v1";

export const useWelcomeSeen = (): boolean | null => {
  const [seen, setSeen] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem(WELCOME_SEEN_KEY);
        setSeen(value === "true");
      } catch (err) {
        console.warn("welcomeSeen: read failed", err);
        // Fail-safe: treat as seen so we never trap a returning user in marketing
        setSeen(true);
      }
    })();
  }, []);

  return seen;
};

export const setWelcomeSeen = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(WELCOME_SEEN_KEY, "true");
  } catch (err) {
    console.warn("welcomeSeen: write failed", err);
  }
};
