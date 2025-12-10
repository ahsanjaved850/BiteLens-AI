import { ConfigContext, ExpoConfig } from "@expo/config";
import "dotenv/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "calai_vegan",
  slug: "calai_vegan",
  scheme: "calaivegan",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "light",

  splash: {
    image: "./assets/images/app_icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },

  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.ahsan.calaivegan",
    buildNumber: "1.0.0",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },

  android: {
    package: "com.ahsan.calaivegan",
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "./assets/images/app_logo.png",
      backgroundColor: "#ffffff",
    },
  },

  web: {
    favicon: "./assets/images/app_icon.png",
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
