import { useOnboardingDone } from "@/src/utils/onboardingDone";
import { configureRevenueCat } from "@/src/utils/revenuecat";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const onboardingDone = useOnboardingDone();

  console.log(onboardingDone, "from main layout");

    useEffect(() => {
    configureRevenueCat();
  }, []);

  // Wait until check is done
  if (onboardingDone === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="tabs" />
    </Stack>
  );
}
