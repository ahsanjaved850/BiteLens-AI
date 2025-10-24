import { getSession } from "@/backend/auth";
import LoginScreen from "@/src/Screens/Login/Login";
import { useOnboardingDone } from "@/src/utils/onboardingDone";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Login() {
  const router = useRouter();
  const onboarding = useOnboardingDone();
  const session = getSession();
  console.log(session);

  console.log(onboarding, "from RootLogin");

  useEffect(() => {
    const restoreSession = async () => {
      const restoredSession = await session;

      if (restoredSession) {
        if (onboarding) {
          router.replace("/tabs/home");
        } else {
          router.replace("/auth/onboarding");
        }
      }
    };

    restoreSession();
  }, [session, onboarding, router]);

  const handleLogin = () => {
    router.replace("/auth/onboarding");
  };

  return <LoginScreen onLogin={handleLogin} />;
}
