import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

//  Stats
const STATS = [
  { value: "1K+", label: "Total Users" },
  { value: "100k+", label: "Total Food Scanned" },
  { value: "1M+", label: "Calories Tracked" },
] as const;

interface Props {
  isActive: boolean;
  onGetStarted: () => void;
  onLogin: () => void;
}

//  Laurel SVG as text emoji block
// Uses the wheat emoji which looks identical to the reference laurel
const Laurel = ({ flip = false }: { flip?: boolean }) => (
  <Text style={[st.laurel, flip && { transform: [{ scaleX: -1 }] }]}>🌾</Text>
);

//  Single stat row
const StatRow: React.FC<{
  value: string;
  label: string;
  delay: number;
}> = ({ value, label, delay }) => (
  <Animated.View
    entering={FadeInUp.duration(520).delay(delay)}
    style={st.statRow}
  >
    <Laurel />
    <View style={st.statCenter}>
      <Text style={st.statValue}>{value}</Text>
      <Text style={st.statLabel}>{label}</Text>
    </View>
    <Laurel flip />
  </Animated.View>
);

//  Main Component─
export const Slide3: React.FC<Props> = ({
  isActive,
  onGetStarted,
  onLogin,
}) => {
  const confettiRef = useRef<ConfettiCannon | null>(null);
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (isActive && !hasFiredRef.current) {
      hasFiredRef.current = true;
      const t = setTimeout(() => confettiRef.current?.start(), 300);
      return () => clearTimeout(t);
    }
  }, [isActive]);

  return (
    <View style={st.container}>
      {/* Gradient — peach top fades to white — matches app theme */}
      <LinearGradient
        colors={["#FFE0C2", "#FFF5EC", "#FFFFFF"]}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Confetti */}
      {isActive && (
        <ConfettiCannon
          ref={(ref) => {
            confettiRef.current = ref;
          }}
          count={120}
          origin={{ x: SCREEN_W / 2, y: -10 }}
          autoStart={false}
          fadeOut
          fallSpeed={3000}
          explosionSpeed={380}
          colors={["#F47B20", "#FFB347", "#FF6B6B", "#C084FC", "#60A5FA"]}
        />
      )}

      <View style={st.content}>
        {/*─ Headline─ */}
        {isActive && (
          <Animated.View
            entering={FadeInDown.duration(600)}
            style={st.headlineBlock}
          >
            <Text style={st.headlineSmall}>Let weight loss be</Text>
            <Text style={st.headlineHuge}>EASIER</Text>
            <Text style={st.headlineNavy}>EVER</Text>
          </Animated.View>
        )}

        {/*─ Stats — laurel on each side, clean dividers─ */}
        {isActive && (
          <View style={st.statsBlock}>
            {STATS.map((s, i) => (
              <React.Fragment key={s.value}>
                <StatRow
                  value={s.value}
                  label={s.label}
                  delay={300 + i * 160}
                />
                {i < STATS.length - 1 && (
                  <Animated.View
                    entering={FadeInUp.duration(300).delay(440 + i * 160)}
                    style={st.divider}
                  />
                )}
              </React.Fragment>
            ))}
          </View>
        )}

        {/*─ CTAs─ */}
        {isActive && (
          <Animated.View
            entering={FadeInUp.duration(500).delay(900)}
            style={st.ctaBlock}
          >
            {/* Get Started — dark navy pill matching reference */}
            <Pressable
              onPress={onGetStarted}
              style={({ pressed }) => [
                st.getStartedBtn,
                pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
              ]}
            >
              <Text style={st.getStartedText}>Get Started</Text>
            </Pressable>

            {/* Already a user — matches reference: plain text + orange link */}
            <Pressable onPress={onLogin} hitSlop={12}>
              <Text style={st.loginRow}>
                Already have an account?{" "}
                <Text style={st.loginLink}>Log in</Text>
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

//  Styles
const st = StyleSheet.create({
  container: {
    width: SCREEN_W,
    height: SCREEN_H,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: SCREEN_H * 0.1,
    paddingBottom: 48,
    justifyContent: "space-between",
  },

  //─ Headline
  headlineBlock: {
    alignItems: "center",
  },
  headlineSmall: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F1A22",
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  headlineHuge: {
    fontSize: 68,
    fontWeight: "900",
    color: "#F47B20", // brand orange
    letterSpacing: -2.5,
    lineHeight: 72,
  },
  headlineNavy: {
    fontSize: 52,
    fontWeight: "900",
    color: "#1C2B36", // dark navy
    letterSpacing: -2,
    lineHeight: 56,
  },

  //─ Stats─
  statsBlock: {
    gap: 0,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  laurel: {
    fontSize: 48,
  },
  statCenter: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 38,
    fontWeight: "900",
    color: "#F47B20",
    letterSpacing: -1.5,
    lineHeight: 44,
  },
  statLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C2B36",
    letterSpacing: -0.3,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(240, 222, 208, 0.8)",
    marginHorizontal: 16,
  },

  //─ CTAs─
  ctaBlock: {
    alignItems: "center",
    gap: 18,
  },
  // Dark navy pill — exact match to reference screenshot
  getStartedBtn: {
    backgroundColor: "#0F1A22",
    width: "100%",
    paddingVertical: 22,
    borderRadius: 50,
    alignItems: "center",
    shadowColor: "#0F1A22",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
  },
  getStartedText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  // Plain text row with orange link — exact match to reference
  loginRow: {
    fontSize: 15,
    fontWeight: "500",
    color: "#7A8A98",
  },
  loginLink: {
    color: "#F47B20",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
