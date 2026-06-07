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

export const Graph: React.FC = () => {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const badgeAnim = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(110, [
      Animated.spring(headerAnim, {
        toValue: 1,
        tension: 65,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.spring(badgeAnim, {
        toValue: 1,
        tension: 55,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(imageAnim, {
        toValue: 1,
        tension: 42,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(statsAnim, {
        toValue: 1,
        tension: 48,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(cardAnim, {
        toValue: 1,
        tension: 52,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
          style={{
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [22, 0],
                }),
              },
            ],
          }}
        >
          <Text style={s.headline}>
            Achieve your best results{"\n"}
            <Text style={s.headlineAccent}>with balanced Nutrition</Text>
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
            source={require("@/assets/images/Onboarding/graph1.png")}
            resizeMode="cover"
            style={s.graphImage}
          />
          {/* Graph inner label */}
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
            Backed by <Text style={s.insightBold}>cutting-edge research</Text>{" "}
            balanced nutrition deliver steady and long lasting results.
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

  /* Decorative blobs */
  blobTopRight: {
    position: "absolute",
    top: -60,
    right: -70,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "rgba(255, 180, 130, 0.18)",
  },
  blobBottomLeft: {
    position: "absolute",
    bottom: 80,
    left: -80,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255, 200, 160, 0.14)",
  },

  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    gap: 10,
  },

  /* Eyebrow badge */
  eyebrowBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(230, 180, 140, 0.55)",
    alignSelf: "center",
  },
  eyebrowText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: 1.1,
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
    marginBottom: SPACING.xxl,
  },
  graphImage: {
    width: "100%",
    height: "100%",
    padding: 10,
  },
  graphLabel: {
    position: "absolute",
    bottom: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  graphLabelText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
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
