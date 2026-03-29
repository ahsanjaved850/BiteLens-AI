import { ConfigContext, ExpoConfig } from "@expo/config";
import "dotenv/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "NutriTrack",
  slug: "calai_vegan",
  scheme: "NutriTrack",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  
  // Main app icon
  icon: "./assets/images/nutritrack-app-icon-1024.png",

  // Splash screen
  splash: {
    image: "./assets/images/nutritrack-splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },

  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.nutritrackapp",
    buildNumber: "1.0.0",
    icon: "./assets/images/nutritrack-ios-icon.png",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },

  android: {
    package: "com.nutritrackapp",
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "./assets/images/nutritrack-adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },

  web: {
    favicon: "./assets/images/nutritrack-favicon.png",
  },

  plugins: ["expo-router"],

  extra: {
    DATABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    DATABASE_KEY: process.env.EXPO_PUBLIC_SUPABASE_KEY,
    eas: {
      projectId: "8f65f330-0e4f-47de-8c65-2c2f668dda9b",
    },
  },
});