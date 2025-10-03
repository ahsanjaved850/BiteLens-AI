import { useOnboardingDone } from "@/src/utils/onboardingDone";
import { Stack } from "expo-router";

export default function RootLayout() {
  const onboardingDone = useOnboardingDone();
  console.log(onboardingDone, "from main layout");
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
