import { ConfigContext, ExpoConfig } from "@expo/config";


export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "BiteLens",
  slug: "calai_vegan",
  scheme: "bitelens",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "light",

  icon: "./assets/images/nutritrack-app-icon-1024.png",

  splash: {
    image: "./assets/images/nutritrack-splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },

  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.nutritrackapp",
    icon: "./assets/images/nutritrack-ios-icon.png",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSCameraUsageDescription:
        "BiteLens uses your camera to capture photos of your meals so our AI can analyze food and estimate calories, macros, and nutritional information. For example, you can take a photo of your meal to track your daily intake.",
      NSPhotoLibraryUsageDescription:
        "BiteLens accesses your photo library so you can select existing meal photos for AI-based nutrition analysis. For example, you can upload a saved food image to calculate calories and monitor your diet.",
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

  plugins: ["expo-router", "expo-camera", "expo-image-picker",],

  extra: {
    supabaseUrl: "https://zfwtxejwsuqibjjolfmh.supabase.co",
    supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmd3R4ZWp3c3VxaWJqam9sZm1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NTE0NTcsImV4cCI6MjA2NjQyNzQ1N30.u_gdHQvtEwfYa_xqHqceb51j8qlT78NvA3ZDzYNixWY",
    eas: {
      projectId: "8f65f330-0e4f-47de-8c65-2c2f668dda9b",
    },
  },
});