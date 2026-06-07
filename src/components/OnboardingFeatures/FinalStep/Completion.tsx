import {
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "@/src/Screens/Onboarding/Onboarding.style";
import { getSelectedBirthYear } from "@/src/components/OnboardingFeatures/GoalInfo/BirthYearPicker";
import { getGlobalCurrentWeight } from "@/src/components/OnboardingFeatures/GoalInfo/CurrentWeight";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: SW, height: SH } = Dimensions.get("window");

type CompletionProps = {
  startAnimation?: boolean;
  onAnimationComplete?: () => void;
  isSubmitting?: boolean;
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

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const rand = (min: number, max: number) => min + Math.random() * (max - min);

// Build a digit-matched mask so a locked value reads as "hidden", not blank.
const maskFor = (target: number, decimals = 0) => {
  if (decimals > 0) return "••.•";
  const digits = Math.max(1, String(Math.round(target)).length);
  return "•".repeat(digits);
};

// ─────────────────────────────────────────────────────────────────────────────
// TDEE / Macro calculator  (logic unchanged)
// ─────────────────────────────────────────────────────────────────────────────
function calculatePlan(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: string,
  goal: string,
) {
  let bmr: number;
  if (gender === "Female") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }
  const tdee = Math.round(bmr * 1.55);
  let targetCal: number;
  if (goal === "Lose") targetCal = Math.round(tdee - 500);
  else if (goal === "Gain") targetCal = Math.round(tdee + 350);
  else targetCal = tdee;
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

const bmiColorFor = (category: string) =>
  category === "Normal"
    ? "#2ECC71"
    : category === "Overweight"
      ? "#F5A623"
      : category === "Obese"
        ? "#FF4757"
        : "#2196F3";

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
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setTimeout(() => setLocked(true), 350);
        }
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

// ─────────────────────────────────────────────────────────────────────────────
// Ready-screen locked value — counts up, then settles into a frosted "locked" chip
// ─────────────────────────────────────────────────────────────────────────────
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
    if (locked) {
      Animated.spring(lockAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
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
          <Text style={sharedStyles.lockChipDot}>🔒</Text>
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

// ─────────────────────────────────────────────────────────────────────────────
// Ready-screen macro card — chunky ring accent; clean masked locked state (no lock icon)
// ─────────────────────────────────────────────────────────────────────────────
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
    if (locked) {
      Animated.spring(lockAnim, {
        toValue: 1,
        tension: 55,
        friction: 9,
        useNativeDriver: true,
      }).start();
    }
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
    position: "relative",
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
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    marginTop: 5,
    fontWeight: "700",
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Confetti — center burst (with gravity) + falling ribbons  (celebration)
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// Tiny spark burst — pops from a card's badge the moment it unlocks
// ─────────────────────────────────────────────────────────────────────────────
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
            scale: a.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.3],
            }),
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
    <View style={s.sparkOrigin} pointerEvents="none">
      {sparks.map((sp, i) => (
        <Spark key={i} {...sp} />
      ))}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Macro pill — scales in when its parent card unlocks
// ─────────────────────────────────────────────────────────────────────────────
const MacroPill: React.FC<{
  value: number;
  unit: string;
  color: string;
  delay: number;
}> = ({ value, unit, color, delay }) => {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(a, {
      toValue: 1,
      tension: 70,
      friction: 7,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View
      style={[
        s.macroPill,
        {
          opacity: a,
          transform: [
            {
              scale: a.interpolate({
                inputRange: [0, 1],
                outputRange: [0.55, 1],
              }),
            },
          ],
        },
      ]}
    >
      <View style={[s.macroPillDot, { backgroundColor: color }]} />
      <Text style={s.macroPillText}>
        {value}
        {unit}
      </Text>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Unlock card — the new loader. Locked → frost lifts, lock flips to check,
// shine sweeps, value counts in, sparks pop.
// ─────────────────────────────────────────────────────────────────────────────
type MacroItem = { value: number; unit: string; color: string };

const UnlockCard: React.FC<{
  kind: "calories" | "macros" | "bmi";
  icon: string;
  label: string;
  visible: boolean;
  unlocked: boolean;
  index: number;
  planPulse: Animated.Value;
  calorieValue?: number;
  macros?: MacroItem[];
  bmiValue?: number;
  bmiCategory?: string;
  bmiColor?: string;
}> = ({
  kind,
  icon,
  label,
  visible,
  unlocked,
  index,
  planPulse,
  calorieValue = 0,
  macros = [],
  bmiValue = 0,
  bmiCategory = "",
  bmiColor = "#2196F3",
}) => {
  const entrance = useRef(new Animated.Value(0)).current;
  const lockOut = useRef(new Animated.Value(0)).current;
  const scrim = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const shine = useRef(new Animated.Value(0)).current;
  const [num, setNum] = useState(0);

  useEffect(() => {
    if (visible) {
      Animated.spring(entrance, {
        toValue: 1,
        tension: 50,
        friction: 9,
        delay: index * 120,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    if (!unlocked) return;
    Animated.parallel([
      Animated.spring(lockOut, {
        toValue: 1,
        tension: 70,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(scrim, {
        toValue: 0,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(glow, {
        toValue: 1,
        tension: 60,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(shine, {
          toValue: 1,
          duration: 650,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(shine, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    let raf = 0;
    if (kind === "calories" || kind === "bmi") {
      const target = kind === "calories" ? calorieValue : bmiValue;
      const dur = 850;
      let start: number | null = null;
      const tick = (t: number) => {
        if (start === null) start = t;
        const p = Math.min((t - start) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        setNum(e * target);
        if (p < 1) raf = requestAnimationFrame(tick);
        else setNum(target);
      };
      raf = requestAnimationFrame(tick);
    }
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [unlocked]);

  const pulseScale = planPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });

  return (
    <Animated.View
      style={[
        s.unlockCard,
        {
          opacity: entrance,
          transform: [
            {
              translateY: entrance.interpolate({
                inputRange: [0, 1],
                outputRange: [26, 0],
              }),
            },
            {
              scale: entrance.interpolate({
                inputRange: [0, 1],
                outputRange: [0.92, 1],
              }),
            },
            { scale: unlocked ? pulseScale : 1 },
          ],
        },
      ]}
    >
      {/* clipped effect layer (frost + shine) */}
      <View style={s.unlockClip} pointerEvents="none">
        <Animated.View style={[s.unlockScrim, { opacity: scrim }]} />
        <Animated.View
          style={[
            s.unlockShine,
            {
              opacity: shine.interpolate({
                inputRange: [0, 0.2, 1],
                outputRange: [0, 0.55, 0],
              }),
              transform: [
                {
                  translateX: shine.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-240, SW],
                  }),
                },
                { skewX: "-18deg" },
              ],
            },
          ]}
        />
      </View>

      {/* glowing orange border on unlock */}
      <Animated.View
        style={[s.unlockGlowBorder, { opacity: glow }]}
        pointerEvents="none"
      />

      <View style={s.unlockRow}>
        <View style={[s.unlockIconChip, unlocked && s.unlockIconChipDone]}>
          <Text style={s.unlockIcon}>{icon}</Text>
        </View>

        <View style={s.unlockBody}>
          <Text style={s.unlockLabel}>{label}</Text>

          {kind === "macros" ? (
            <View style={s.macroPillRow}>
              {unlocked
                ? macros.map((m, i) => (
                    <MacroPill key={i} {...m} delay={i * 90} />
                  ))
                : macros.map((_, i) => (
                    <View key={i} style={s.macroPillLocked}>
                      <Text style={s.macroPillLockedText}>•••</Text>
                    </View>
                  ))}
            </View>
          ) : kind === "calories" ? (
            unlocked ? (
              <Text style={s.unlockValue}>
                {Math.round(num).toLocaleString()}
                <Text style={s.unlockUnit}> kcal</Text>
              </Text>
            ) : (
              <Text style={s.unlockValueLocked}>
                ••••
                <Text style={s.unlockUnitLocked}> kcal</Text>
              </Text>
            )
          ) : unlocked ? (
            <View style={s.bmiRow}>
              <Text style={s.unlockValue}>{num.toFixed(1)}</Text>
              <View style={[s.bmiPill, { backgroundColor: bmiColor }]}>
                <Text style={s.bmiPillText}>{bmiCategory}</Text>
              </View>
            </View>
          ) : (
            <Text style={s.unlockValueLocked}>••.•</Text>
          )}
        </View>

        <View style={s.unlockBadgeWrap}>
          {unlocked && <SparkBurst />}
          <View style={[s.unlockBadge, unlocked && s.unlockBadgeDone]}>
            <Animated.Text
              style={[
                s.unlockLockGlyph,
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
              🔒
            </Animated.Text>
            <Animated.Text
              style={[
                s.unlockCheck,
                {
                  opacity: lockOut,
                  transform: [
                    { scale: lockOut },
                    {
                      rotate: lockOut.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["-30deg", "0deg"],
                      }),
                    },
                  ],
                },
              ]}
            >
              ✓
            </Animated.Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Success celebration — the confetti payoff to the unlock sequence
// ─────────────────────────────────────────────────────────────────────────────
const SuccessCelebration: React.FC<{ onFinished: () => void }> = ({
  onFinished,
}) => {
  const ringScale = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const lockOut = useRef(new Animated.Value(0)).current;
  const checkIn = useRef(new Animated.Value(0)).current;
  const burstRing = useRef(new Animated.Value(0)).current;
  const haloPulse = useRef(new Animated.Value(0)).current;
  const pillAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const subAnim = useRef(new Animated.Value(0)).current;

  const [fire, setFire] = useState(false);

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
      ]).start();

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
      ]).start(() => setTimeout(onFinished, 1500));
    });
  }, []);

  const burstPieces = useMemo(
    () =>
      Array.from({ length: 38 }).map((_, i) => ({
        angle: (i / 38) * 360 + rand(-8, 8),
        distance: rand(90, 180),
        size: rand(8, 15),
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        shape: CONFETTI_SHAPES[i % CONFETTI_SHAPES.length],
        delay: rand(0, 120),
        duration: rand(900, 1300),
        spin: rand(360, 900) * (i % 2 ? 1 : -1),
      })),
    [],
  );

  const fallPieces = useMemo(
    () =>
      Array.from({ length: 44 }).map((_, i) => ({
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
    <View style={s.celebrationContainer}>
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
          s.glowCircle,
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
          s.burstRing,
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

      {fire && (
        <View style={s.particleContainer} pointerEvents="none">
          {burstPieces.map((p, i) => (
            <ConfettiPiece key={`b${i}`} mode="burst" {...p} />
          ))}
        </View>
      )}

      <Animated.View
        style={[
          s.celebrateBadgeWrap,
          {
            opacity: ringScale,
            transform: [
              {
                scale: ringScale.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
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
        <View style={s.lockGlowOuter} />
        <View style={s.lockGlowInner} />
        <LinearGradient
          colors={["#FF9A4D", COLORS.primary, "#C45E0A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.celebrateCircle}
        >
          <Animated.Text
            style={[
              s.celebrateGlyph,
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
            🔒
          </Animated.Text>
          <Animated.Text
            style={[
              s.celebrateCheck,
              {
                opacity: checkIn,
                transform: [
                  {
                    scale: checkIn.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                  },
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
            ✓
          </Animated.Text>
        </LinearGradient>
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
        <View style={s.unlockedPill}>
          <Text style={s.unlockedPillText}>🔓 PLAN UNLOCKED</Text>
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
        <Text style={s.successTitle}>You're all set!</Text>
      </Animated.View>
      <Animated.View style={{ opacity: subAnim }}>
        <Text style={s.successSubtitle}>
          Your personalized plan is ready.{"\n"}Let's start your journey.
        </Text>
      </Animated.View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Ready screen  (content unchanged)
// ─────────────────────────────────────────────────────────────────────────────
const ReadyScreen: React.FC = () => {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const calCardAnim = useRef(new Animated.Value(0)).current;
  const macroAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const sheenX = useRef(new Animated.Value(-1)).current;
  const auraAnim = useRef(new Animated.Value(0)).current;

  const currentWeight = getGlobalCurrentWeight() || 78;
  const birthYear = getSelectedBirthYear() || 2000;
  const age = new Date().getFullYear() - birthYear;
  const goal = "Lose";
  const plan = calculatePlan(currentWeight, 170, age, "Male", goal);

  useEffect(() => {
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

    Animated.loop(
      Animated.sequence([
        Animated.timing(auraAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(auraAnim, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();

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
    ]).start();

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
  }, []);

  const bmiColor = bmiColorFor(plan.bmiCategory);

  return (
    <View style={s.readyRoot}>
      <Animated.View
        style={[
          s.auraBlob,
          {
            top: -SW * 0.25,
            right: -SW * 0.3,
            opacity: auraAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.35, 0.6],
            }),
            transform: [
              {
                scale: auraAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.15],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          s.auraBlob,
          {
            bottom: SH * 0.1,
            left: -SW * 0.35,
            opacity: auraAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 0.25],
            }),
          },
        ]}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.readyScroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ── Header ── */}
        <Animated.View
          style={[
            s.headerBlock,
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
              s.lockBadgeWrap,
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
            <View style={s.lockGlowOuter} />
            <View style={s.lockGlowInner} />
            <LinearGradient
              colors={["#FF9A4D", COLORS.primary, "#C45E0A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.lockCircle}
            >
              <Text style={s.lockEmoji}>🔒</Text>
            </LinearGradient>
          </Animated.View>

          <View style={s.previewPill}>
            <Text style={s.previewPillText}>✨ YOUR PREVIEW</Text>
          </View>

          <Text style={s.headline}>
            We did the math.{"\n"}
            <Text style={s.headlineAccent}>Your numbers are in.</Text>
          </Text>
          <Text style={s.subline}>
            Unlock to see your full plan — here's a preview.
          </Text>
        </Animated.View>

        {/* ── Calorie hero "vault" card ── */}
        <Animated.View
          style={[
            s.calCard,
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
            colors={["#FF9A4D", COLORS.primary, "#C45E0A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          <View style={s.calTopHighlight} />
          <View
            style={[
              s.calBlob,
              { top: -50, right: -40, width: 150, height: 150, opacity: 0.16 },
            ]}
          />
          <View
            style={[
              s.calBlob,
              { bottom: -36, left: -30, width: 110, height: 110, opacity: 0.1 },
            ]}
          />

          <Animated.View
            style={[
              s.calSheen,
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

          <Text style={s.calEyebrow}>Daily Calorie Goal</Text>
          <View style={s.calValueRow}>
            <LockedValue
              target={plan.calories}
              suffix=" kcal"
              countDuration={1200}
              startDelay={500}
              style={s.calValue}
              unitStyle={s.calUnit}
              lockTint="rgba(255,255,255,0.22)"
            />
          </View>

          <View style={s.calDivider} />

          <Text style={s.calGoalTag}>
            {goal === "Lose"
              ? "📉  Healthy deficit · steady progress"
              : goal === "Gain"
                ? "📈  Clean surplus · lean gains"
                : "⚖️  Maintenance · your baseline"}
          </Text>
        </Animated.View>

        {/* ── Macro trio ── */}
        <Animated.View
          style={[
            s.macroRow,
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

        {/* ── BMI + Water ── */}
        <Animated.View
          style={[
            s.statsRow,
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
          <View style={s.statCard}>
            <View style={[s.statAccentBar, { backgroundColor: bmiColor }]} />
            <View style={s.statBody}>
              <LockedValue
                target={plan.bmi}
                countDuration={900}
                startDelay={1900}
                decimals={1}
                style={s.statValue}
                lockTint="rgba(244,123,32,0.10)"
              />
              <Text style={s.statLabel}>BMI</Text>
            </View>
            <View style={[s.statPill, { backgroundColor: bmiColor }]}>
              <Text style={s.statPillText}>{plan.bmiCategory}</Text>
            </View>
          </View>

          <View style={s.statCard}>
            <View style={[s.statAccentBar, { backgroundColor: "#60A5FA" }]} />
            <View style={s.statBody}>
              <LockedValue
                target={plan.waterL}
                suffix="L"
                countDuration={900}
                startDelay={2050}
                decimals={1}
                style={s.statValue}
                lockTint="rgba(96,165,250,0.12)"
              />
              <Text style={s.statLabel}>Daily Water</Text>
            </View>
            <View style={[s.statPill, { backgroundColor: "#60A5FA" }]}>
              <Text style={s.statPillText}>Target</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Completion
// ─────────────────────────────────────────────────────────────────────────────
export const Completion: React.FC<CompletionProps> = ({
  startAnimation = false,
  onAnimationComplete,
  isSubmitting = false,
}) => {
  const [phase, setPhase] = useState<"ready" | "unlocking" | "celebration">(
    "ready",
  );

  const readyOpacity = useRef(new Animated.Value(1)).current;
  const unlockOpacity = useRef(new Animated.Value(0)).current;
  const unlockFadeOut = useRef(new Animated.Value(1)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const bannerAnim = useRef(new Animated.Value(0)).current;
  const planPulse = useRef(new Animated.Value(0)).current;
  const hasStartedRef = useRef(false);

  const [cardsVisible, setCardsVisible] = useState(false);
  const [card1, setCard1] = useState(false);
  const [card2, setCard2] = useState(false);
  const [card3, setCard3] = useState(false);
  const [planUnlocked, setPlanUnlocked] = useState(false);

  const plan = useMemo(() => {
    const currentWeight = getGlobalCurrentWeight() || 78;
    const birthYear = getSelectedBirthYear() || 2000;
    const age = new Date().getFullYear() - birthYear;
    return calculatePlan(currentWeight, 170, age, "Male", "Lose");
  }, []);
  const bmiColor = bmiColorFor(plan.bmiCategory);

  useEffect(() => {
    if (!startAnimation || hasStartedRef.current) return;
    hasStartedRef.current = true;

    const runSequence = async () => {
      setPhase("unlocking");
      Animated.parallel([
        Animated.timing(readyOpacity, {
          toValue: 0,
          duration: 350,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(unlockOpacity, {
          toValue: 1,
          duration: 400,
          delay: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
      await wait(450);

      Animated.spring(headerAnim, {
        toValue: 1,
        tension: 55,
        friction: 9,
        useNativeDriver: true,
      }).start();
      setCardsVisible(true);
      await wait(1000);

      setCard1(true); // unlock calories
      await wait(1150);
      setCard2(true); // unlock macros
      await wait(1300);
      setCard3(true); // unlock BMI
      await wait(1150);

      setPlanUnlocked(true); // unlock the whole plan
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
      await wait(1150);

      await new Promise<void>((res) => {
        Animated.timing(unlockFadeOut, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }).start(() => res());
      });
      setPhase("celebration");
    };
    runSequence();
  }, [startAnimation]);

  if (phase === "celebration")
    return <SuccessCelebration onFinished={() => onAnimationComplete?.()} />;

  return (
    <View style={s.container}>
      <LinearGradient
        colors={[
          COLORS.backgroundGradientTop,
          COLORS.backgroundGradientMid,
          COLORS.backgroundGradientBottom,
        ]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      {(phase === "ready" || phase === "unlocking") && (
        <Animated.View
          style={[s.phaseLayer, { opacity: readyOpacity }]}
          pointerEvents={phase === "ready" ? "auto" : "none"}
        >
          <ReadyScreen />
        </Animated.View>
      )}

      {phase === "unlocking" && (
        <Animated.View
          style={[
            s.phaseLayer,
            { opacity: Animated.multiply(unlockOpacity, unlockFadeOut) },
          ]}
        >
          <View style={s.unlockInner}>
            <Animated.View
              style={[
                s.unlockHeader,
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
              <Text style={s.unlockTitle}>
                {planUnlocked ? "Plan unlocked! 🎉" : "Unlocking your plan"}
              </Text>
              <Text style={s.unlockSubtitle}>
                {planUnlocked
                  ? "Everything's ready to go."
                  : isSubmitting
                    ? "Securing your plan…"
                    : "Revealing your personalized numbers"}
              </Text>
            </Animated.View>

            <View style={s.unlockStack}>
              <UnlockCard
                kind="calories"
                icon="🔥"
                label="Daily Calories"
                visible={cardsVisible}
                unlocked={card1}
                index={0}
                planPulse={planPulse}
                calorieValue={plan.calories}
              />
              <UnlockCard
                kind="macros"
                icon="⚡"
                label="Your Macros"
                visible={cardsVisible}
                unlocked={card2}
                index={1}
                planPulse={planPulse}
                macros={[
                  { value: plan.protein, unit: "g", color: "#3B82F6" },
                  { value: plan.carbs, unit: "g", color: "#22C55E" },
                  { value: plan.fat, unit: "g", color: "#F59E0B" },
                ]}
              />
              <UnlockCard
                kind="bmi"
                icon="📊"
                label="Body Mass Index"
                visible={cardsVisible}
                unlocked={card3}
                index={2}
                planPulse={planPulse}
                bmiValue={plan.bmi}
                bmiCategory={plan.bmiCategory}
                bmiColor={bmiColor}
              />
            </View>

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
                colors={["#FF9A4D", COLORS.primary, "#C45E0A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.planBanner}
              >
                <Text style={s.planBannerText}>🔓 DAILY PLAN UNLOCKED</Text>
              </LinearGradient>
            </Animated.View>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

// Shared (LockedValue chip)
const sharedStyles = StyleSheet.create({
  lockChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  lockChipDot: { fontSize: 13 },
  lockMask: { letterSpacing: 3 },
});

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundGradientTop },
  phaseLayer: { ...StyleSheet.absoluteFillObject },

  // ─── ReadyScreen ─────────────────────────────────────────────────────────
  readyRoot: { flex: 1 },
  auraBlob: {
    position: "absolute",
    width: SW * 0.8,
    height: SW * 0.8,
    borderRadius: SW * 0.4,
    backgroundColor: "rgba(244,123,32,0.10)",
  },
  readyScroll: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },

  headerBlock: { alignItems: "center", marginBottom: SPACING.lg },

  lockBadgeWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
    position: "relative",
  },
  lockGlowOuter: {
    position: "absolute",
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: "rgba(244,123,32,0.09)",
  },
  lockGlowInner: {
    position: "absolute",
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "rgba(244,123,32,0.16)",
  },
  lockCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 16,
    elevation: 10,
  },
  lockEmoji: { fontSize: 32 },

  previewPill: {
    backgroundColor: "rgba(244,123,32,0.12)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: "rgba(244,123,32,0.20)",
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
  calBlob: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,1)",
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
  calGoalTag: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
  },

  macroRow: { flexDirection: "row", gap: 10, marginBottom: SPACING.sm },

  statsRow: { flexDirection: "row", gap: 10, marginBottom: SPACING.sm },
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

  // ─── Unlock sequence (new loader) ──────────────────────────────────────────
  unlockInner: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: "center",
  },
  unlockHeader: { alignItems: "center", marginBottom: SPACING.xl },
  unlockTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: SPACING.xs,
  },
  unlockSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  unlockStack: { gap: SPACING.md },

  unlockCard: {
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 24,
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.md,
    borderWidth: 1.5,
    borderColor: "rgba(244,123,32,0.10)",
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
  unlockClip: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    overflow: "hidden",
  },
  unlockScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,250,246,0.40)",
  },
  unlockShine: {
    position: "absolute",
    top: -10,
    bottom: -10,
    width: 70,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  unlockGlowBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  unlockRow: { flexDirection: "row", alignItems: "center" },
  unlockIconChip: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(244,123,32,0.10)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  unlockIconChipDone: { backgroundColor: "rgba(244,123,32,0.18)" },
  unlockIcon: { fontSize: 22 },
  unlockBody: { flex: 1, marginRight: SPACING.sm },
  unlockLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  unlockValue: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.6,
  },
  unlockUnit: { fontSize: 13, fontWeight: "700", color: COLORS.textSecondary },
  unlockValueLocked: {
    fontSize: 24,
    fontWeight: "800",
    color: MUTED_LOCK,
    letterSpacing: 3,
  },
  unlockUnitLocked: { fontSize: 13, fontWeight: "700", color: MUTED_LOCK },

  bmiRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  bmiPill: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  bmiPillText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: 0.3,
  },

  macroPillRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  macroPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(244,123,32,0.08)",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  macroPillDot: { width: 7, height: 7, borderRadius: 3.5 },
  macroPillText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  macroPillLocked: {
    backgroundColor: "rgba(168,150,135,0.12)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  macroPillLockedText: {
    fontSize: 13,
    fontWeight: "800",
    color: MUTED_LOCK,
    letterSpacing: 1,
  },

  unlockBadgeWrap: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  sparkOrigin: {
    position: "absolute",
    top: 22,
    left: 22,
    width: 0,
    height: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  unlockBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1E6DA",
    alignItems: "center",
    justifyContent: "center",
  },
  unlockBadgeDone: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  unlockLockGlyph: { fontSize: 15, position: "absolute" },
  unlockCheck: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: "800",
    position: "absolute",
  },

  planBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 11,
    marginTop: SPACING.xl,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  planBannerText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: 1,
  },

  // ─── Celebration ──────────────────────────────────────────────────────────
  celebrationContainer: {
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
  celebrateBadgeWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xl,
    position: "relative",
  },
  celebrateCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.large,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.45,
    shadowRadius: 22,
  },
  celebrateGlyph: { fontSize: 46, position: "absolute" },
  celebrateCheck: {
    fontSize: 56,
    color: COLORS.white,
    fontWeight: "800",
    position: "absolute",
  },
  unlockedPill: {
    backgroundColor: "rgba(244,123,32,0.14)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: "rgba(244,123,32,0.28)",
  },
  unlockedPillText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: 1.1,
  },
  successTitle: {
    ...TYPOGRAPHY.display,
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  successSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
});
