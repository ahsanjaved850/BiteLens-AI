import { getSession } from "@/backend/auth";
import LoginScreen from "@/src/Screens/Login/Login";
import { useOnboardingDone } from "@/src/utils/onboardingDone";
import { useRouter } from "expo-router";
import { JSX, useEffect } from "react";

export default function Login(): JSX.Element {
  const router = useRouter();
  const onboarding = useOnboardingDone();
  const session = getSession();
  console.log(onboarding, "from RootLogin");
  useEffect(() => {
    const restoreSession = async () => {
      const restoredSession = await session;

      if (restoredSession) {
        if (onboarding) {
          router.replace("/tabs/home");
        } else if (!onboarding) {
          router.replace("auth/onboarding");
        }
      }
    };

    restoreSession();
  }, [session, onboarding]);

  const handleLogin = () => {
    router.replace("auth/onboarding");
  };

  return <LoginScreen onLogin={handleLogin} />;
}
