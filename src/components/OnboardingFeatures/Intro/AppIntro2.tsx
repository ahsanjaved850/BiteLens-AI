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
import Svg, { Circle } from "react-native-svg";

const { width: SW, height: SH } = Dimensions.get("window");

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RING_SIZE = SW * 0.62;
const RADIUS = (RING_SIZE - 24) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const INTAKE_CAL = 1942;
const GOAL_CAL = 2000;
const REMAINING = Math.max(0, GOAL_CAL - INTAKE_CAL);
const PROGRESS = Math.min(INTAKE_CAL / GOAL_CAL, 1);

const CalorieRing: React.FC<{ animValue: Animated.Value }> = ({
  animValue,
}) => {
  const strokeDashoffset = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, CIRCUMFERENCE * (1 - PROGRESS)],
  });

  return (
    <Svg width={RING_SIZE} height={RING_SIZE}>
      <Circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RADIUS}
        stroke="#F0DED0"
        strokeWidth={14}
        fill="none"
      />
      <AnimatedCircle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RADIUS}
        stroke={COLORS.primary}
        strokeWidth={14}
        fill="none"
        strokeDasharray={`${CIRCUMFERENCE}`}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        rotation="-90"
        origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
      />
    </Svg>
  );
};

const useCountUp = (target: number, duration: number, resetKey: number) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    setValue(0);
    if (resetKey === 0) return;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [resetKey]);
  return value;
};

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

interface AppIntro2Props {
  isActive?: boolean;
}

export const AppIntro2: React.FC<AppIntro2Props> = ({ isActive = true }) => {
  const [resetKey, setResetKey] = React.useState(0);

  const eyebrowAnim = useRef(new Animated.Value(0)).current;
  const headline1Anim = useRef(new Animated.Value(0)).current;
  const headline2Anim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const noteAnim = useRef(new Animated.Value(0)).current;
  const trustAnim = useRef(new Animated.Value(0)).current;
  const ringAnim = useRef(new Animated.Value(0)).current;

  const displayRemaining = useCountUp(REMAINING, 1200, resetKey);
  const displayIntake = useCountUp(INTAKE_CAL, 1200, resetKey);
  const displayGoal = useCountUp(GOAL_CAL, 1000, resetKey);

  useEffect(() => {
    if (!isActive) {
      setResetKey(0);
      return;
    }

    eyebrowAnim.setValue(0);
    headline1Anim.setValue(0);
    headline2Anim.setValue(0);
    subtitleAnim.setValue(0);
    cardAnim.setValue(0);
    noteAnim.setValue(0);
    trustAnim.setValue(0);
    ringAnim.setValue(0);

    // The entrance sequence runs top to bottom.
    // After cardAnim lands and a short pause, ring + counters fire
    // via a parallel branch — 1.5s before the sequence would otherwise end.
    // noteAnim and trustAnim continue animating in alongside the ring/counters.
    Animated.sequence([
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
      Animated.timing(subtitleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(100),
      Animated.spring(cardAnim, {
        toValue: 1,
        tension: 44,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.delay(80),
      // Card is on screen. Run note + trust in parallel with ring/counters.
      // Ring and counters start here — 1.5s earlier than waiting for the full sequence.
      Animated.parallel([
        Animated.sequence([
          Animated.spring(noteAnim, {
            toValue: 1,
            tension: 48,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.delay(220),
          Animated.timing(trustAnim, {
            toValue: 1,
            duration: 360,
            useNativeDriver: true,
          }),
        ]),
        // Ring fires on JS thread (non-native required for SVG strokeDashoffset)
        Animated.timing(ringAnim, {
          toValue: 1,
          duration: 1400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]),
    ]).start();

    // Counters start at the same moment as the ring.
    // setTimeout matches the delay to reach the Animated.parallel above:
    // eyebrow spring (~400ms) + 40 + h1 spring (~400ms) + 30 + h2 spring (~400ms)
    // + 30 + subtitle 300ms + 100 + card spring (~500ms) + 80 = ~2280ms
    const counterDelay = 2280;
    const counterTimer = setTimeout(() => {
      setResetKey((k) => k + 1);
    }, counterDelay);

    return () => clearTimeout(counterTimer);
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

      <FloatingOrb
        size={200}
        top={20}
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
            <Text style={s.eyebrowText}>CALORIE TRACKER</Text>
          </View>
        </Animated.View>

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
            Stay below your
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
            daily target.
          </Animated.Text>
        </View>

        <Animated.View
          style={[
            s.card,
            {
              opacity: cardAnim,
              transform: [
                {
                  scale: cardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.94, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={s.ringWrap}>
            <CalorieRing animValue={ringAnim} />
            <View style={s.ringCenter}>
              <Text style={s.ringLabel}>You Can Eat</Text>
              <Text style={s.ringValue}>{displayRemaining}</Text>
              <Text style={s.ringUnit}>Cal</Text>
            </View>
          </View>

          <View style={s.divider} />

          <View style={s.statsRow}>
            <View style={s.statItem}>
              <Text style={s.statLabel}>Calorie Intake</Text>
              <Text style={s.statValue}>{displayIntake} Cal</Text>
            </View>
            <View style={s.statSep} />
            <View style={s.statItem}>
              <Text style={s.statLabel}>Goal Calories</Text>
              <Text style={s.statValue}>{displayGoal} Cal</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.backgroundGradientTop,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    alignItems: "center",
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
    marginBottom: 50,
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

  card: {
    backgroundColor: "#FFFAF6",
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: "#F0DED0",
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: "center",
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    marginBottom: SPACING.lg,
    width: "100%",
  },

  ringWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
  },
  ringCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  ringLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  ringValue: {
    fontSize: 52,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -2,
    lineHeight: 58,
  },
  ringUnit: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#F0DED0",
    marginBottom: SPACING.lg,
  },
  statsRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  statSep: {
    width: 1,
    height: 36,
    backgroundColor: "#F0DED0",
  },

  noteCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFAF6",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#F0DED0",
    padding: SPACING.md,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
    width: "100%",
    marginBottom: SPACING.md,
  },
  noteTextWrap: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  noteText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark,
    lineHeight: 22,
  },
  noteHighlight: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  noteEmoji: {
    fontSize: 44,
  },

  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
