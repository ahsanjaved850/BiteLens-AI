import {
  COLORS,
  SHADOWS,
  SPACING,
} from "@/src/Screens/Onboarding/Onboarding.style";
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

// ────────────────────────────────────────────────────────────────────
// Content — Improved based on user research
// OLD: "Eat smarter, not harder" (generic, forgettable)
// NEW: "Track in seconds, not minutes" (addresses #1 pain point)
// ────────────────────────────────────────────────────────────────────
const C = {
  logo: require("@/assets/images/nutritrack-adaptive-icon.png"),
  brand: "NutriTrack",
  headline: "Track in seconds,\nnot minutes.",
  sub: "Snap a photo. Get your macros.\nNo guilt. No spreadsheets.",
  heroImage: require("@/assets/images/vegan.jpg"),
  socialProof: {
    rating: "4.9",
    reviews: "12K+ reviews",
    stars: 5,
  },
  trust: "Join 500K+ people eating smarter",
} as const;

// ────────────────────────────────────────────────────────────────────
// Nutrition Pill — floating macro badges on the hero image
// ────────────────────────────────────────────────────────────────────
const NutritionPill: React.FC<{
  value: string;
  unit: string;
  delay: number;
}> = ({ value, unit, delay }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      tension: 55,
      friction: 8,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        pill.container,
        {
          opacity: anim,
          transform: [
            {
              scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.4, 1],
              }),
            },
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [12, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={pill.value}>{value}</Text>
      <Text style={pill.unit}>{unit}</Text>
    </Animated.View>
  );
};

const pill = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderRadius: 28,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  value: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  unit: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
    textTransform: "lowercase",
  },
});

// ────────────────────────────────────────────────────────────────────
// Star Row
// ────────────────────────────────────────────────────────────────────
const StarRow: React.FC<{ count: number }> = ({ count }) => (
  <View style={{ flexDirection: "row", gap: 2 }}>
    {Array.from({ length: count }).map((_, i) => (
      <Text key={i} style={{ fontSize: 14, color: "#F5A623" }}>
        ★
      </Text>
    ))}
  </View>
);

// ────────────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────────────
export const AppIntro: React.FC = () => {
  const logoAnim = useRef(new Animated.Value(0)).current;
  const headAnim = useRef(new Animated.Value(0)).current;
  const subAnim = useRef(new Animated.Value(0)).current;
  const heroAnim = useRef(new Animated.Value(0)).current;
  const proofAnim = useRef(new Animated.Value(0)).current;
  const trustAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(headAnim, {
        toValue: 1,
        tension: 50,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.timing(subAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.spring(heroAnim, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(proofAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(trustAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={s.topGlow} />

      <View style={s.content}>
        {/* LOGO */}
        <Animated.View
          style={[
            s.logoRow,
            {
              opacity: logoAnim,
              transform: [
                {
                  translateY: logoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={s.logoCircle}>
            <Image source={C.logo} style={s.logoImage} resizeMode="contain" />
          </View>
          <Text style={s.brandName}>{C.brand}</Text>
        </Animated.View>

        {/* HEADLINE */}
        <Animated.View
          style={[
            s.headlineWrap,
            {
              opacity: headAnim,
              transform: [
                {
                  translateY: headAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={s.headline}>{C.headline}</Text>
        </Animated.View>

        {/* SUBTITLE */}
        <Animated.View style={{ opacity: subAnim }}>
          <Text style={s.subtitle}>{C.sub}</Text>
        </Animated.View>

        {/* HERO */}
        <Animated.View
          style={[
            s.heroWrap,
            {
              opacity: heroAnim,
              transform: [
                {
                  scale: heroAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.92, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={s.heroContainer}>
            <Image source={C.heroImage} style={s.heroImage} />
            <View style={[s.pillPosition, { left: "5%", top: "14%" }]}>
              <NutritionPill value="324" unit="cal" delay={900} />
            </View>
            <View style={[s.pillPosition, { right: "5%", top: "8%" }]}>
              <NutritionPill value="28g" unit="protein" delay={1050} />
            </View>
            <View style={[s.pillPosition, { right: "8%", bottom: "12%" }]}>
              <NutritionPill value="12g" unit="carbs" delay={1200} />
            </View>
          </View>
        </Animated.View>

        {/* SOCIAL PROOF */}
        <Animated.View style={[s.proofRow, { opacity: proofAnim }]}>
          <StarRow count={5} />
          <Text style={s.proofRating}>4.9</Text>
          <View style={s.proofDivider} />
          <Text style={s.proofReviews}>12K+ reviews</Text>
        </Animated.View>

        {/* TRUST */}
        <Animated.View style={{ opacity: trustAnim }}>
          <Text style={s.trustText}>{C.trust}</Text>
        </Animated.View>
      </View>
    </View>
  );
};

// ────────────────────────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },

  topGlow: {
    position: "absolute",
    top: -SH * 0.12,
    left: -SW * 0.2,
    width: SW * 1.4,
    height: SH * 0.35,
    borderRadius: SH * 0.35,
    backgroundColor: "rgba(245, 166, 35, 0.06)",
  },

  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    alignItems: "center",
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    gap: 10,
  },

  logoCircle: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },

  logoImage: {
    width: 38,
    height: 38,
  },

  brandName: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textDark,
  },

  headlineWrap: { marginBottom: SPACING.sm },
  headline: {
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    color: COLORS.textDark,
  },

  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },

  heroWrap: { width: "100%", flex: 1 },
  heroContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    ...SHADOWS.large,
  },
  heroImage: { width: "100%", height: "100%" },

  pillPosition: { position: "absolute" },

  proofRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 32,
    backgroundColor: COLORS.backgroundCard,
  },

  proofRating: { fontWeight: "800" },
  proofDivider: { width: 1, height: 14, backgroundColor: COLORS.border },
  proofReviews: { color: COLORS.textSecondary },

  trustText: {
    fontSize: 13,
    textAlign: "center",
    color: COLORS.textLight,
  },
});