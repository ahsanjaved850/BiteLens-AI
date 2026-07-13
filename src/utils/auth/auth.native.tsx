import { finalizeNewAccount } from "@/backend/auth";
import { supabase } from "@/src/utils/supabase";
import * as AppleAuthentication from "expo-apple-authentication";
import { Alert, Platform } from "react-native";

interface AuthProps {
  onLogin?: () => void;
  onAuthStart?: () => void;
  onAuthError?: () => void;
  // Called (signin mode only) when Apple auth succeeds at the Apple/Supabase
  // level but the user has no profile row in our DB  meaning they never
  // completed signup. The Supabase session is signed out before this fires.
  onNoAccount?: () => void;
  mode?: "signin" | "signup";
}

const waitForOverlayFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

export function Auth({
  onLogin,
  onAuthStart,
  onAuthError,
  onNoAccount,
  mode = "signin",
}: AuthProps) {
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
              // Only request email  name comes from onboarding
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });

          if (!credential.identityToken) {
            throw new Error("No identityToken.");
          }

          // Do not show overlay before signInAsync  the native Apple sheet
          // owns the screen. Start it immediately after Apple returns and
          // before Supabase/finalize API work begins.
          if (isSignup) {
            onAuthStart?.();
            await waitForOverlayFrame();
          }

          // Step 1: Exchange Apple token with Supabase
          // For SIGNUP: Supabase creates a new auth.users row (or returns the
          //   existing one if the Apple ID was used before). user.id is the
          //   stable UUID we use as the PK for our profile table.
          // For SIGNIN: Supabase finds the existing auth.users row. If no row
          //   exists it still creates one  but we gate on our own profile
          //   table below, so a ghost auth user never reaches Home.
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

          // Step 2: Branch on mode
          if (isSignup) {
            // SIGNUP  user.id is now available as the stable UUID.
            // finalizeNewAccount creates the profile row, seeds weight_logs,
            // runs dataAnalysis, and sets onboarding: true.
            await finalizeNewAccount(user);

            // Keep the signup overlay visible. The router will take the user
            // to Home and unmount LoginScreen.
            onLogin?.();
          } else {
            // SIGNIN  check that a real, fully-onboarded profile exists.
            // We use maybeSingle() so a missing row returns null rather than
            // throwing a "no rows" error.
            const { data: profile, error: profileError } = await supabase
              .from("profile")
              .select("onboarding")
              .eq("id", user.id)
              .maybeSingle();

            if (profileError) throw profileError;

            // Profile missing or onboarding never completed → this Apple ID
            // has no real account in our system. Sign out the ghost session
            // and surface the "no account" message to the user.
            if (!profile || profile.onboarding !== true) {
              await supabase.auth.signOut();
              onNoAccount?.();
              return;
            }

            // Valid returning user  connect RevenueCat then navigate home.
            try {
              const Purchases = (await import("react-native-purchases"))
                .default;
              await Purchases.logIn(user.id);
            } catch (e) {
              console.warn("RevenueCat logIn failed (Apple signin):", e);
            }

            onLogin?.();
          }
        } catch (e: any) {
          if (isSignup) onAuthError?.();

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
