import { COLORS, SPACING } from "@/src/Screens/Onboarding/Onboarding.style";
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

export const Approach: React.FC = () => {
  const titleAnim = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Step 1 – Headline slides in
    Animated.spring(titleAnim, {
      toValue: 1,
      tension: 65,
      friction: 9,
      useNativeDriver: true,
    }).start(() => {
      // Step 2 – Image rises in after headline settles
      Animated.spring(imageAnim, {
        toValue: 1,
        tension: 42,
        friction: 7,
        useNativeDriver: true,
      }).start(() => {
        // Step 3 – Stat pills appear
        Animated.spring(statsAnim, {
          toValue: 1,
          tension: 48,
          friction: 8,
          useNativeDriver: true,
        }).start(() => {
          // Step 4 – Insight card fades up last
          Animated.spring(cardAnim, {
            toValue: 1,
            tension: 52,
            friction: 8,
            useNativeDriver: true,
          }).start();
        });
      });
    });
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
            opacity: titleAnim,
            transform: [
              {
                translateY: titleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [32, 0],
                }),
              },
            ],
          }}
        >
          <Text style={s.headline}>
            Orca simplifies the{"\n"}
            <Text style={s.headlineAccent}>Weight loss</Text>
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
            source={require("@/assets/images/Onboarding/approach.png")}
            resizeMode="cover"
            style={s.image}
          />
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
    marginTop: 30,
  },
  image: {
    width: "100%",
    height: "110%",
  },

  /* Stats */
  statsRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
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
