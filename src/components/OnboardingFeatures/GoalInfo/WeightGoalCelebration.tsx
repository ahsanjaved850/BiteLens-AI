import { COLORS, SPACING } from "@/src/Screens/Onboarding/Onboarding.style";
// import { getGlobalCurrentWeight } from "@/src/components/OnboardingFeatures/GoalInfo/CurrentWeight";
// import { getGlobalTargetWeight } from "@/src/components/OnboardingFeatures/GoalInfo/TargetWeight";
import { getGlobalCurrentWeight } from "@/src/components/OnboardingFeatures/GoalInfo/CurrentWeight";
import { getGlobalTargetWeight } from "@/src/components/OnboardingFeatures/GoalInfo/TargetWeight";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: SW, height: SH } = Dimensions.get("window");
// ─── Single firework burst ─────────────────────────────────────────────────
// Each burst has N spokes that expand outward from a center point.
// The spoke color cycles through brand-adjacent warm tones.
const SPOKE_COLORS = [
  "#F47B20",
  "#FFB347",
  "#FF6B6B",
  "#C084FC",
  "#60A5FA",
  "#34D399",
  "#FBBF24",
  "#F472B6",
];

const FireworkBurst: React.FC<{
  x: number;
  y: number;
  delay: number;
  size: number;
  spokeCount?: number;
}> = ({ x, y, delay, size, spokeCount = 12 }) => {
  const expandAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = () => {
      expandAnim.setValue(0);
      opacityAnim.setValue(0);

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(expandAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ]),
        Animated.delay(1800 + Math.random() * 800),
      ]).start(() => loop());
    };
    loop();
  }, []);

  return (
    <Animated.View
      style={[styles.burstContainer, { left: x, top: y, opacity: opacityAnim }]}
    >
      {Array.from({ length: spokeCount }).map((_, i) => {
        const angle = (i / spokeCount) * 2 * Math.PI;
        const color = SPOKE_COLORS[i % SPOKE_COLORS.length];
        const translateX = expandAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.cos(angle) * size],
        });
        const translateY = expandAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.sin(angle) * size],
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.spoke,
              {
                backgroundColor: color,
                width: size * 0.1,
                height: size * 0.32,
                borderRadius: size * 0.06,
                transform: [
                  { rotate: `${(angle * 180) / Math.PI + 90}deg` },
                  { translateX },
                  { translateY },
                ],
              },
            ]}
          />
        );
      })}
    </Animated.View>
  );
};

// ─── Firework positions ────────────────────────────────────────────────────
const FIREWORKS = [
  { x: SW * 0.72, y: SH * 0.04, delay: 0, size: 80, spokes: 14 },
  { x: SW * 0.55, y: SH * 0.0, delay: 800, size: 48, spokes: 10 },
  { x: SW * 0.78, y: SH * 0.18, delay: 200, size: 36, spokes: 8 },
  { x: SW * 0.08, y: SH * 0.22, delay: 600, size: 44, spokes: 10 },
];

// ─── Main Component ────────────────────────────────────────────────────────
export const WeightGoalCelebration: React.FC = () => {
  const thumbAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subAnim = useRef(new Animated.Value(0)).current;

  const currentW = getGlobalCurrentWeight();
  const targetW = getGlobalTargetWeight?.() ?? currentW - 5;

  const diff = Math.abs(currentW - targetW);
  const isLosing = targetW < currentW;
  const isGaining = targetW > currentW;

  // Dynamic headline
  const action = isLosing ? "Losing" : isGaining ? "Gaining" : "Maintaining";
  const diffText = diff > 0 ? `${diff}kg` : "";

  const headline =
    diff > 0
      ? `${action} ${diffText} is a\nchallenging goal.\nYou can do it!`
      : `Maintaining your weight\nis a great goal.\nLet's do it!`;

  useEffect(() => {
    Animated.stagger(180, [
      Animated.spring(thumbAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(titleAnim, {
        toValue: 1,
        tension: 48,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(subAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Split headline to highlight the diff number in orange
  const renderHeadline = () => {
    if (diff === 0) {
      return <Text style={s.title}>{headline}</Text>;
    }
    // e.g. "Losing 12kg is a\nchallenging goal.\nYou can do it!"
    const parts = headline.split(diffText);
    return (
      <Text style={s.title}>
        {parts[0]}
        <Text style={s.titleHighlight}>{diffText}</Text>
        {parts[1]}
      </Text>
    );
  };

  return (
    <View style={s.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.backgroundGradientTop}
      />

      {/* Gradient background */}
      <LinearGradient
        colors={[
          COLORS.backgroundGradientTop,
          COLORS.backgroundGradientMid,
          COLORS.backgroundGradientBottom,
        ]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Firework bursts — rendered behind content */}
      {FIREWORKS.map((fw, i) => (
        <FireworkBurst
          key={i}
          x={fw.x}
          y={fw.y}
          delay={fw.delay}
          size={fw.size}
          spokeCount={fw.spokes}
        />
      ))}

      {/* Content */}
      <View style={s.content}>
        {/* Trust icon — spring bounces in */}
        <Animated.View
          style={{
            opacity: thumbAnim,
            transform: [
              {
                scale: thumbAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
              },
              {
                translateY: thumbAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
            marginBottom: SPACING.xl,
          }}
        >
          <Image
            source={require("@/assets/images/Onboarding/trust.png")}
            style={s.trustIcon}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Headline with orange highlighted number */}
        <Animated.View
          style={{
            opacity: titleAnim,
            transform: [
              {
                translateY: titleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [24, 0],
                }),
              },
            ],
          }}
        >
          {renderHeadline()}
        </Animated.View>

        {/* Subtitle */}
        <Animated.Text style={[s.subtitle, { opacity: subAnim }]}>
          89% of users see visible results with Orca's plan and find it easy to
          maintain their progress
        </Animated.Text>
      </View>
    </View>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.backgroundGradientTop,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },

  // Firework spoke container — centered on x,y
  // (defined separately so FireworkBurst can use it)

  trustIcon: {
    width: 300,
    height: 300,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: COLORS.textDark,
    textAlign: "center",
    letterSpacing: -0.8,
    lineHeight: 40,
    marginBottom: SPACING.lg,
  },
  titleHighlight: {
    color: COLORS.primary, // #F47B20 — orange weight number
    fontWeight: "900",
  },

  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 23,
    marginBottom: SPACING.xl,
  },

  // Current → Target pill
  diffPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFAF6",
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: "#F0DED0",
    paddingHorizontal: 28,
    paddingVertical: 14,
    gap: 20,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  diffItem: {
    alignItems: "center",
  },
  diffLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  diffValue: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  diffArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.primaryMuted,
  },
  diffArrowText: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.primary,
  },
});

// Burst container style defined outside component for perf
const styles = StyleSheet.create({
  burstContainer: {
    position: "absolute",
    width: 0,
    height: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  spoke: {
    position: "absolute",
  },
});
