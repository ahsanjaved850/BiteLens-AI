import { configureRevenueCat } from "@/src/utils/paywall/revenuecat";
import { supabase } from "@/src/utils/supabase";
import { Stack } from "expo-router";
import { useEffect } from "react";
import Purchases from "react-native-purchases";

export default function RootLayout() {
  useEffect(() => {
    const init = async () => {
      configureRevenueCat();

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user?.id) {
          const currentInfo = await Purchases.getCustomerInfo();
          if (currentInfo.originalAppUserId !== session.user.id) {
            await Purchases.logIn(session.user.id);
          }
        }
      } catch (e) {
        console.warn("RevenueCat early logIn failed:", e);
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" && session?.user?.id) {
          try {
            const currentInfo = await Purchases.getCustomerInfo();
            const currentRCUserId = currentInfo.originalAppUserId;

            if (currentRCUserId !== session.user.id) {
              await Purchases.logIn(session.user.id);
            }
          } catch (e) {
            console.warn("RevenueCat logIn failed (auth state change):", e);
          }
        } else if (event === "SIGNED_OUT") {
          try {
            await Purchases.logOut();
          } catch (e) {
            console.warn("RevenueCat logOut failed:", e);
          }
        }
      });

      return () => subscription.unsubscribe();
    };

    init();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="tabs" />
      </Stack>
    </>
  );
}
