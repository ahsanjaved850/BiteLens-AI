import { COLORS, SPACING } from "@/src/Screens/Onboarding/Onboarding.style";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: SW, height: SH } = Dimensions.get("window");

const IMAGES = [
  require("@/assets/images/Onboarding/intro1.png"),
  require("@/assets/images/Onboarding/intro2.png"),
  require("@/assets/images/Onboarding/intro3.png"),
] as const;

// How long each image is fully visible before the crossfade begins
const HOLD_DURATION = 1800;
// Duration of the opacity crossfade between images
const FADE_DURATION = 600;

// ─── Floating ambient orb ────────────────────────────────────────────────────
const FloatingOrb: React.FC<{
  size: number;
  top: number;
  left: number;
  color: string;
  delay: number;
  amplitude: number;
}> = ({ size, top, left, color, delay, amplitude }) => {
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 3800 + delay * 400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 3800 + delay * 400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    const timer = setTimeout(() => loop.start(), delay * 300);
    return () => {
      clearTimeout(timer);
      loop.stop();
    };
  }, []);

  return (
    <Animated.View
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: 0.15,
        transform: [
          {
            translateY: drift.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -amplitude],
            }),
          },
        ],
      }}
    />
  );
};

// ─── Props ───────────────────────────────────────────────────────────────────
interface AppIntroProps {
  isActive?: boolean;
}

// ─── Main component ──────────────────────────────────────────────────────────
export const AppIntro: React.FC<AppIntroProps> = ({ isActive = true }) => {
  // Entrance anims
  const eyebrowAnim = useRef(new Animated.Value(0)).current;
  const headline1Anim = useRef(new Animated.Value(0)).current;
  const headline2Anim = useRef(new Animated.Value(0)).current;
  const frameAnim = useRef(new Animated.Value(0)).current;
  const trustAnim = useRef(new Animated.Value(0)).current;

  // Subtle breathing scale on the image frame
  const imageScale = useRef(new Animated.Value(1)).current;

  // Three persistent opacity values — one per image slot.
  // We keep all three images mounted permanently to avoid decode-on-mount
  // stutter. Only opacities change during transitions.
  const opacities = useRef([
    new Animated.Value(1), // intro1 starts fully visible
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  // Which slot is currently "active" (fully visible). Stored in a ref so the
  // crossfade scheduler never needs to re-subscribe to state changes.
  const activeIdxRef = useRef(0);

  const cycleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const breatheRef = useRef<Animated.CompositeAnimation | null>(null);
  const fadeRef = useRef<Animated.CompositeAnimation | null>(null);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const stopAll = () => {
    if (cycleTimeoutRef.current) {
      clearTimeout(cycleTimeoutRef.current);
      cycleTimeoutRef.current = null;
    }
    if (breatheRef.current) {
      breatheRef.current.stop();
      breatheRef.current = null;
    }
    if (fadeRef.current) {
      fadeRef.current.stop();
      fadeRef.current = null;
    }
  };

  const resetImages = () => {
    activeIdxRef.current = 0;
    opacities[0].setValue(1);
    opacities[1].setValue(0);
    opacities[2].setValue(0);
  };

  const startBreathe = () => {
    imageScale.setValue(1);
    breatheRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(imageScale, {
          toValue: 1.016,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(imageScale, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    breatheRef.current.start();
  };

  // Cross-fade from the current active image to the next one, then schedule
  // the following transition. Uses recursive setTimeout so there is never
  // an interval firing mid-animation.
  const scheduleCycle = () => {
    cycleTimeoutRef.current = setTimeout(() => {
      const from = activeIdxRef.current;
      const to = (from + 1) % IMAGES.length;

      // Animate: fade next in, fade current out simultaneously.
      fadeRef.current = Animated.parallel([
        Animated.timing(opacities[to], {
          toValue: 1,
          duration: FADE_DURATION,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacities[from], {
          toValue: 0,
          duration: FADE_DURATION,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]);

      fadeRef.current.start(({ finished }) => {
        if (!finished) return; // interrupted — don't schedule next
        activeIdxRef.current = to;
        // Schedule the next crossfade only after the current one fully settles
        scheduleCycle();
      });
    }, HOLD_DURATION);
  };

  // ── Entrance sequence + image loop ────────────────────────────────────────
  useEffect(() => {
    if (!isActive) {
      stopAll();
      imageScale.setValue(1);
      resetImages();
      eyebrowAnim.setValue(0);
      headline1Anim.setValue(0);
      headline2Anim.setValue(0);
      frameAnim.setValue(0);
      trustAnim.setValue(0);
      return;
    }

    // Reset everything before starting fresh
    stopAll();
    resetImages();
    eyebrowAnim.setValue(0);
    headline1Anim.setValue(0);
    headline2Anim.setValue(0);
    frameAnim.setValue(0);
    trustAnim.setValue(0);
    imageScale.setValue(1);

    const introAnimation = Animated.sequence([
      Animated.spring(eyebrowAnim, {
        toValue: 1,
        tension: 60,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.delay(40),
      Animated.spring(headline1Anim, {
        toValue: 1,
        tension: 52,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.delay(30),
      Animated.spring(headline2Anim, {
        toValue: 1,
        tension: 52,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.delay(30),
      Animated.spring(frameAnim, {
        toValue: 1,
        tension: 42,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.delay(220),
      Animated.timing(trustAnim, {
        toValue: 1,
        duration: 360,
        useNativeDriver: true,
      }),
    ]);

    introAnimation.start(({ finished }) => {
      if (!finished) return;
      startBreathe();
      // Start image cycle immediately on the same frame the entrance ends —
      // no state bridge, no render gap.
      scheduleCycle();
    });

    return () => {
      introAnimation.stop();
    };
  }, [isActive]);

  // ── Render ─────────────────────────────────────────────────────────────────
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

      <FloatingOrb
        size={200}
        top={50}
        left={SW * 0.55}
        color={COLORS.primary}
        delay={0}
        amplitude={16}
      />
      <FloatingOrb
        size={130}
        top={SH * 0.3}
        left={-45}
        color={COLORS.primary}
        delay={2}
        amplitude={22}
      />
      <FloatingOrb
        size={80}
        top={SH * 0.65}
        left={SW * 0.74}
        color={COLORS.primary}
        delay={1}
        amplitude={12}
      />

      <View style={s.content}>
        {/* Eyebrow */}
        <Animated.View
          style={[
            s.eyebrowWrap,
            {
              opacity: eyebrowAnim,
              transform: [
                {
                  translateY: eyebrowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={s.eyebrowPill}>
            <View style={s.eyebrowDot} />
            <Text style={s.eyebrowText}>ORCA · CALORIE TRACKER</Text>
          </View>
        </Animated.View>

        {/* Headline */}
        <View style={s.headlineBlock}>
          <Animated.Text
            style={[
              s.headlineLine,
              {
                opacity: headline1Anim,
                transform: [
                  {
                    translateY: headline1Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            Scan every meal,
          </Animated.Text>
          <Animated.Text
            style={[
              s.headlineLine,
              s.headlineAccent,
              {
                opacity: headline2Anim,
                transform: [
                  {
                    translateY: headline2Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            effortlessly.
          </Animated.Text>
        </View>

        {/* Image frame — all three images are always mounted, only opacity changes */}
        <Animated.View
          style={[
            s.frameOuter,
            {
              opacity: frameAnim,
              transform: [
                {
                  translateY: frameAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [32, 0],
                  }),
                },
                { scale: imageScale },
              ],
            },
          ]}
        >
          <View style={s.glowHalo} />

          <View style={s.imageWrap}>
            {IMAGES.map((src, idx) => (
              <Animated.Image
                key={idx}
                source={src}
                resizeMode="contain"
                style={[
                  s.image,
                  // First image is the base layer; subsequent images stack on top
                  idx > 0 && s.imageOverlay,
                  { opacity: opacities[idx] },
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const IMAGE_H = SH * 0.52;

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.backgroundGradientTop,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },

  eyebrowWrap: {
    marginBottom: SPACING.sm,
  },
  eyebrowPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primary,
    opacity: 0.9,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  eyebrowDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#FFFFFF",
    opacity: 0.85,
  },
  eyebrowText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#FFFFFF",
    textTransform: "uppercase",
  },

  headlineBlock: {
    alignItems: "center",
    marginBottom: SPACING.xs ?? 6,
  },
  headlineLine: {
    fontSize: 34,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -1,
    lineHeight: 44,
    textAlign: "center",
  },
  headlineAccent: {
    color: COLORS.primary,
  },

  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textSecondary,
    textAlign: "center",
    letterSpacing: 0.1,
    lineHeight: 20,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },

  frameOuter: {
    width: SW * 0.88,
    height: IMAGE_H,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
  },
  glowHalo: {
    position: "absolute",
    width: SW * 0.7,
    height: IMAGE_H * 0.65,
    borderRadius: SW * 0.35,
    backgroundColor: COLORS.primary,
    opacity: 0.07,
    transform: [{ scaleX: 1.08 }, { scaleY: 0.8 }],
  },
  imageWrap: {
    width: "100%",
    height: "115%",
  },
  image: {
    width: "100%",
    height: "115%",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
