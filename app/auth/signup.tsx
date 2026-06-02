import { LoginScreen } from "@/src/Screens/Login";
import { useRouter } from "expo-router";

export default function Signup() {
  const router = useRouter();

  const handleSignedUp = () => {
    // Everything is in Supabase — safe to go to Home
    router.replace("/tabs/home");
  };

  return <LoginScreen mode="signup" onLogin={handleSignedUp} />;
}
