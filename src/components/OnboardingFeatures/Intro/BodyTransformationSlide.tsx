import { COLORS, SPACING } from "@/src/Screens/Onboarding/Onboarding.style";
import { Ionicons } from "@expo/vector-icons";
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

//  3 transformation stages ─
const STAGES = [
  {
    image: require("@/assets/images/Onboarding/trans1.png"),
    label: "Start",
    color: "#EF4444",
    tint: "#FEE2E2",
  },
  {
    image: require("@/assets/images/Onboarding/trans2.png"),
    label: "Progress",
    color: "#F59E0B",
    tint: "#FEF3C7",
  },
  {
    image: require("@/assets/images/Onboarding/trans3.png"),
    label: "Goal",
    color: "#10B981",
    tint: "#D1FAE5",
  },
] as const;

//  Layout math
const H_PADDING = SPACING.lg * 2;
const ARROW_SIZE = 28;
const GAP = 8;
const CARD_W = Math.floor(SW - H_PADDING - ARROW_SIZE * 9 - GAP * 4);
const CARD_H = Math.round(CARD_W * 3.5);

//  Floating ambient orb — matches AppIntro exactly
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

//  Stage card ─
const StageCard: React.FC<{
  image: any;
  label: string;
  color: string;
  tint: string;
  anim: Animated.Value;
  isGoal?: boolean;
}> = ({ image, label, color, tint, anim, isGoal }) => (
  <Animated.View
    style={[
      s.stageWrap,
      {
        opacity: anim,
        transform: [
          {
            translateX: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [36, 0],
            }),
          },
          {
            scale: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.92, 1],
            }),
          },
        ],
      },
    ]}
  >
    {/* Card frame — Goal card gets a subtle primary glow to celebrate it */}
    <View style={[s.imageCard, isGoal && s.imageCardGoal]}>
      {isGoal && <View style={s.goalGlow} />}
      <Image source={image} style={s.bodyImage} resizeMode="cover" />
    </View>

    {/* Color-coded label pill */}
    <View style={[s.labelPill, { backgroundColor: tint }]}>
      <View style={[s.labelDot, { backgroundColor: color }]} />
      <Text style={[s.labelText, { color }]}>{label}</Text>
    </View>
  </Animated.View>
);

//  Arrow between cards ──
const Arrow: React.FC<{ anim: Animated.Value }> = ({ anim }) => (
  <Animated.View
    style={[
      s.arrowWrap,
      {
        opacity: anim,
        transform: [
          {
            scale: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.4, 1],
            }),
          },
        ],
      },
    ]}
  >
    <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
  </Animated.View>
);

//  Animated text helper — same as AppIntro
const FadeSlideText: React.FC<{
  anim: Animated.Value;
  style: object;
  children: React.ReactNode;
}> = ({ anim, style, children }) => (
  <Animated.Text
    style={[
      style,
      {
        opacity: anim,
        transform: [
          {
            translateY: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          },
        ],
      },
    ]}
  >
    {children}
  </Animated.Text>
);

//  Spring / timing helpers ─
const springTo = (
  anim: Animated.Value,
  tension = 50,
  friction = 8,
): Animated.CompositeAnimation =>
  Animated.spring(anim, {
    toValue: 1,
    tension,
    friction,
    useNativeDriver: true,
  });

const timingTo = (
  anim: Animated.Value,
  duration = 300,
): Animated.CompositeAnimation =>
  Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true });

//  Props
interface BodyTransformationSlideProps {
  isActive?: boolean;
}

//  Main component
export const BodyTransformationSlide: React.FC<
  BodyTransformationSlideProps
> = ({ isActive = true }) => {
  // Text anims
  const eyebrowAnim = useRef(new Animated.Value(0)).current;
  const headline1Anim = useRef(new Animated.Value(0)).current;
  const headline2Anim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;

  // Card + arrow anims
  const card1Anim = useRef(new Animated.Value(0)).current;
  const arrow1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const arrow2Anim = useRef(new Animated.Value(0)).current;
  const card3Anim = useRef(new Animated.Value(0)).current;

  // Trust line
  const trustAnim = useRef(new Animated.Value(0)).current;

  // Breathing scale on the entire cards row after entrance
  const rowScale = useRef(new Animated.Value(1)).current;
  const breatheRef = useRef<Animated.CompositeAnimation | null>(null);

  const startBreathe = () => {
    breatheRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(rowScale, {
          toValue: 1.012,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(rowScale, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    breatheRef.current.start();
  };

  useEffect(() => {
    if (!isActive) {
      // Reset everything so animation replays when slide re-enters
      if (breatheRef.current) breatheRef.current.stop();
      [
        eyebrowAnim,
        headline1Anim,
        headline2Anim,
        subtitleAnim,
        card1Anim,
        arrow1Anim,
        card2Anim,
        arrow2Anim,
        card3Anim,
        trustAnim,
      ].forEach((a) => a.setValue(0));
      rowScale.setValue(1);
      return;
    }

    // Full sequential entrance — mirrors AppIntro's ordering exactly:
    // eyebrow → headline1 → headline2 → subtitle → card1 → arrow1
    //         → card2 → arrow2 → card3 → trust
    Animated.sequence([
      // 1. Eyebrow pill
      springTo(eyebrowAnim, 60, 9),
      Animated.delay(40),
      // 2. Headline line 1
      springTo(headline1Anim, 52, 8),
      Animated.delay(30),
      // 3. Headline line 2 (accent color)
      springTo(headline2Anim, 52, 8),
      Animated.delay(30),
      // 4. Subtitle
      timingTo(subtitleAnim, 300),
      Animated.delay(110),
      // 5. Card 1 — Start
      springTo(card1Anim, 48, 8),
      Animated.delay(40),
      // 6. Arrow 1
      timingTo(arrow1Anim, 200),
      Animated.delay(20),
      // 7. Card 2 — Progress
      springTo(card2Anim, 48, 8),
      Animated.delay(40),
      // 8. Arrow 2
      timingTo(arrow2Anim, 200),
      Animated.delay(20),
      // 9. Card 3 — Goal (most satisfying, last)
      springTo(card3Anim, 48, 8),
      Animated.delay(220),
      // 10. Trust line
      timingTo(trustAnim, 360),
    ]).start(() => startBreathe());
  }, [isActive]);

  return (
    <View style={s.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.backgroundGradientTop}
      />

      {/*  Single seamless gradient — no secondary overlays  */}
      <LinearGradient
        colors={[
          COLORS.backgroundGradientTop,
          COLORS.backgroundGradientMid,
          COLORS.backgroundGradientBottom,
        ]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/*  Ambient orbs — same positions/sizes as AppIntro  */}
      <FloatingOrb
        size={200}
        top={30}
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
        {/*  Eyebrow pill — centered, matches AppIntro  */}
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
            <Text style={s.eyebrowText}>YOUR TRANSFORMATION</Text>
          </View>
        </Animated.View>

        {/*  Headline — two lines, centered, sequential reveal  */}
        <View style={s.headlineBlock}>
          <FadeSlideText anim={headline1Anim} style={s.headlineLine}>
            {"Let's make your goal"}
          </FadeSlideText>
          <FadeSlideText
            anim={headline2Anim}
            style={[s.headlineLine, s.headlineAccent]}
          >
            a reality.
          </FadeSlideText>
        </View>

        {/*  Subtitle — centered, directly under headline  */}
        <FadeSlideText anim={subtitleAnim} style={s.subtitle}>
          {""}
        </FadeSlideText>

        {/*  3 stage cards with arrows — hero section  */}
        <Animated.View
          style={[s.stagesRow, { transform: [{ scale: rowScale }] }]}
        >
          <StageCard
            image={STAGES[0].image}
            label={STAGES[0].label}
            color={STAGES[0].color}
            tint={STAGES[0].tint}
            anim={card1Anim}
          />

          <Arrow anim={arrow1Anim} />

          <StageCard
            image={STAGES[1].image}
            label={STAGES[1].label}
            color={STAGES[1].color}
            tint={STAGES[1].tint}
            anim={card2Anim}
          />

          <Arrow anim={arrow2Anim} />

          <StageCard
            image={STAGES[2].image}
            label={STAGES[2].label}
            color={STAGES[2].color}
            tint={STAGES[2].tint}
            anim={card3Anim}
            isGoal
          />
        </Animated.View>

        {/*  Trust line — same style as AppIntro  */}
        <Animated.View
          style={[
            s.trustRow,
            {
              opacity: trustAnim,
              transform: [
                {
                  translateY: trustAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [8, 0],
                  }),
                },
              ],
            },
          ]}
        ></Animated.View>
      </View>
    </View>
  );
};

//  Styles ──
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

  //  Eyebrow — identical to AppIntro
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

  //  Headline — centered, two-line split ──
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

  //  Subtitle — centered, same as AppIntro
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

  //  Stage cards row ──
  stagesRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    gap: GAP,
    flex: 1, // fills remaining space so cards are as tall as possible
    marginBottom: SPACING.sm,
  },

  stageWrap: {
    alignItems: "center",
    flex: 1, // each card takes equal share of row width
  },

  // Image card — clean, no shadow casting grey
  imageCard: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 16,
    overflow: "hidden",
    // Warm elevation — no dark grey shadow
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  // Goal card gets an extra-warm primary glow
  imageCardGoal: {
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },
  // Very subtle glow overlay on the Goal card — celebrates the achievement
  goalGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#10B981",
    opacity: 0.45,
  },
  bodyImage: {
    width: "100%",
    height: "100%",
  },

  // Label pill — color-coded per stage
  labelPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  labelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  labelText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: -0.1,
  },

  // Arrow — vertically centred to image midpoint
  arrowWrap: {
    width: ARROW_SIZE,
    height: ARROW_SIZE,
    borderRadius: ARROW_SIZE / 2,
    backgroundColor: "#FFF3E8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F0DED0",
    marginTop: CARD_H / 2 - ARROW_SIZE / 2,
  },

  //  Trust line — identical to AppIntro
  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: SPACING.md,
  },
  trustDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    opacity: 0.35,
  },
  trustText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
    letterSpacing: 0.2,
  },
});
