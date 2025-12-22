import { getSession } from "@/backend/auth";
import { useOnboardingDone } from "@/src/utils/onboardingDone";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const onboardingDone = useOnboardingDone();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  console.log(onboardingDone);
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

  // Has session AND onboarding done → Go to home
  if (hasSession && onboardingDone) {
    return <Redirect href="/tabs/home" />;
  }

  // Has session but NO onboarding → Go to onboarding
  if (hasSession && !onboardingDone) {
    return <Redirect href="/auth/onboarding" />;
  }

  // No session → Go to login
  return <Redirect href="/auth/login" />;
}
