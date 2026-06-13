import { COLORS, SPACING } from "@/src/Screens/Onboarding/Onboarding.style";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: SW, height: SH } = Dimensions.get("window");

interface MotiveIntroProps {
  isActive?: boolean;
}

export const MotiveIntro: React.FC<MotiveIntroProps> = ({
  isActive = true,
}) => {
  const chipAnim = useRef(new Animated.Value(0)).current;
  const headlineAnim = useRef(new Animated.Value(0)).current;
  const subAnim = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const shimmerLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    shimmerLoopRef.current?.stop();

    chipAnim.setValue(0);
    headlineAnim.setValue(0);
    subAnim.setValue(0);
    imageAnim.setValue(0);
    shimmerAnim.setValue(0);

    if (!isActive) return;

    const entranceAnimation = Animated.stagger(120, [
      Animated.spring(chipAnim, {
        toValue: 1,
        tension: 70,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(headlineAnim, {
        toValue: 1,
        tension: 55,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(subAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(imageAnim, {
        toValue: 1,
        tension: 38,
        friction: 7,
        useNativeDriver: true,
      }),
    ]);

    entranceAnimation.start(({ finished }) => {
      if (!finished) return;

      shimmerLoopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 2200,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      );

      shimmerLoopRef.current.start();
    });

    return () => {
      entranceAnimation.stop();
      shimmerLoopRef.current?.stop();
    };
  }, [isActive]);

  const shimmerX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SW * 0.35, SW * 0.35],
  });

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

      <View style={s.decorCircleSmall} />
      <View style={s.decorDot1} />
      <View style={s.decorDot2} />
      <View style={s.decorDot3} />

      <View style={s.content}>
        <Animated.View
          style={[
            s.sectionChip,
            {
              opacity: chipAnim,
              transform: [
                {
                  translateY: chipAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-16, 0],
                  }),
                },
                {
                  scale: chipAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.85, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={s.chipDot} />
          <Text style={s.chipText}>Section 4 of 4</Text>
        </Animated.View>

        <Animated.View
          style={{
            opacity: headlineAnim,
            transform: [
              {
                translateY: headlineAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [24, 0],
                }),
              },
            ],
          }}
        >
          <View style={s.headlineWrapper}>
            <Text style={s.headlineLine1}>What's your</Text>
            <View style={s.headlineAccentRow}>
              <View style={s.accentPill}>
                <Text style={s.accentPillText}>Motivation</Text>
                <Animated.View
                  style={[
                    s.shimmer,
                    {
                      transform: [
                        { translateX: shimmerX },
                        { skewX: "-20deg" },
                      ],
                    },
                  ]}
                />
              </View>
              <Text style={s.headlineLine2}>?</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.Text
          style={[
            s.subText,
            {
              opacity: subAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.62],
              }),
              transform: [
                {
                  translateY: subAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}
        >
          Your motivation keeps your goal in focus.{"\n"}Let's build everything
          around it ✦
        </Animated.Text>

        <Animated.View
          style={[
            s.imageContainer,
            {
              opacity: imageAnim,
              transform: [
                {
                  translateY: imageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [40, 0],
                  }),
                },
                {
                  scale: imageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.92, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={s.imageGlowRing} />
          <Image
            source={require("@/assets/images/Onboarding/motivation.png")}
            resizeMode="cover"
            style={s.heroImage}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const ACCENT_PEACH = "#FF6B4A";
const CHIP_BG = "rgba(255,107,74,0.12)";

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.backgroundGradientTop,
    overflow: "hidden",
  },

  decorCircleSmall: {
    position: "absolute",
    width: SW * 0.38,
    height: SW * 0.38,
    borderRadius: SW * 0.19,
    backgroundColor: "rgba(255,107,74,0.06)",
    bottom: SH * 0.28,
    left: -SW * 0.1,
  },
  decorDot1: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ACCENT_PEACH,
    opacity: 0.35,
    top: SH * 0.14,
    left: SW * 0.08,
  },
  decorDot2: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: ACCENT_PEACH,
    opacity: 0.25,
    top: SH * 0.22,
    right: SW * 0.1,
  },
  decorDot3: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: ACCENT_PEACH,
    opacity: 0.2,
    top: SH * 0.09,
    right: SW * 0.22,
  },

  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingTop: SH * 0.01,
  },

  sectionChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CHIP_BG,
    borderWidth: 1,
    borderColor: "rgba(255,107,74,0.22)",
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: SPACING.md,
    gap: 6,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ACCENT_PEACH,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: ACCENT_PEACH,
    letterSpacing: 0.4,
  },

  headlineWrapper: {
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  headlineLine1: {
    fontSize: 38,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -1.2,
    lineHeight: 44,
    includeFontPadding: false,
  },
  headlineAccentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headlineLine2: {
    fontSize: 38,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -1.2,
    lineHeight: 44,
    includeFontPadding: false,
  },
  accentPill: {
    backgroundColor: ACCENT_PEACH,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 2,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  accentPillText: {
    fontSize: 38,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -1.2,
    lineHeight: 44,
    includeFontPadding: false,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 40,
    backgroundColor: "rgba(255,255,255,0.22)",
  },

  subText: {
    fontSize: 15,
    fontWeight: "400",
    color: COLORS.textDark,
    textAlign: "center",
    lineHeight: 23,
    letterSpacing: 0.1,
    marginBottom: SPACING.md,
  },

  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  imageGlowRing: {
    position: "absolute",
    width: SW * 0.75,
    height: SW * 0.75,
    borderRadius: SW * 0.375,
    top: SH * 0.04,
    alignSelf: "center",
  },
  heroImage: {
    width: SW * 0.99,
    height: SH * 0.48,
    borderRadius: 24,
  },
});
