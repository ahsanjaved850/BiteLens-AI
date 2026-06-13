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

interface ExerciseProps {
  isActive?: boolean;
}

export const Exercise: React.FC<ExerciseProps> = ({ isActive = true }) => {
  const titleAnim = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(0)).current;
  const sourceAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    titleAnim.setValue(0);
    imageAnim.setValue(0);
    sourceAnim.setValue(0);
    cardAnim.setValue(0);

    if (!isActive) return;

    const animation = Animated.sequence([
      Animated.spring(titleAnim, {
        toValue: 1,
        tension: 65,
        friction: 9,
        useNativeDriver: true,
      }),

      Animated.spring(imageAnim, {
        toValue: 1,
        tension: 42,
        friction: 7,
        useNativeDriver: true,
      }),

      Animated.spring(sourceAnim, {
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
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [isActive]);

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
            Burn 500 calories{"\n"}
            <Text style={s.headlineAccent}>a day, effortlessly.</Text>
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
            source={require("@/assets/images/Onboarding/exercise.png")}
            resizeMode="cover"
            style={s.image}
          />
        </Animated.View>

        {/* ── Source badge ── */}
        <Animated.View
          style={[
            s.sourceRow,
            {
              opacity: sourceAnim,
              transform: [
                {
                  translateY: sourceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Ionicons name="shield-checkmark" size={13} color={COLORS.primary} />
          <Text style={s.sourceText}>
            Based on research by the{" "}
            <Text style={s.sourceBold}>American Council on Exercise (ACE)</Text>{" "}
            — combining cardio & strength burns ~500 kcal/day for most adults.
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
    height: SH * 0.45,
    borderRadius: 22,
    marginVertical: 40,
  },
  image: {
    width: "100%",
    height: "110%",
    padding: 10,
  },

  /* Source badge */
  sourceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    width: "100%",
    paddingHorizontal: 4,
  },
  sourceText: {
    flex: 1,
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  sourceBold: {
    fontWeight: "700",
    color: COLORS.textDark,
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
