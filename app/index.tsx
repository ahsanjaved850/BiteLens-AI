import { supabase } from "@/src/utils/supabase";
import { useWelcomeSeen } from "@/src/utils/welcomeSeen";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

type Destination =
  | "/tabs/home"
  | "/auth/onboarding"
  | "/auth/welcome"
  | "/auth/welcome?direct=1";

export default function Index() {
  const welcomeSeen = useWelcomeSeen();
  const [destination, setDestination] = useState<Destination | null>(null);

  useEffect(() => {
    if (welcomeSeen === null) return;

    const decide = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const { data: profile } = await supabase
            .from("profile")
            .select("onboarding")
            .eq("id", session.user.id)
            .single();

          if (profile?.onboarding === true) {
            // Fully set up — go to app
            setDestination("/tabs/home");
          } else {
            // Has account but onboarding incomplete — resume onboarding
            setDestination("/auth/onboarding");
          }
          return;
        }

        // No session — show welcome screen
        setDestination(
          welcomeSeen ? "/auth/welcome?direct=1" : "/auth/welcome",
        );
      } catch (e) {
        console.error("index: bootstrap failed", e);
        setDestination(
          welcomeSeen ? "/auth/welcome?direct=1" : "/auth/welcome",
        );
      }
    };

    decide();
  }, [welcomeSeen]);

  if (destination === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFE0C2", // app gradient top — peach
        }}
      >
        <ActivityIndicator size="large" color="#F47B20" />
      </View>
    );
  }

  return <Redirect href={destination} />;
}
