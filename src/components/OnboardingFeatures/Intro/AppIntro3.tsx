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

const MACROS = [
  {
    label: "Fat",
    value: 55,
    goal: 50,
    barColor: "#FF6B00",
    isOver: true,
  },
  {
    label: "Net Carbs",
    value: 160,
    goal: 180,
    barColor: "#00C48C",
    isOver: false,
  },
  {
    label: "Protein",
    value: 20,
    goal: 72,
    barColor: "#FF3B5C",
    isOver: false,
    isLow: true,
  },
  {
    label: "Fiber",
    value: 24,
    goal: 30,
    barColor: "#845EF7",
    isOver: false,
  },
] as const;

const useCountUp = (target: number, duration: number, resetKey: number) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    setVal(0);
    if (resetKey === 0) return;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [resetKey]);
  return val;
};

const MacroRow: React.FC<{
  label: string;
  value: number;
  goal: number;
  barColor: string;
  isOver?: boolean;
  isLow?: boolean;
  barAnim: Animated.Value;
  elevated?: boolean;
  resetKey?: number;
  bgAnim?: Animated.Value;
}> = ({
  label,
  value,
  goal,
  barColor,
  isOver,
  isLow,
  barAnim,
  elevated,
  resetKey = 0,
  bgAnim,
}) => {
  const displayVal = useCountUp(value, 1000, resetKey);
  const progress = Math.min(value / goal, 1);

  const barWidth = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", `${progress * 100}%`],
  });

  const animatedBg = bgAnim
    ? bgAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["#FFFFFF", "#FFF0F0"],
      })
    : undefined;

  return (
    <Animated.View
      style={[
        row.wrap,
        elevated && row.elevated,
        animatedBg ? { backgroundColor: animatedBg } : null,
      ]}
    >
      <View style={row.top}>
        <View style={row.labelWrap}>
          <View
            style={[
              row.colorDot,
              { backgroundColor: isOver ? "#FF3B5C" : barColor },
            ]}
          />
          <Text style={row.label}>{label}</Text>
        </View>
        <View style={row.valueWrap}>
          {(isOver || isLow) && <Text style={row.warningIcon}>⚠️</Text>}
          <Text style={[row.value, isOver && { color: "#FF3B5C" }]}>
            {displayVal}
          </Text>
          <Text style={row.goal}>/{goal}g</Text>
        </View>
      </View>
      <View
        style={[
          row.track,
          { backgroundColor: (isOver ? "#FF3B5C" : barColor) + "22" },
        ]}
      >
        <Animated.View
          style={[
            row.fill,
            { width: barWidth, backgroundColor: isOver ? "#FF3B5C" : barColor },
          ]}
        />
      </View>
    </Animated.View>
  );
};

const row = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F5EDE0",
  },
  elevated: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 0,
    backgroundColor: "#FFFFFF",
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  labelWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  colorDot: { width: 10, height: 10, borderRadius: 5 },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F1A22",
    letterSpacing: -0.2,
  },
  valueWrap: { flexDirection: "row", alignItems: "center", gap: 2 },
  warningIcon: { fontSize: 13 },
  value: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F1A22",
    letterSpacing: -0.5,
  },
  goal: { fontSize: 13, fontWeight: "500", color: "#B0BECA" },
  track: { height: 12, borderRadius: 8, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 8 },
});

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

interface AppIntro3Props {
  isActive?: boolean;
}

export const AppIntro3: React.FC<AppIntro3Props> = ({ isActive = true }) => {
  const [resetKey, setResetKey] = React.useState(0);

  const eyebrowAnim = useRef(new Animated.Value(0)).current;
  const headline1Anim = useRef(new Animated.Value(0)).current;
  const headline2Anim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const noteAnim = useRef(new Animated.Value(0)).current;
  const trustAnim = useRef(new Animated.Value(0)).current;

  const barAnims = useRef(MACROS.map(() => new Animated.Value(0))).current;
  const fatBgAnim = useRef(new Animated.Value(0)).current;
  const proteinBgAnim = useRef(new Animated.Value(0)).current;

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
    barAnims.forEach((a) => a.setValue(0));
    fatBgAnim.setValue(0);
    proteinBgAnim.setValue(0);

    // After cardAnim lands the sequence splits into Animated.parallel.
    // Branch A: noteAnim and trustAnim continue the UI reveal.
    // Branch B: bars start filling immediately — runs alongside Branch A.
    // setResetKey (counters) and bg color anims fire via setTimeout
    // matched to the same moment the parallel starts, since they need
    // the JS thread and cannot live inside an Animated chain.
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
      // Card is on screen. Split here — bars animate in parallel with note + trust.
      Animated.parallel([
        // Branch A: remaining UI elements
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
        // Branch B: progress bars — non-native required for width %
        Animated.stagger(
          120,
          barAnims.map((anim) =>
            Animated.timing(anim, {
              toValue: 1,
              duration: 900,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: false,
            }),
          ),
        ),
      ]),
    ]).start();

    // Counters and bg anims fire via setTimeout timed to match
    // when the Animated.parallel above starts (after cardAnim lands).
    // Approximate time to reach the parallel branch:
    // eyebrow spring (~400ms) + 40 + h1 spring (~400ms) + 30
    // + h2 spring (~400ms) + 30 + subtitle 300ms + 100
    // + card spring (~500ms) + 80 = ~2280ms
    const parallelStart = 2280;

    const counterTimer = setTimeout(() => {
      setResetKey((k) => k + 1);
    }, parallelStart);

    const fatTimer = setTimeout(() => {
      Animated.timing(fatBgAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }, parallelStart + 400);

    const proteinTimer = setTimeout(() => {
      Animated.timing(proteinBgAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }, parallelStart + 750);

    return () => {
      clearTimeout(counterTimer);
      clearTimeout(fatTimer);
      clearTimeout(proteinTimer);
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
            <Text style={s.eyebrowText}>MACROS TRACKER</Text>
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
            Master your macros,
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
            stay balanced.
          </Animated.Text>
        </View>

        <Animated.View
          style={[
            s.outerCard,
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
          <View style={s.cardHeader}>
            <Text style={s.cardHeaderText}>Macros Facts</Text>
          </View>

          <View style={s.innerCard}>
            {MACROS.map((macro, i) => (
              <MacroRow
                key={macro.label}
                label={macro.label}
                value={macro.value}
                goal={macro.goal}
                barColor={macro.barColor}
                isOver={"isOver" in macro ? macro.isOver : false}
                isLow={"isLow" in macro ? macro.isLow : false}
                barAnim={barAnims[i]}
                elevated={"isLow" in macro && macro.isLow}
                resetKey={resetKey}
                bgAnim={
                  "isLow" in macro && macro.isLow
                    ? proteinBgAnim
                    : "isOver" in macro && macro.isOver
                      ? fatBgAnim
                      : undefined
                }
              />
            ))}
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

  outerCard: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: SPACING.sm,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 8,
    borderColor: "#F47B20",
    width: "100%",
  },
  cardHeader: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cardHeaderText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  innerCard: {
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: 320,
    flexDirection: "column",
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
    marginBottom: SPACING.sm,
  },
  noteText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark,
    lineHeight: 22,
    paddingRight: SPACING.sm,
  },
  noteHighlight: {
    color: COLORS.primary,
    fontWeight: "800",
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
