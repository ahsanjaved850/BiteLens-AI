import { finalizeNewAccount } from "@/backend/auth";
import { supabase } from "@/src/utils/supabase";
import * as AppleAuthentication from "expo-apple-authentication";
import { Alert, Platform } from "react-native";

interface AuthProps {
  onLogin?: () => void;
  mode?: "signin" | "signup";
}

export function Auth({ onLogin, mode = "signin" }: AuthProps) {
  if (Platform.OS !== "ios") {
    return null;
  }

  const isSignup = mode === "signup";

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={
        isSignup
          ? AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP
          : AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
      }
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={50}
      style={{ width: "100%", height: 50, borderRadius: 50 }}
      onPress={async () => {
        try {
          const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
              // Only request email — name comes from onboarding
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });

          if (!credential.identityToken) {
            throw new Error("No identityToken.");
          }

          const {
            error,
            data: { user },
          } = await supabase.auth.signInWithIdToken({
            provider: "apple",
            token: credential.identityToken,
          });

          if (error) throw error;
          if (!user)
            throw new Error(
              "Apple authentication succeeded, but no Supabase user was returned.",
            );

          if (isSignup) {
            // Name will be picked up from od.full_name in AsyncStorage
            await finalizeNewAccount(user);
          } else {
            // Returning sign-in — just ensure profile row exists, no name touch
            const { error: profileError } = await supabase
              .from("profile")
              .upsert({ id: user.id }, { onConflict: "id" });

            if (profileError) throw profileError;

            try {
              const Purchases = (await import("react-native-purchases"))
                .default;
              await Purchases.logIn(user.id);
            } catch (e) {
              console.warn("RevenueCat logIn failed (Apple signin):", e);
            }
          }

          onLogin?.();
        } catch (e: any) {
          if (e?.code === "ERR_REQUEST_CANCELED") return;

          console.error("Apple auth error:", e?.message || e);
          Alert.alert(
            isSignup ? "Apple Signup Failed" : "Apple Login Failed",
            e?.message || "Something went wrong. Please try again.",
            [{ text: "OK" }],
          );
        }
      }}
    />
  );
}
