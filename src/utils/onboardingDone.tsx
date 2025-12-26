import { supabase } from "@/src/utils/supabase";
import { useEffect, useState } from "react";

export function useOnboardingDone() {
  const [onboardingSeen, setOnboardingSeen] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setOnboardingSeen(false);
          return;
        }

        const { data, error } = await supabase
          .from("profile")
          .select("onboarding")
          .eq("id", user.id)
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