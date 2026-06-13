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

const STAT_ITEMS = [
  { value: "81%", label: "bounce back\nwith fad diets" },
  { value: "3×", label: "better retention\nwith Orca plans" },
];

interface LongTermResultsProps {
  isActive?: boolean;
}

export const LongTermResults: React.FC<LongTermResultsProps> = ({
  isActive = true,
}) => {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Always reset first.
    // This is important because onboarding/carousel screens often mount slides early.
    headerAnim.setValue(0);
    imageAnim.setValue(0);
    statsAnim.setValue(0);
    cardAnim.setValue(0);

    // Do not run animation until this slide is actually active/visible.
    if (!isActive) return;

    const animation = Animated.sequence([
      Animated.spring(headerAnim, {
        toValue: 1,
        tension: 65,
        friction: 9,
        useNativeDriver: true,
      }),

      Animated.delay(90),

      Animated.spring(imageAnim, {
        toValue: 1,
        tension: 42,
        friction: 7,
        useNativeDriver: true,
      }),

      Animated.delay(90),

      Animated.spring(statsAnim, {
        toValue: 1,
        tension: 48,
        friction: 8,
        useNativeDriver: true,
      }),

      Animated.delay(90),

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
  }, [isActive, headerAnim, imageAnim, statsAnim, cardAnim]);

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
              opacity: headerAnim,
              transform: [
                {
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [22, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={s.headline}>
            Real progress,{"\n"}
            <Text style={s.headlineAccent}>not just hype.</Text>
          </Text>
        </Animated.View>

        {/* ── Graph image ── */}
        <Animated.View
          style={[
            s.imageWrapper,
            {
              opacity: imageAnim,
              transform: [
                {
                  translateY: imageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
                {
                  scale: imageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Image
            source={require("@/assets/images/Onboarding/graph2.png")}
            resizeMode="cover"
            style={s.graphImage}
          />
        </Animated.View>

        {/* ── Stat pills row ── */}
        <Animated.View
          style={[
            s.statsRow,
            {
              opacity: statsAnim,
              transform: [
                {
                  translateY: statsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [18, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {STAT_ITEMS.map((item, idx) => (
            <View key={idx} style={s.statPill}>
              <Text style={s.statValue}>{item.value}</Text>
              <Text style={s.statLabel}>{item.label}</Text>
            </View>
          ))}
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
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={s.insightIconWrap}>
            <Ionicons name="bulb" size={18} color={COLORS.primary} />
          </View>

          <Text style={s.insightText}>
            Avoid the <Text style={s.insightBold}>81% bounce-back risk</Text> of
            unsustainable diets. Orca builds habits that actually stick.
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

  headerWrap: {
    width: "100%",
    alignItems: "center",
  },

  /* Headline */
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

  /* Graph image */
  imageWrapper: {
    width: SW * 0.93,
    height: SH * 0.38,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.45)",
    borderWidth: 1,
    borderColor: "rgba(230,190,160,0.4)",
    marginTop: SPACING.xxl,
  },
  graphImage: {
    width: "100%",
    height: "100%",
    padding: 8,
  },

  /* Stats row */
  statsRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginTop: SPACING.lg,
  },
  statPill: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.68)",
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(230,185,150,0.4)",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: -0.5,
    includeFontPadding: false,
  },
  statLabel: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 13,
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
  insightIconWrap: {
    marginTop: 1,
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
