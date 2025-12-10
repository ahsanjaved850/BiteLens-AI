import LoginScreen from "@/src/Screens/Login/Login";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  const handleLogin = () => {
    // After successful login, go to onboarding
    router.replace("/auth/onboarding");
  };

  return <LoginScreen onLogin={handleLogin} />;
}
