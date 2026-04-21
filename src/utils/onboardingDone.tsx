import { supabase } from "@/src/utils/supabase";
import { useEffect, useState } from "react";

export function useOnboardingDone() {
  const [onboardingSeen, setOnboardingSeen] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        // ✅ Use getSession() instead of getUser()
        // getUser() makes a server call with the current access token,
        // which FAILS when the token is expired (after ~1 hour).
        // getSession() reads from local storage and auto-refreshes
        // the token, so it works reliably even after hours of inactivity.
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          setOnboardingSeen(false);
          return;
        }

        const { data, error } = await supabase
          .from("profile")
          .select("onboarding")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error reading onboarding status", error);
          setOnboardingSeen(false);
          return;
        }

        setOnboardingSeen(data?.onboarding === true);
      } catch (e) {
        console.error("Error reading onboarding status", e);
        setOnboardingSeen(false);
      }
    };

    checkOnboarding();
  }, []);

  return onboardingSeen;
}