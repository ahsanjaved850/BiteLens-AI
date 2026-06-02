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
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
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
          if (!user) {
            throw new Error(
              "Apple authentication succeeded, but no Supabase user was returned.",
            );
          }

          const nameParts = credential.fullName
            ? [
                credential.fullName.givenName,
                credential.fullName.middleName,
                credential.fullName.familyName,
              ].filter(Boolean)
            : [];

          const appleFullName =
            nameParts.length > 0 ? nameParts.join(" ") : null;

          // Apple only returns the user's full name the first time they
          // authenticate, so persist it in Supabase auth metadata immediately.
          if (appleFullName) {
            const { error: updateUserError } = await supabase.auth.updateUser({
              data: {
                full_name: appleFullName,
                given_name: credential.fullName?.givenName ?? null,
                family_name: credential.fullName?.familyName ?? null,
              },
            });

            if (updateUserError) {
              console.error(
                "Error updating Apple user metadata:",
                updateUserError.message,
              );
            }
          }

          if (isSignup) {
            // First-time Apple signup → mirror the email/pw signUp() flow:
            // flush onboarding data, run dataAnalysis, link RevenueCat, etc.
            const fullName =
              appleFullName ||
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              null;

            await finalizeNewAccount(user, fullName);
          } else {
            // Returning Apple sign-in → just make sure the profile row exists
            // and link RevenueCat. No onboarding-data flush — there is no
            // onboarding data for a returning user.
            const fullName =
              appleFullName ||
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              null;

            const { error: profileError } = await supabase
              .from("profile")
              .upsert(
                {
                  id: user.id,
                  full_name: fullName,
                },
                { onConflict: "id" },
              );

            if (profileError) throw profileError;

            // Link RevenueCat for the returning user
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
          if (e?.code === "ERR_REQUEST_CANCELED") {
            return;
          }

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
