import { COLORS, SPACING } from "@/src/Screens/Onboarding/Onboarding.style";
import { Ionicons } from "@expo/vector-icons";
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

interface FoodComparisonProps {
  isActive?: boolean;
}

export const FoodComparison: React.FC<FoodComparisonProps> = ({
  isActive = true,
}) => {
  const titleAnim = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset every time slide becomes inactive/active.
    // This prevents the animation from finishing before the user reaches the slide.
    titleAnim.setValue(0);
    imageAnim.setValue(0);
    cardAnim.setValue(0);

    if (!isActive) return;

    const animation = Animated.sequence([
      // Step 1 — Headline slides in
      Animated.spring(titleAnim, {
        toValue: 1,
        tension: 65,
        friction: 9,
        useNativeDriver: true,
      }),

      Animated.delay(100),

      // Step 2 — Image rises in after headline settles
      Animated.spring(imageAnim, {
        toValue: 1,
        tension: 42,
        friction: 7,
        useNativeDriver: true,
      }),

      Animated.delay(120),

      // Step 3 — Insight card fades up last
      Animated.spring(cardAnim, {
        toValue: 1,
        tension: 52,
        friction: 8,
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [isActive, titleAnim, imageAnim, cardAnim]);

  return (
    <View style={s.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.backgroundGradientTop}
      />

      <LinearGradient
        colors={[
          COLORS.backgroundGradientTop,
          COLORS.backgroundGradientMid,
          COLORS.backgroundGradientBottom,
        ]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={s.content}>
        {/* ── Headline ── */}
        <Animated.View
          style={[
            s.headerWrap,
            {
              opacity: titleAnim,
              transform: [
                {
                  translateY: titleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [32, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={s.headline}>
            Learn to make{"\n"}
            <Text style={s.headlineAccent}>better food choices.</Text>
          </Text>
        </Animated.View>

        {/* ── Image ── */}
        <Animated.View
          style={[
            s.imageWrapper,
            {
              opacity: imageAnim,
              transform: [
                {
                  translateY: imageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [48, 0],
                  }),
                },
                {
                  scale: imageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.93, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Image
            source={require("@/assets/images/Onboarding/comparison.png")}
            resizeMode="contain"
            style={s.image}
          />
        </Animated.View>

        {/* ── Insight card ── */}
        <Animated.View
          style={[
            s.insightCard,
            {
              opacity: cardAnim,
              transform: [
                {
                  translateY: cardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Ionicons name="nutrition" size={18} color={COLORS.primary} />

          <Text style={s.insightText}>
            See exactly what's in your food —{" "}
            <Text style={s.insightBold}>calories, macros & hidden sugars</Text>{" "}
            — so every bite is a confident choice.
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.backgroundGradientTop,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    gap: 10,
  },

  /* Headline */
  headerWrap: {
    width: "100%",
    alignItems: "center",
  },
  headline: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.textDark,
    textAlign: "center",
    letterSpacing: -1,
    lineHeight: 42,
  },
  headlineAccent: {
    color: COLORS.primary,
  },

  /* Image */
  imageWrapper: {
    width: SW * 0.96,
    height: SH * 0.47,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  image: {
    width: "100%",
    height: "120%",
  },

  /* Insight card */
  insightCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderRadius: 18,
    padding: 14,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(230,185,150,0.45)",
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  insightText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  insightBold: {
    fontWeight: "700",
    color: COLORS.textDark,
  },
});
