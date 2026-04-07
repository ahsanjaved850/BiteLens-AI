import { getSession } from "@/backend/auth";
import { useOnboardingDone } from "@/src/utils/onboardingDone";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const onboardingDone = useOnboardingDone();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      setHasSession(!!session);
      setSessionChecked(true);
    };

    checkSession();
  }, []);

  // Wait for both checks to complete
  if (onboardingDone === null || !sessionChecked) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // No session → Login
  if (!hasSession) {
    return <Redirect href="/auth/login" />;
  }

  // Has session but onboarding NOT done → Onboarding
  if (hasSession && !onboardingDone) {
    return <Redirect href="/auth/onboarding" />;
  }

  // Has session AND onboarding done → Home
  return <Redirect href="/tabs/home" />;
}