import { Platform } from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";

const API_KEYS = {
  apple: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_KEY!,
};

export const configureRevenueCat = async () => {
  const apiKey = API_KEYS.apple;

  if (!apiKey) {
    console.warn("RevenueCat API key not found in environment");
    return;
  }

  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  if (Platform.OS === "ios") {
    Purchases.configure({ apiKey });
  }
};

export const ENTITLEMENT_ID = "BiteLens AI Premium";