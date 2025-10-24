import { getSession } from "@/backend/auth";
import { useOnboardingDone } from "@/src/utils/onboardingDone";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const onboardingDone = useOnboardingDone();
  const session = getSession();
  console.log(session);

  console.log(onboardingDone, "from main layout");

  // Wait until AsyncStorage check is done
  if (onboardingDone === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {onboardingDone ? (
        <Stack.Screen name="tabs" />
      ) : (
        <Stack.Screen name="auth" />
      )}
    </Stack>
  );
}
