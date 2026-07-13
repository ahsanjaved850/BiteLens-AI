import { LoginScreen } from "@/src/Screens/Login";
import { supabase } from "@/src/utils/supabase";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export default function Login() {
  const router = useRouter();

  const handleLogin = () => {
    // Profile exists and onboarding is complete — go straight home
    router.replace("/tabs/home");
  };

  const handleNoAccount = async () => {
    // auth.native.tsx already called signOut() before firing this, but we
    // call it again here as a safety net so no ghost session can linger
    // regardless of call-order changes in the future.
    await supabase.auth.signOut().catch(() => {});

    Alert.alert(
      "No Account Found",
      "We couldn't find an account linked to this Apple ID.\n\nPlease sign up first to create an account.",
      [
        {
          text: "Create an Account",
          onPress: () => router.replace("/auth/welcome"),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
    );
  };

  return (
    <LoginScreen
      mode="signin"
      onLogin={handleLogin}
      onNoAccount={handleNoAccount}
    />
  );
}
