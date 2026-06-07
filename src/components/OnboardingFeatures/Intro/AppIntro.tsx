import { COLORS, SPACING } from "@/src/Screens/Onboarding/Onboarding.style";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
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

const SLIDE_DURATION = 1000;
const FADE_DURATION = 250;

//  Floating ambient orb
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

//  Props
interface AppIntroProps {
  isActive?: boolean;
}

//  Main component
export const AppIntro: React.FC<AppIntroProps> = ({ isActive = true }) => {
  // Entrance anims — each element fires separately
  const eyebrowAnim = useRef(new Animated.Value(0)).current;
  const headline1Anim = useRef(new Animated.Value(0)).current;
  const headline2Anim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const frameAnim = useRef(new Animated.Value(0)).current;
  const trustAnim = useRef(new Animated.Value(0)).current;

  // Image crossfade
  const currentOpacity = useRef(new Animated.Value(1)).current;
  const nextOpacity = useRef(new Animated.Value(0)).current;
  // Subtle breathing scale on the image
  const imageScale = useRef(new Animated.Value(1)).current;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [nextIdx, setNextIdx] = useState(1);
  const [showNext, setShowNext] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breatheRef = useRef<Animated.CompositeAnimation | null>(null);

  //  Breathing scale loop
  const startBreathe = () => {
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

  //  Entrance sequence
  useEffect(() => {
    if (!isActive) return;

    // Reset all
    eyebrowAnim.setValue(0);
    headline1Anim.setValue(0);
    headline2Anim.setValue(0);
    subtitleAnim.setValue(0);
    frameAnim.setValue(0);
    trustAnim.setValue(0);

    Animated.sequence([
      // 1. Eyebrow tag
      Animated.spring(eyebrowAnim, {
        toValue: 1,
        tension: 60,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.delay(40),
      // 2. First headline line
      Animated.spring(headline1Anim, {
        toValue: 1,
        tension: 52,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.delay(30),
      // 3. Second headline line (accent)
      Animated.spring(headline2Anim, {
        toValue: 1,
        tension: 52,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.delay(30),
      // 4. Subtitle
      Animated.timing(subtitleAnim, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.delay(100),
      // 5. Image frame rises in
      Animated.spring(frameAnim, {
        toValue: 1,
        tension: 42,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.delay(220),
      // 6. Trust line last
      Animated.timing(trustAnim, {
        toValue: 1,
        duration: 360,
        useNativeDriver: true,
      }),
    ]).start(() => startBreathe());
  }, [isActive]);

  //  Crossfade image cycle
  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (breatheRef.current) breatheRef.current.stop();
      currentOpacity.setValue(1);
      nextOpacity.setValue(0);
      imageScale.setValue(1);
      setCurrentIdx(0);
      setNextIdx(1);
      setShowNext(false);
      return;
    }

    let step = 0;
    const totalSteps = IMAGES.length - 1;

    const cycle = () => {
      step++;
      setNextIdx((cur) => (cur + 1) % IMAGES.length);
      setShowNext(true);
      nextOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(nextOpacity, {
          toValue: 1,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(currentOpacity, {
          toValue: 0,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentIdx((cur) => (cur + 1) % IMAGES.length);
        currentOpacity.setValue(1);
        nextOpacity.setValue(0);
        setShowNext(false);

        if (step >= totalSteps && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      });
    };

    intervalRef.current = setInterval(cycle, SLIDE_DURATION);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  return (
    <View style={s.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.backgroundGradientTop}
      />

      {/*  Single seamless background gradient matching the app flow  */}
      <LinearGradient
        colors={[
          COLORS.backgroundGradientTop,
          COLORS.backgroundGradientMid,
          COLORS.backgroundGradientBottom,
        ]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/*  Ambient orbs — warmth & depth, never distracting  */}
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
        {/*  Eyebrow — centered brand tag  */}
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

        {/*  Headline — two lines, centered, reveal one by one  */}
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

        {/*  Image frame — hero element, maximum presence  */}
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
          {/* Soft primary-color glow behind image — no harsh shadow */}
          <View style={s.glowHalo} />

          {/* Clean image container — no bottom gradient cutting it off */}
          <View style={s.imageWrap}>
            <Animated.Image
              source={IMAGES[currentIdx]}
              resizeMode="contain"
              style={[s.image, { opacity: currentOpacity }]}
            />
            {showNext && (
              <Animated.Image
                source={IMAGES[nextIdx]}
                resizeMode="contain"
                style={[s.image, s.imageOverlay, { opacity: nextOpacity }]}
              />
            )}
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

//  Styles
// Image occupies most of the lower screen — it's the hero
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

  //  Eyebrow — centered pill tag
  eyebrowWrap: {
    marginBottom: SPACING.sm,
  },
  eyebrowPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primary,
    // ~10% opacity background — uses the pill approach instead of a bar
    // so it reads clearly centered without needing left-alignment
    opacity: 0.9,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    // Slight transparency so gradient shows through
    // Override opacity per-child so text stays fully opaque
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

  //  Headline — centered, bold, two-line reveal
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

  //  Subtitle — centered, directly under headline
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

  //  Image frame
  frameOuter: {
    width: SW * 0.88, // wider — hero deserves the space
    height: IMAGE_H, // taller — SH * 0.52 vs previous 0.46
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
  },
  // Glow uses primary color at very low opacity — warm, not shadowy
  glowHalo: {
    position: "absolute",
    width: SW * 0.7,
    height: IMAGE_H * 0.65,
    borderRadius: SW * 0.35,
    backgroundColor: COLORS.primary,
    opacity: 0.07, // subtle warmth, not a dark shadow
    transform: [{ scaleX: 1.08 }, { scaleY: 0.8 }],
  },
  imageWrap: {
    width: "100%",
    height: "115%",
    // No overflow hidden — lets the image breathe naturally
    // No borderRadius cutting the screenshot
    // No bottom LinearGradient — removed per request
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
