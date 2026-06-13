import { COLORS, SPACING } from "@/src/Screens/Onboarding/Onboarding.style";
import { getSelectedBirthYear } from "@/src/components/OnboardingFeatures/GoalInfo/BirthYearPicker";
import { getGlobalCurrentWeight } from "@/src/components/OnboardingFeatures/GoalInfo/CurrentWeight";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

let Haptics: typeof import("expo-haptics") | null = null;
try {
  Haptics = require("expo-haptics");
} catch {
  Haptics = null;
}
const tapHaptic = () => {
  try {
    Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {}
};
const softHaptic = () => {
  try {
    Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {}
};
const successHaptic = () => {
  try {
    Haptics?.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {}
};

const { width: SW, height: SH } = Dimensions.get("window");
const ACCENT_GRADIENT = ["#FF9A4D", COLORS.primary, "#C45E0A"] as const;

const ICONS: Partial<Record<string, ImageSourcePropType>> = {
  calories: require("@/assets/images/icons/calories.png"),
  macros: require("@/assets/images/icons/macros.png"),
  bmi: require("@/assets/images/icons/bmi.png"),
  lock: require("@/assets/images/icons/lock.png"),
  check: require("@/assets/images/icons/check.png"),
  trophy: require("@/assets/images/icons/achieve1.png"),
};

const AppIcon: React.FC<{ name: string; size: number }> = ({ name, size }) => {
  const src = ICONS[name];
  if (src) {
    return (
      <Image
        source={src}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    );
  }
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.32 }} />
  );
};

type CompletionProps = {
  isActive?: boolean;
  startAnimation?: boolean;
  onAnimationComplete?: () => void;
  isSubmitting?: boolean;
  onUnlockPress?: () => void;
};

const PARTICLE_COLORS = [
  "#F47B20",
  "#FFB347",
  "#FF6B6B",
  "#C084FC",
  "#FFE0C2",
  "#60A5FA",
  "#D96A12",
  "#F472B6",
];
const CONFETTI_SHAPES = ["strip", "square", "circle"] as const;
type ConfettiShape = (typeof CONFETTI_SHAPES)[number];
const MUTED_LOCK = "rgba(168,150,135,0.75)";
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const maskFor = (target: number, decimals = 0) => {
  if (decimals > 0) return "••••";
  return "•".repeat(Math.max(1, String(Math.round(target)).length));
};

// ─── TDEE / Macro calculator ─────────────────────────────────────────────────
function calculatePlan(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: string,
  goal: string,
) {
  let bmr: number;
  if (gender === "Female")
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  else bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  const tdee = Math.round(bmr * 1.55);
  let targetCal =
    goal === "Lose"
      ? Math.round(tdee - 500)
      : goal === "Gain"
        ? Math.round(tdee + 350)
        : tdee;
  const proteinG = Math.round(weightKg * 1.8);
  const fatG = Math.round((targetCal * 0.25) / 9);
  const carbG = Math.round((targetCal - proteinG * 4 - fatG * 9) / 4);
  const bmi = parseFloat((weightKg / (heightCm / 100) ** 2).toFixed(1));
  const bmiCategory =
    bmi < 18.5
      ? "Underweight"
      : bmi < 25
        ? "Normal"
        : bmi < 30
          ? "Overweight"
          : "Obese";
  const waterL = parseFloat((weightKg * 0.033).toFixed(1));
  return {
    calories: Math.max(targetCal, 1200),
    protein: proteinG,
    carbs: Math.max(carbG, 50),
    fat: fatG,
    bmi,
    bmiCategory,
    waterL,
  };
}
const bmiColorFor = (cat: string) =>
  cat === "Normal"
    ? "#2ECC71"
    : cat === "Overweight"
      ? "#F5A623"
      : cat === "Obese"
        ? "#FF4757"
        : "#2196F3";

// ─── PHASE 1: Loading screen ──────────────────────────────────────────────────
const STEPS = [
  "Analyzing profile",
  "Calculating metabolism",
  "Generating meal plan",
  "Checking healthy condition",
] as const;

// Each bar fills over this many ms, with a gap between steps
const BAR_FILL_MS = 1100;
const BAR_GAP_MS = 340;
const RING_SIZE = 132;

const LoadingScreen: React.FC<{
  isActive: boolean;
  onComplete: () => void;
}> = ({ isActive, onComplete }) => {
  const titleAnim = useRef(new Animated.Value(0)).current;
  const ringIn = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;
  const masterProgress = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;
  const stepsAnim = useRef(STEPS.map(() => new Animated.Value(0))).current;
  const barAnims = useRef(STEPS.map(() => new Animated.Value(0))).current;
  const checkAnims = useRef(STEPS.map(() => new Animated.Value(0))).current;
  const [doneFlags, setDoneFlags] = useState<boolean[]>(STEPS.map(() => false));
  const [activeIndex, setActiveIndex] = useState(-1);
  const [percent, setPercent] = useState(0);
  // Guard: the FlatList mounts this slide off-screen — only run once, when active
  const startedRef = useRef(false);

  useEffect(() => {
    const id = masterProgress.addListener(({ value }) =>
      setPercent(Math.min(100, Math.round(value * 100))),
    );
    return () => masterProgress.removeListener(id);
  }, []);

  useEffect(() => {
    if (!isActive || startedRef.current) return;
    startedRef.current = true;

    // Ambient loops — spinning arc, breathing glow, bar shimmer
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 2200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0,
          duration: 1300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(180),
      ]),
    ).start();

    const run = async () => {
      // 1. Ring + title entrance
      await new Promise<void>((res) => {
        Animated.parallel([
          Animated.spring(ringIn, {
            toValue: 1,
            tension: 45,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(titleAnim, {
            toValue: 1,
            tension: 55,
            friction: 9,
            delay: 120,
            useNativeDriver: true,
          }),
        ]).start(() => res());
      });

      // 2. Each step: row in → bar fills (% counter rides along) → check pops
      for (let i = 0; i < STEPS.length; i++) {
        setActiveIndex(i);
        await new Promise<void>((res) => {
          Animated.spring(stepsAnim[i], {
            toValue: 1,
            tension: 60,
            friction: 9,
            useNativeDriver: true,
          }).start(() => res());
        });

        await new Promise<void>((res) => {
          Animated.parallel([
            Animated.timing(barAnims[i], {
              toValue: 1,
              duration: BAR_FILL_MS,
              easing: Easing.inOut(Easing.cubic),
              useNativeDriver: false, // width % can't use native driver
            }),
            Animated.timing(masterProgress, {
              toValue: (i + 1) / STEPS.length,
              duration: BAR_FILL_MS,
              easing: Easing.inOut(Easing.cubic),
              useNativeDriver: false,
            }),
          ]).start(() => res());
        });

        setDoneFlags((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
        await new Promise<void>((res) => {
          Animated.spring(checkAnims[i], {
            toValue: 1,
            tension: 80,
            friction: 6,
            useNativeDriver: true,
          }).start(() => res());
        });

        softHaptic();
        if (i < STEPS.length - 1) await wait(BAR_GAP_MS);
      }

      setActiveIndex(-1);
      await wait(500);
      successHaptic();
      onComplete();
    };
    run();
  }, [isActive]);

  const spinDeg = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={ls.root}>
      <LinearGradient
        colors={[
          COLORS.backgroundGradientTop,
          COLORS.backgroundGradientMid,
          COLORS.backgroundGradientBottom,
        ]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={ls.inner}>
        {/* Progress ring hero */}
        <Animated.View
          style={[
            ls.heroWrap,
            {
              opacity: ringIn,
              transform: [
                {
                  scale: ringIn.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              ls.heroGlow,
              {
                opacity: glowPulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.35, 0.85],
                }),
                transform: [
                  {
                    scale: glowPulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1.12],
                    }),
                  },
                ],
              },
            ]}
          />
          <View style={ls.ringTrack} />
          <Animated.View
            style={[ls.ringArc, { transform: [{ rotate: spinDeg }] }]}
          />
          <View style={ls.ringCenter}>
            <Text style={ls.percentText}>
              {percent}
              <Text style={ls.percentSign}>%</Text>
            </Text>
            <Text style={ls.percentLabel}>PERSONALIZING</Text>
          </View>
        </Animated.View>

        <Animated.Text
          style={[
            ls.title,
            {
              opacity: titleAnim,
              transform: [
                {
                  translateY: titleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                  }),
                },
              ],
            },
          ]}
        >
          Tailoring Your{"\n"}
          <Text style={ls.titleAccent}>Program</Text>
        </Animated.Text>

        <View style={ls.stepsWrap}>
          {STEPS.map((label, i) => (
            <Animated.View
              key={i}
              style={[
                ls.stepRow,
                {
                  opacity: stepsAnim[i],
                  transform: [
                    {
                      translateX: stepsAnim[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {/* Label + checkmark row */}
              <View style={ls.stepHeader}>
                <Text
                  style={[
                    ls.stepLabel,
                    i === activeIndex && ls.stepLabelActive,
                  ]}
                >
                  {label}
                </Text>
                <Animated.View
                  style={[
                    ls.checkCircle,
                    doneFlags[i] && ls.checkCircleDone,
                    {
                      opacity: checkAnims[i],
                      transform: [
                        {
                          scale: checkAnims[i].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.4, 1],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Text style={ls.checkMark}>✓</Text>
                </Animated.View>
              </View>

              {/* Progress bar */}
              <View style={ls.barTrack}>
                <Animated.View
                  style={[
                    ls.barFill,
                    {
                      width: barAnims[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                />
                {i === activeIndex && (
                  <Animated.View
                    style={[
                      ls.barShimmer,
                      {
                        transform: [
                          {
                            translateX: shimmer.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-90, SW],
                            }),
                          },
                          { skewX: "-20deg" },
                        ],
                      },
                    ]}
                  />
                )}
              </View>
            </Animated.View>
          ))}
        </View>
      </View>
    </View>
  );
};

const ls = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.backgroundGradientTop },
  inner: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: "center",
    paddingBottom: SPACING.xl,
  },
  heroWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg + 4,
  },
  heroGlow: {
    position: "absolute",
    width: RING_SIZE + 46,
    height: RING_SIZE + 46,
    borderRadius: (RING_SIZE + 46) / 2,
    backgroundColor: "rgba(244,123,32,0.12)",
  },
  ringTrack: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RING_SIZE / 2,
    borderWidth: 5,
    borderColor: "rgba(244,123,32,0.14)",
  },
  ringArc: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RING_SIZE / 2,
    borderWidth: 5,
    borderTopColor: COLORS.primary,
    borderRightColor: "rgba(244, 124, 32, 0.31)",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
  },
  ringCenter: { alignItems: "center", justifyContent: "center" },
  percentText: {
    fontSize: 34,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -1.2,
  },
  percentSign: { fontSize: 18, fontWeight: "800", color: COLORS.primary },
  percentLabel: {
    fontSize: 8.5,
    fontWeight: "700",
    color: COLORS.textSecondary,
    letterSpacing: 1.6,
    marginTop: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -1,
    lineHeight: 41,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  titleAccent: { color: COLORS.primary },
  stepsWrap: { gap: SPACING.lg },
  stepRow: {},
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textSecondary,
    letterSpacing: -0.3,
  },
  stepLabelActive: { color: COLORS.textDark },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(244,123,32,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircleDone: {
    backgroundColor: COLORS.primary,
  },
  checkMark: { fontSize: 13, color: COLORS.white, fontWeight: "800" },
  barTrack: {
    height: 7,
    borderRadius: 4,
    backgroundColor: "rgba(244,123,32,0.12)",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  barShimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 60,
    backgroundColor: "rgba(255,255,255,0.45)",
  },
});

// ─── Confetti (reused in ready screen entry) ──────────────────────────────────
const ConfettiPiece: React.FC<{
  mode: "burst" | "fall";
  shape: ConfettiShape;
  color: string;
  size: number;
  delay: number;
  duration: number;
  angle?: number;
  distance?: number;
  startX?: number;
  sway?: number;
  spin?: number;
}> = ({
  mode,
  shape,
  color,
  size,
  delay,
  duration,
  angle = 0,
  distance = 0,
  startX = 0,
  sway = 0,
  spin = 720,
}) => {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, {
      toValue: 1,
      duration,
      delay,
      easing: mode === "fall" ? Easing.linear : Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const shapeStyle =
    shape === "strip"
      ? { width: size * 0.5, height: size * 1.4, borderRadius: 2 }
      : shape === "square"
        ? { width: size, height: size, borderRadius: 2 }
        : { width: size, height: size, borderRadius: size / 2 };

  if (mode === "burst") {
    const radv = (angle * Math.PI) / 180;
    const endX = Math.cos(radv) * distance;
    const endY = Math.sin(radv) * distance + 140;
    return (
      <Animated.View
        style={{
          position: "absolute",
          backgroundColor: color,
          ...shapeStyle,
          opacity: a.interpolate({
            inputRange: [0, 0.15, 0.75, 1],
            outputRange: [0, 1, 1, 0],
          }),
          transform: [
            {
              translateX: a.interpolate({
                inputRange: [0, 1],
                outputRange: [0, endX],
              }),
            },
            {
              translateY: a.interpolate({
                inputRange: [0, 0.55, 1],
                outputRange: [0, Math.sin(radv) * distance, endY],
              }),
            },
            {
              rotate: a.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", `${spin}deg`],
              }),
            },
            {
              scale: a.interpolate({
                inputRange: [0, 0.35, 1],
                outputRange: [0.2, 1.1, 0.7],
              }),
            },
          ],
        }}
      />
    );
  }

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: startX,
        backgroundColor: color,
        ...shapeStyle,
        opacity: a.interpolate({
          inputRange: [0, 0.08, 0.85, 1],
          outputRange: [0, 1, 1, 0],
        }),
        transform: [
          {
            translateY: a.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, SH + 80],
            }),
          },
          {
            translateX: a.interpolate({
              inputRange: [0, 0.25, 0.5, 0.75, 1],
              outputRange: [0, sway, -sway, sway * 0.6, 0],
            }),
          },
          {
            rotate: a.interpolate({
              inputRange: [0, 1],
              outputRange: ["0deg", `${spin}deg`],
            }),
          },
        ],
      }}
    />
  );
};

// ─── Confetti overlay — 2s burst that auto-removes ────────────────────────────
const ReadyConfetti: React.FC = () => {
  const pieces = useMemo(
    () =>
      Array.from({ length: 55 }).map((_, i) => ({
        startX: rand(0, SW),
        size: rand(8, 14),
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        shape: CONFETTI_SHAPES[i % CONFETTI_SHAPES.length],
        delay: rand(0, 400),
        duration: rand(1400, 2200),
        sway: rand(20, 55),
        spin: rand(360, 1080) * (i % 2 ? 1 : -1),
      })),
    [],
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((p, i) => (
        <ConfettiPiece key={i} mode="fall" {...p} />
      ))}
    </View>
  );
};

// ─── useCountUp ───────────────────────────────────────────────────────────────
function useCountUp(
  target: number,
  countDuration = 1200,
  startDelay = 0,
  decimals = 0,
): { display: string; locked: boolean } {
  const [display, setDisplay] = useState("0");
  const [locked, setLocked] = useState(false);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  useEffect(() => {
    const timeout = setTimeout(() => {
      startRef.current = null;
      const tick = (now: number) => {
        if (startRef.current === null) startRef.current = now;
        const elapsed = now - startRef.current;
        const progress = Math.min(elapsed / countDuration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(
          decimals > 0
            ? (eased * target).toFixed(decimals)
            : Math.round(eased * target).toString(),
        );
        if (progress < 1) rafRef.current = requestAnimationFrame(tick);
        else setTimeout(() => setLocked(true), 350);
      };
      rafRef.current = requestAnimationFrame(tick);
    }, startDelay);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, [target, countDuration, startDelay, decimals]);
  return { display, locked };
}

// ─── LockedValue ──────────────────────────────────────────────────────────────
const LockedValue: React.FC<{
  target: number;
  suffix?: string;
  countDuration?: number;
  startDelay?: number;
  decimals?: number;
  style: object;
  unitStyle?: object;
  lockTint?: string;
}> = ({
  target,
  suffix = "",
  countDuration = 1200,
  startDelay = 0,
  decimals = 0,
  style,
  unitStyle,
  lockTint = "rgba(0,0,0,0.18)",
}) => {
  const { display, locked } = useCountUp(
    target,
    countDuration,
    startDelay,
    decimals,
  );
  const lockAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (locked)
      Animated.spring(lockAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }).start();
  }, [locked]);

  if (locked) {
    return (
      <Animated.View
        style={{
          opacity: lockAnim,
          transform: [
            {
              scale: lockAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        }}
      >
        <View style={[sharedStyles.lockChip, { backgroundColor: lockTint }]}>
          <Text style={[style, sharedStyles.lockMask]}>
            {maskFor(target, decimals)}
          </Text>
          {suffix ? <Text style={unitStyle ?? style}>{suffix}</Text> : null}
        </View>
      </Animated.View>
    );
  }
  return (
    <Text style={style}>
      {display}
      {suffix ? <Text style={unitStyle ?? style}>{suffix}</Text> : null}
    </Text>
  );
};

// ─── LockedMacroCard ──────────────────────────────────────────────────────────
const LockedMacroCard: React.FC<{
  label: string;
  value: number;
  unit: string;
  color: string;
  delay: number;
}> = ({ label, value, unit, color, delay }) => {
  const { display, locked } = useCountUp(value, 900, delay + 200);
  const entranceAnim = useRef(new Animated.Value(0)).current;
  const lockAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(entranceAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);
  useEffect(() => {
    if (locked)
      Animated.spring(lockAnim, {
        toValue: 1,
        tension: 55,
        friction: 9,
        useNativeDriver: true,
      }).start();
  }, [locked]);

  return (
    <Animated.View
      style={[
        macroStyles.card,
        {
          opacity: entranceAnim,
          transform: [
            {
              translateY: entranceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [24, 0],
              }),
            },
            {
              scale: entranceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.92, 1],
              }),
            },
          ],
        },
      ]}
    >
      <View style={[macroStyles.ring, { borderColor: color }]}>
        <View style={[macroStyles.ringCore, { backgroundColor: color }]} />
      </View>
      {locked ? (
        <Animated.View
          style={{
            opacity: lockAnim,
            transform: [
              {
                scale: lockAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.82, 1],
                }),
              },
            ],
          }}
        >
          <Text style={[macroStyles.value, macroStyles.valueLocked]}>
            {maskFor(value)}
            <Text style={macroStyles.unitLocked}>{unit}</Text>
          </Text>
        </Animated.View>
      ) : (
        <Text style={macroStyles.value}>
          {display}
          <Text style={macroStyles.unit}>{unit}</Text>
        </Text>
      )}
      <Text style={macroStyles.label}>{label}</Text>
    </Animated.View>
  );
};

const macroStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 22,
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.sm,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(244,123,32,0.12)",
    overflow: "hidden",
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  ring: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2.5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  ringCore: { width: 7, height: 7, borderRadius: 3.5 },
  value: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  valueLocked: { color: MUTED_LOCK, letterSpacing: 2 },
  unit: { fontSize: 12, fontWeight: "700", color: COLORS.textSecondary },
  unitLocked: { fontSize: 12, fontWeight: "700", color: MUTED_LOCK },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginTop: 5,
  },
});

// ─── PHASE 2: Ready screen ────────────────────────────────────────────────────
const ReadyScreen: React.FC<{
  plan: ReturnType<typeof calculatePlan>;
  onUnlockPress?: () => void;
}> = ({ plan, onUnlockPress }) => {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const calCardAnim = useRef(new Animated.Value(0)).current;
  const macroAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const ctaAnim = useRef(new Animated.Value(0)).current;
  const sheenX = useRef(new Animated.Value(-1)).current;
  const [showConfetti, setShowConfetti] = useState(true);

  const bmiColor = bmiColorFor(plan.bmiCategory);

  useEffect(() => {
    // Entrance
    Animated.stagger(150, [
      Animated.spring(headerAnim, {
        toValue: 1,
        tension: 55,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.spring(calCardAnim, {
        toValue: 1,
        tension: 44,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(macroAnim, {
        toValue: 1,
        tension: 44,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(statsAnim, {
        toValue: 1,
        tension: 44,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(ctaAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Float loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Sheen loop on calorie card
    Animated.loop(
      Animated.sequence([
        Animated.timing(sheenX, {
          toValue: 1,
          duration: 1600,
          delay: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(sheenX, {
          toValue: -1,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(1400),
      ]),
    ).start();

    // Remove confetti overlay after 2.4s
    const confettiTimer = setTimeout(() => setShowConfetti(false), 2400);
    return () => clearTimeout(confettiTimer);
  }, []);

  return (
    <View style={rs.root}>
      {/* 2-second confetti burst on entry */}
      {showConfetti && <ReadyConfetti />}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={rs.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header */}
        <Animated.View
          style={[
            rs.headerBlock,
            {
              opacity: headerAnim,
              transform: [
                {
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              rs.lockBadgeWrap,
              {
                transform: [
                  {
                    translateY: floatAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -7],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={rs.lockCircle}>
              <AppIcon name="lock" size={64} />
            </View>
          </Animated.View>
          <View style={rs.previewPill}>
            <Text style={rs.previewPillText}>YOUR PREVIEW</Text>
          </View>
          <Text style={rs.headline}>
            We did the math.{"\n"}
            <Text style={rs.headlineAccent}>Your numbers are in.</Text>
          </Text>
          <Text style={rs.subline}>
            Unlock to see your full plan — here's a preview.
          </Text>
        </Animated.View>

        {/* Calorie hero card */}
        <Animated.View
          style={[
            rs.calCard,
            {
              opacity: calCardAnim,
              transform: [
                {
                  translateY: calCardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
                {
                  scale: calCardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={ACCENT_GRADIENT}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={rs.calTopHighlight} />
          <Animated.View
            style={[
              rs.calSheen,
              {
                transform: [
                  {
                    translateX: sheenX.interpolate({
                      inputRange: [-1, 1],
                      outputRange: [-SW, SW],
                    }),
                  },
                  { skewX: "-18deg" },
                ],
              },
            ]}
          />
          <Text style={rs.calEyebrow}>Daily Calorie Goal</Text>
          <View style={rs.calValueRow}>
            <LockedValue
              target={plan.calories}
              suffix=" kcal"
              countDuration={1200}
              startDelay={500}
              style={rs.calValue}
              unitStyle={rs.calUnit}
              lockTint="rgba(255,255,255,0.22)"
            />
          </View>
          <View style={rs.calDivider} />
        </Animated.View>

        {/* Macro trio */}
        <Animated.View
          style={[
            rs.macroRow,
            {
              opacity: macroAnim,
              transform: [
                {
                  translateY: macroAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <LockedMacroCard
            label="Protein"
            value={plan.protein}
            unit="g"
            color="#3B82F6"
            delay={1300}
          />
          <LockedMacroCard
            label="Carbs"
            value={plan.carbs}
            unit="g"
            color="#22C55E"
            delay={1450}
          />
          <LockedMacroCard
            label="Fat"
            value={plan.fat}
            unit="g"
            color="#F59E0B"
            delay={1600}
          />
        </Animated.View>

        {/* BMI + Water */}
        <Animated.View
          style={[
            rs.statsRow,
            {
              opacity: statsAnim,
              transform: [
                {
                  translateY: statsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={rs.statCard}>
            <View style={[rs.statAccentBar, { backgroundColor: bmiColor }]} />
            <View style={rs.statBody}>
              <LockedValue
                target={plan.bmi}
                countDuration={900}
                startDelay={1900}
                decimals={1}
                style={rs.statValue}
                lockTint="rgba(0,0,0,0)"
              />
              <Text style={rs.statLabel}>BMI</Text>
            </View>
            <View style={[rs.statPill, { backgroundColor: bmiColor }]}>
              <Text style={rs.statPillText}>{plan.bmiCategory}</Text>
            </View>
          </View>
          <View style={rs.statCard}>
            <View style={[rs.statAccentBar, { backgroundColor: "#60A5FA" }]} />
            <View style={rs.statBody}>
              <LockedValue
                target={plan.waterL}
                suffix="L"
                countDuration={900}
                startDelay={2050}
                decimals={1}
                style={rs.statValue}
                lockTint="rgba(0,0,0,0)"
              />
              <Text style={rs.statLabel}>Daily Water</Text>
            </View>
            <View style={[rs.statPill, { backgroundColor: "#60A5FA" }]}>
              <Text style={rs.statPillText}>Target</Text>
            </View>
          </View>
        </Animated.View>

        {/* CTA */}
        <Animated.View
          style={[
            rs.ctaWrap,
            {
              opacity: ctaAnim,
              transform: [
                {
                  translateY: ctaAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        ></Animated.View>
      </ScrollView>
    </View>
  );
};

const rs = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  headerBlock: { alignItems: "center", marginBottom: SPACING.lg },
  lockBadgeWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  lockCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  previewPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: SPACING.sm,
  },
  previewPillText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: 1.1,
  },
  headline: {
    fontSize: 29,
    fontWeight: "800",
    color: COLORS.textDark,
    textAlign: "center",
    letterSpacing: -0.9,
    lineHeight: 38,
    marginBottom: SPACING.xs,
  },
  headlineAccent: { color: COLORS.primary },
  subline: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  calCard: {
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 26,
    elevation: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  calTopHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "55%",
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  calSheen: {
    position: "absolute",
    top: -20,
    bottom: -20,
    width: 80,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  calEyebrow: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.72)",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  calValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: SPACING.sm,
  },
  calValue: {
    fontSize: 54,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -2,
  },
  calUnit: {
    fontSize: 16,
    fontWeight: "700",
    color: "rgba(255,255,255,0.68)",
    marginLeft: 4,
  },
  calDivider: {
    width: 44,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.28)",
    marginBottom: SPACING.sm,
  },
  macroRow: { flexDirection: "row", gap: 10, marginBottom: SPACING.sm },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: SPACING.md },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 22,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
    paddingRight: SPACING.sm,
    borderWidth: 1.5,
    borderColor: "rgba(244,123,32,0.12)",
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 3,
  },
  statAccentBar: {
    width: 4,
    alignSelf: "stretch",
    marginRight: SPACING.sm,
    borderRadius: 2,
  },
  statBody: { flex: 1 },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  statPill: { borderRadius: 999, paddingHorizontal: 7, paddingVertical: 3 },
  statPillText: {
    fontSize: 9,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  ctaWrap: { marginTop: SPACING.md, marginBottom: SPACING.sm },
  ctaButton: {
    borderRadius: 50,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 10,
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 50,
  },
  ctaText: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: 0.4,
  },
});

// ─── Spark + SparkBurst (for unlock cards) ────────────────────────────────────
const Spark: React.FC<{
  angle: number;
  dist: number;
  size: number;
  color: string;
}> = ({ angle, dist, size, color }) => {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, {
      toValue: 1,
      duration: 620,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);
  const radv = (angle * Math.PI) / 180;
  return (
    <Animated.View
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: a.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1, 0],
        }),
        transform: [
          {
            translateX: a.interpolate({
              inputRange: [0, 1],
              outputRange: [0, Math.cos(radv) * dist],
            }),
          },
          {
            translateY: a.interpolate({
              inputRange: [0, 1],
              outputRange: [0, Math.sin(radv) * dist],
            }),
          },
          {
            scale: a.interpolate({ inputRange: [0, 1], outputRange: [1, 0.3] }),
          },
        ],
      }}
    />
  );
};

const SparkBurst: React.FC = () => {
  const sparks = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        angle: i * 45 + rand(-10, 10),
        dist: rand(20, 34),
        size: rand(4, 6.5),
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
      })),
    [],
  );
  return (
    <View style={us.sparkOrigin} pointerEvents="none">
      {sparks.map((sp, i) => (
        <Spark key={i} {...sp} />
      ))}
    </View>
  );
};

// ─── RevealValue: masked chip → count-up reveal ───────────────────────────────
const RevealValue: React.FC<{
  target: number;
  suffix?: string;
  decimals?: number;
  revealed: boolean;
  style: object;
  unitStyle?: object;
  lockTint?: string;
}> = ({
  target,
  suffix = "",
  decimals = 0,
  revealed,
  style,
  unitStyle,
  lockTint = "rgba(0,0,0,0.18)",
}) => {
  const a = useRef(new Animated.Value(0)).current;
  const [num, setNum] = useState(0);

  useEffect(() => {
    if (!revealed) return;
    Animated.spring(a, {
      toValue: 1,
      tension: 70,
      friction: 8,
      useNativeDriver: true,
    }).start();
    let raf = 0;
    let start: number | null = null;
    const dur = 850;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setNum(e * target);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setNum(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [revealed]);

  if (!revealed) {
    return (
      <View style={[sharedStyles.lockChip, { backgroundColor: lockTint }]}>
        <Text style={[style, sharedStyles.lockMask]}>
          {maskFor(target, decimals)}
        </Text>
        {suffix ? <Text style={unitStyle ?? style}>{suffix}</Text> : null}
      </View>
    );
  }
  return (
    <Animated.View
      style={{
        opacity: a,
        transform: [
          {
            scale: a.interpolate({
              inputRange: [0, 1],
              outputRange: [0.82, 1],
            }),
          },
        ],
      }}
    >
      <Text style={style}>
        {decimals > 0
          ? num.toFixed(decimals)
          : Math.round(num).toLocaleString()}
        {suffix ? <Text style={unitStyle ?? style}>{suffix}</Text> : null}
      </Text>
    </Animated.View>
  );
};

// ─── RevealMacroCard: same card as ReadyScreen, mask dissolves on reveal ──────
const RevealMacroCard: React.FC<{
  label: string;
  value: number;
  unit: string;
  color: string;
  revealed: boolean;
}> = ({ label, value, unit, color, revealed }) => {
  const glow = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!revealed) return;
    Animated.sequence([
      Animated.timing(glow, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(glow, {
        toValue: 0,
        duration: 650,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [revealed]);

  return (
    <View style={macroStyles.card}>
      <Animated.View
        pointerEvents="none"
        style={[us.revealGlowBorder, { opacity: glow }]}
      />
      {revealed && (
        <View style={us.sparkCenter} pointerEvents="none">
          <SparkBurst />
        </View>
      )}
      <View style={[macroStyles.ring, { borderColor: color }]}>
        <View style={[macroStyles.ringCore, { backgroundColor: color }]} />
      </View>
      {revealed ? (
        <RevealValue
          target={value}
          suffix={unit}
          revealed
          style={macroStyles.value}
          unitStyle={macroStyles.unit}
        />
      ) : (
        <Text style={[macroStyles.value, macroStyles.valueLocked]}>
          {maskFor(value)}
          <Text style={macroStyles.unitLocked}>{unit}</Text>
        </Text>
      )}
      <Text style={macroStyles.label}>{label}</Text>
    </View>
  );
};

const us = StyleSheet.create({
  sparkOrigin: {
    width: 0,
    height: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  sparkCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  revealGlowBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
});

// ─── PHASE 3: UnlockingScreen — same layout as ReadyScreen, masks dissolve ────
const UnlockingScreen: React.FC<{
  plan: ReturnType<typeof calculatePlan>;
  isSubmitting: boolean;
  onFinished: () => void;
}> = ({ plan, isSubmitting, onFinished }) => {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const calCardAnim = useRef(new Animated.Value(0)).current;
  const macroAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const bannerAnim = useRef(new Animated.Value(0)).current;
  const planPulse = useRef(new Animated.Value(0)).current;
  const sheenX = useRef(new Animated.Value(-1)).current;
  const calGlow = useRef(new Animated.Value(0)).current;

  const [revealCal, setRevealCal] = useState(false);
  const [revealMacros, setRevealMacros] = useState(false);
  const [revealBmi, setRevealBmi] = useState(false);
  const [revealWater, setRevealWater] = useState(false);
  const [planUnlocked, setPlanUnlocked] = useState(false);
  const hasRun = useRef(false);

  const bmiColor = bmiColorFor(plan.bmiCategory);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const run = async () => {
      // Cards land exactly where ReadyScreen left them — still masked
      Animated.stagger(130, [
        Animated.spring(headerAnim, {
          toValue: 1,
          tension: 55,
          friction: 9,
          useNativeDriver: true,
        }),
        Animated.spring(calCardAnim, {
          toValue: 1,
          tension: 44,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(macroAnim, {
          toValue: 1,
          tension: 44,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(statsAnim, {
          toValue: 1,
          tension: 44,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      await wait(1100);

      // 1. Calorie hero: sheen sweeps, mask dissolves into count-up
      tapHaptic();
      Animated.timing(sheenX, {
        toValue: 1,
        duration: 700,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start();
      Animated.sequence([
        Animated.timing(calGlow, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(calGlow, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start();
      setRevealCal(true);
      await wait(1200);

      // 2. Macro trio
      tapHaptic();
      setRevealMacros(true);
      await wait(1150);

      // 3. BMI, then water
      tapHaptic();
      setRevealBmi(true);
      await wait(450);
      softHaptic();
      setRevealWater(true);
      await wait(1000);

      // 4. Banner + pulse → celebration
      setPlanUnlocked(true);
      successHaptic();
      Animated.parallel([
        Animated.spring(bannerAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(planPulse, {
            toValue: 1,
            duration: 260,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(planPulse, {
            toValue: 0,
            duration: 300,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]).start();
      await wait(1200);
      onFinished();
    };
    run();
  }, []);

  const pulseScale = planPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.025],
  });

  return (
    <View style={unls.root}>
      <LinearGradient
        colors={[
          COLORS.backgroundGradientTop,
          COLORS.backgroundGradientMid,
          COLORS.backgroundGradientBottom,
        ]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={unls.inner}>
        {/* Header */}
        <Animated.View
          style={[
            unls.header,
            {
              opacity: headerAnim,
              transform: [
                {
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={unls.successPill}>
            <AppIcon name="check" size={14} />
            <Text style={unls.successPillText}>PAYMENT SUCCESSFUL</Text>
          </View>
          <Text style={unls.title}>
            {planUnlocked ? "Plan unlocked!" : "Unlocking your plan"}
          </Text>
          <Text style={unls.subtitle}>
            {planUnlocked
              ? "Everything's ready to go."
              : isSubmitting
                ? "Securing your plan…"
                : "Revealing your personalized numbers"}
          </Text>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: pulseScale }] }}>
          {/* Calorie hero card — identical to ReadyScreen */}
          <Animated.View
            style={[
              rs.calCard,
              {
                opacity: calCardAnim,
                transform: [
                  {
                    translateY: calCardAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                  {
                    scale: calCardAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={ACCENT_GRADIENT}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={rs.calTopHighlight} />
            <Animated.View
              style={[
                rs.calSheen,
                {
                  transform: [
                    {
                      translateX: sheenX.interpolate({
                        inputRange: [-1, 1],
                        outputRange: [-SW, SW],
                      }),
                    },
                    { skewX: "-18deg" },
                  ],
                },
              ]}
            />
            <Animated.View
              pointerEvents="none"
              style={[unls.calGlowBorder, { opacity: calGlow }]}
            />
            <Text style={rs.calEyebrow}>Daily Calorie Goal</Text>
            <View style={rs.calValueRow}>
              <RevealValue
                target={plan.calories}
                suffix=" kcal"
                revealed={revealCal}
                style={rs.calValue}
                unitStyle={rs.calUnit}
                lockTint="rgba(255,255,255,0.22)"
              />
            </View>
            <View style={rs.calDivider} />
          </Animated.View>

          {/* Macro trio — identical cards, masks dissolve */}
          <Animated.View
            style={[
              rs.macroRow,
              {
                opacity: macroAnim,
                transform: [
                  {
                    translateY: macroAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [16, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <RevealMacroCard
              label="Protein"
              value={plan.protein}
              unit="g"
              color="#3B82F6"
              revealed={revealMacros}
            />
            <RevealMacroCard
              label="Carbs"
              value={plan.carbs}
              unit="g"
              color="#22C55E"
              revealed={revealMacros}
            />
            <RevealMacroCard
              label="Fat"
              value={plan.fat}
              unit="g"
              color="#F59E0B"
              revealed={revealMacros}
            />
          </Animated.View>

          {/* BMI + Water — identical to ReadyScreen */}
          <Animated.View
            style={[
              rs.statsRow,
              {
                opacity: statsAnim,
                transform: [
                  {
                    translateY: statsAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [16, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={rs.statCard}>
              <View style={[rs.statAccentBar, { backgroundColor: bmiColor }]} />
              <View style={rs.statBody}>
                <RevealValue
                  target={plan.bmi}
                  decimals={1}
                  revealed={revealBmi}
                  style={rs.statValue}
                  lockTint="rgba(0,0,0,0)"
                />
                <Text style={rs.statLabel}>BMI</Text>
              </View>
              <View style={[rs.statPill, { backgroundColor: bmiColor }]}>
                <Text style={rs.statPillText}>{plan.bmiCategory}</Text>
              </View>
            </View>
            <View style={rs.statCard}>
              <View
                style={[rs.statAccentBar, { backgroundColor: "#60A5FA" }]}
              />
              <View style={rs.statBody}>
                <RevealValue
                  target={plan.waterL}
                  suffix="L"
                  decimals={1}
                  revealed={revealWater}
                  style={rs.statValue}
                  lockTint="rgba(0,0,0,0)"
                />
                <Text style={rs.statLabel}>Daily Water</Text>
              </View>
              <View style={[rs.statPill, { backgroundColor: "#60A5FA" }]}>
                <Text style={rs.statPillText}>Target</Text>
              </View>
            </View>
          </Animated.View>
        </Animated.View>

        <Animated.View
          style={{
            alignSelf: "center",
            opacity: bannerAnim,
            transform: [
              {
                scale: bannerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.85, 1],
                }),
              },
              {
                translateY: bannerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          }}
        >
          <LinearGradient
            colors={ACCENT_GRADIENT}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={unls.banner}
          >
            <AppIcon name="trophy" size={28} />
            <Text style={unls.bannerText}>DAILY PLAN UNLOCKED</Text>
          </LinearGradient>
        </Animated.View>
      </View>
    </View>
  );
};

const unls = StyleSheet.create({
  root: { flex: 1 },
  inner: { flex: 1, paddingHorizontal: SPACING.lg, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: SPACING.lg },
  successPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(46,204,113,0.12)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: SPACING.sm,
  },
  successPillText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#2ECC71",
    letterSpacing: 1.1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textDark,
    textAlign: "center",
    letterSpacing: -0.8,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  calGlowBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 11,
    marginTop: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  bannerText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: 1,
  },
});

const SuccessCelebration: React.FC<{ onFinished?: () => void }> = ({
  onFinished,
}) => {
  const ringScale = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const lockOut = useRef(new Animated.Value(0)).current;
  const checkIn = useRef(new Animated.Value(0)).current;
  const burstRing = useRef(new Animated.Value(0)).current;
  const burstRing2 = useRef(new Animated.Value(0)).current;
  const haloPulse = useRef(new Animated.Value(0)).current;
  const pillAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const subAnim = useRef(new Animated.Value(0)).current;
  const [fire, setFire] = useState(false);
  const [wave2, setWave2] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(haloPulse, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(haloPulse, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.sequence([
      Animated.spring(ringScale, {
        toValue: 1,
        tension: 45,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(shake, {
          toValue: 1,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.timing(shake, {
          toValue: -1,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.timing(shake, {
          toValue: 0.6,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shake, {
          toValue: 0,
          duration: 60,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setFire(true);
      successHaptic();
      Animated.parallel([
        Animated.timing(lockOut, {
          toValue: 1,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(checkIn, {
          toValue: 1,
          tension: 80,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(burstRing, {
          toValue: 1,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(burstRing2, {
          toValue: 1,
          duration: 950,
          delay: 120,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
      setTimeout(() => {
        setWave2(true);
        softHaptic();
      }, 480);

      Animated.stagger(110, [
        Animated.spring(pillAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(textAnim, {
          toValue: 1,
          duration: 380,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(subAnim, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
      ]).start(() => onFinished?.());
    });
  }, []);

  const burstPieces = useMemo(
    () =>
      Array.from({ length: 42 }).map((_, i) => ({
        angle: (i / 42) * 360 + rand(-8, 8),
        distance: rand(90, 190),
        size: rand(8, 15),
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        shape: CONFETTI_SHAPES[i % CONFETTI_SHAPES.length],
        delay: rand(0, 120),
        duration: rand(900, 1300),
        spin: rand(360, 900) * (i % 2 ? 1 : -1),
      })),
    [],
  );
  const burstPieces2 = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        angle: (i / 24) * 360 + rand(-12, 12),
        distance: rand(120, 230),
        size: rand(7, 12),
        color: PARTICLE_COLORS[(i + 3) % PARTICLE_COLORS.length],
        shape: CONFETTI_SHAPES[i % CONFETTI_SHAPES.length],
        delay: rand(0, 160),
        duration: rand(1000, 1500),
        spin: rand(360, 900) * (i % 2 ? 1 : -1),
      })),
    [],
  );
  const fallPieces = useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => ({
        startX: rand(0, SW),
        size: rand(8, 14),
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        shape: CONFETTI_SHAPES[i % CONFETTI_SHAPES.length],
        delay: rand(0, 700),
        duration: rand(1700, 2700),
        sway: rand(20, 55),
        spin: rand(360, 1080) * (i % 2 ? 1 : -1),
      })),
    [],
  );

  return (
    <View style={cc.container}>
      <LinearGradient
        colors={[
          COLORS.backgroundGradientTop,
          COLORS.backgroundGradientMid,
          COLORS.backgroundGradientBottom,
        ]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      {fire && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {fallPieces.map((p, i) => (
            <ConfettiPiece key={`f${i}`} mode="fall" {...p} />
          ))}
        </View>
      )}
      <Animated.View
        style={[
          cc.glowCircle,
          {
            opacity: haloPulse.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1],
            }),
            transform: [
              {
                scale: haloPulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.92, 1.08],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          cc.burstRing,
          {
            opacity: burstRing.interpolate({
              inputRange: [0, 0.2, 1],
              outputRange: [0, 0.6, 0],
            }),
            transform: [
              {
                scale: burstRing.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.4, 2.4],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          cc.burstRing,
          {
            borderColor: "rgba(255,154,77,0.45)",
            opacity: burstRing2.interpolate({
              inputRange: [0, 0.2, 1],
              outputRange: [0, 0.45, 0],
            }),
            transform: [
              {
                scale: burstRing2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.4, 3.1],
                }),
              },
            ],
          },
        ]}
      />
      {fire && (
        <View style={cc.particleContainer} pointerEvents="none">
          {burstPieces.map((p, i) => (
            <ConfettiPiece key={`b${i}`} mode="burst" {...p} />
          ))}
          {wave2 &&
            burstPieces2.map((p, i) => (
              <ConfettiPiece key={`b2${i}`} mode="burst" {...p} />
            ))}
        </View>
      )}
      <Animated.View
        style={[
          cc.badgeWrap,
          {
            opacity: ringScale,
            transform: [
              { scale: ringScale },
              {
                rotate: shake.interpolate({
                  inputRange: [-1, 1],
                  outputRange: ["-9deg", "9deg"],
                }),
              },
            ],
          },
        ]}
      >
        <View style={cc.circle}>
          <Animated.View
            style={[
              cc.glyphAbs,
              {
                opacity: lockOut.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                }),
                transform: [
                  {
                    scale: lockOut.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.4],
                    }),
                  },
                ],
              },
            ]}
          >
            <AppIcon name="lock" size={68} />
          </Animated.View>
          <Animated.View
            style={[
              cc.glyphAbs,
              {
                opacity: checkIn,
                transform: [
                  { scale: checkIn },
                  {
                    rotate: checkIn.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["-35deg", "0deg"],
                    }),
                  },
                ],
              },
            ]}
          >
            <AppIcon name="check" size={64} />
          </Animated.View>
        </View>
      </Animated.View>
      <Animated.View
        style={{
          opacity: pillAnim,
          transform: [
            {
              scale: pillAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        }}
      >
        <View style={cc.pill}>
          <AppIcon name="trophy" size={28} />
          <Text style={cc.pillText}>PLAN UNLOCKED</Text>
        </View>
      </Animated.View>
      <Animated.View
        style={{
          opacity: textAnim,
          transform: [
            {
              translateY: textAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}
      >
        <Text style={cc.title}>You're all set!</Text>
      </Animated.View>
      <Animated.View style={{ opacity: subAnim }}>
        <Text style={cc.subtitle}>
          Your personalized plan is ready.{"\n"}Let's start your journey.
        </Text>
      </Animated.View>
    </View>
  );
};

const cc = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.backgroundGradientTop,
    paddingHorizontal: SPACING.lg,
  },
  glowCircle: {
    position: "absolute",
    width: SW * 0.85,
    height: SW * 0.85,
    borderRadius: SW * 0.425,
    backgroundColor: "rgba(244,123,32,0.10)",
  },
  burstRing: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: "rgba(244,123,32,0.5)",
  },
  particleContainer: {
    position: "absolute",
    width: 0,
    height: 0,
    justifyContent: "center",
    alignItems: "center",
    top: SH * 0.42,
  },
  badgeWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xl,
    position: "relative",
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  glyphAbs: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: SPACING.md,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: 1.1,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: COLORS.textDark,
    textAlign: "center",
    letterSpacing: -0.8,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
});

// ─── Shared styles ────────────────────────────────────────────────────────────
const sharedStyles = StyleSheet.create({
  lockChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  lockMask: { letterSpacing: 3 },
});

// ─── MAIN Completion ──────────────────────────────────────────────────────────
export const Completion: React.FC<CompletionProps> = ({
  isActive = false,
  startAnimation = false,
  onAnimationComplete,
  isSubmitting = false,
  onUnlockPress,
}) => {
  // Four phases — loading runs automatically, ready waits for CTA,
  // unlocking fires after paywall success, celebration is the finale.
  type Phase = "loading" | "ready" | "unlocking" | "celebration";
  const [phase, setPhase] = useState<Phase>("loading");
  const hasLoadedRef = useRef(false);

  // Compute plan once
  const plan = useMemo(() => {
    const currentWeight = getGlobalCurrentWeight() || 78;
    const birthYear = getSelectedBirthYear() || 2000;
    const age = new Date().getFullYear() - birthYear;
    return calculatePlan(currentWeight, 170, age, "Male", "Lose");
  }, []);

  // Reset when slide becomes inactive (user navigated away and back).
  // The LoadingScreen itself only starts once isActive is true, so the
  // sequence never runs off-screen while the FlatList pre-mounts this slide.
  useEffect(() => {
    if (!isActive) {
      setPhase("loading");
      hasLoadedRef.current = false;
    }
  }, [isActive]);

  // startAnimation=true means paywall succeeded → move to unlocking
  useEffect(() => {
    if (startAnimation && phase === "ready") {
      setPhase("unlocking");
    }
  }, [startAnimation, phase]);

  if (phase === "celebration") {
    return <SuccessCelebration onFinished={() => onAnimationComplete?.()} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.backgroundGradientTop }}>
      <LinearGradient
        colors={[
          COLORS.backgroundGradientTop,
          COLORS.backgroundGradientMid,
          COLORS.backgroundGradientBottom,
        ]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      {phase === "loading" && (
        <LoadingScreen
          isActive={isActive}
          onComplete={() => {
            hasLoadedRef.current = true;
            setPhase("ready");
          }}
        />
      )}

      {phase === "ready" && (
        <ReadyScreen plan={plan} onUnlockPress={onUnlockPress} />
      )}

      {phase === "unlocking" && (
        <UnlockingScreen
          plan={plan}
          isSubmitting={isSubmitting}
          onFinished={() => setPhase("celebration")}
        />
      )}
    </View>
  );
};
