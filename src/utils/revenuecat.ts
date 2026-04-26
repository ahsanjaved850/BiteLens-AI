import { Platform } from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";

// ⚠️ Replace these with your actual RevenueCat API keys from:
// RevenueCat Dashboard → Project → API Keys
const API_KEYS = {
  apple: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_KEY!,
};

/**
 * Initialize RevenueCat SDK.
 * Call this ONCE in your root _layout.tsx useEffect.
 *
 * Example usage in _layout.tsx:
 * ```
 * import { configureRevenueCat } from "@/src/config/revenueCatConfig";
 *
 * useEffect(() => {
 *   configureRevenueCat();
 * }, []);
 * ```
 */
export const configureRevenueCat = async () => {
  // Enable debug logs in development (remove or set to INFO for production)
  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  // Configure with platform-specific API key
  if (Platform.OS === "ios") {
    Purchases.configure({ apiKey: API_KEYS.apple });
  }
};

// The entitlement identifier you set up in RevenueCat dashboard
// This should match EXACTLY what you configured in RevenueCat → Entitlements
export const ENTITLEMENT_ID = "BiteLens AI Premium";