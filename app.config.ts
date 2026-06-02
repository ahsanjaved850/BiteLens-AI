import { ConfigContext, ExpoConfig } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Orca AI",
  slug: "calai_vegan",
  scheme: "orca",
  version: "1.1.2",
  orientation: "portrait",
  userInterfaceStyle: "light",

  icon: "@/assets/images/icons/app-logo.png",

  splash: {
    image: "@/assets/images/icons/splashscreen.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },

  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.nutritrackapp",
    usesAppleSignIn: true,
    icon: "@/assets/images/icons/app-logo.png",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSCameraUsageDescription:
        "Orca uses your camera to capture photos of your meals so our AI can analyze food and estimate calories, macros, and nutritional information. For example, you can take a photo of your meal to track your daily intake.",
      NSPhotoLibraryUsageDescription:
        "Orca accesses your photo library so you can select existing meal photos for AI-based nutrition analysis. For example, you can upload a saved food image to calculate calories and monitor your diet.",
    },
  },

  android: {
    package: "com.nutritrackapp",
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "@/assets/images/icons/app-logo.png",
      backgroundColor: "#ffffff",
    },
  },

  web: {
    favicon: "@/assets/images/icons/app-logo.png",
  },

  plugins: [
    "expo-router",
    "expo-camera",
    "expo-image-picker",
    "expo-apple-authentication",
  ],

  extra: {
    supabaseUrl: "https://zfwtxejwsuqibjjolfmh.supabase.co",
    supabaseAnonKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmd3R4ZWp3c3VxaWJqam9sZm1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NTE0NTcsImV4cCI6MjA2NjQyNzQ1N30.u_gdHQvtEwfYa_xqHqceb51j8qlT78NvA3ZDzYNixWY",
    eas: {
      projectId: "8f65f330-0e4f-47de-8c65-2c2f668dda9b",
    },
  },
});
