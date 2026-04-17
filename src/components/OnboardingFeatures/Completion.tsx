import {
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: SW } = Dimensions.get("window");

// ────────────────────────────────────────────────────────────────────
// Props (unchanged — drop-in replacement)
// ────────────────────────────────────────────────────────────────────
type CompletionProps = {
  startAnimation?: boolean;
  onAnimationComplete?: () => void;
  isSubmitting?: boolean;
};

// ────────────────────────────────────────────────────────────────────
// Config
// ────────────────────────────────────────────────────────────────────
const STEPS = [
  { label: "Analyzing your profile", emoji: "🔍", duration: 1200 },
  { label: "Building your calorie target", emoji: "🎯", duration: 1400 },
  { label: "Calculating your macros", emoji: "⚡", duration: 1000 },
];

const PROMISES = [
  { emoji: "📸", title: "AI-powered logging", desc: "Snap a photo, get instant macros" },
  { emoji: "📊", title: "Adaptive targets", desc: "Goals that evolve with your progress" },
  { emoji: "🧠", title: "Smart coaching", desc: "Weekly insights, not daily guilt" },
];

const PARTICLE_COLORS = [
  COLORS.primary, COLORS.success, COLORS.accentBlue,
  "#FF6B6B", COLORS.primaryMuted, "#8BC34A",
];

// ────────────────────────────────────────────────────────────────────
// Utility
// ────────────────────────────────────────────────────────────────────
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ────────────────────────────────────────────────────────────────────
// Confetti Particle
// ────────────────────────────────────────────────────────────────────
const ConfettiParticle: React.FC<{
  delay: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
}> = ({ delay, angle, distance, size, color }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 800,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const rad = (angle * Math.PI) / 180;
  const tx = Math.cos(rad) * distance;
  const ty = Math.sin(rad) * distance;

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: anim.interpolate({
          inputRange: [0, 0.6, 1],
          outputRange: [0, 1, 0],
        }),
        transform: [
          { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [0, tx] }) },
          { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, ty] }) },
          { scale: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1.2, 0.6] }) },
        ],
      }}
    />
  );
};

// ────────────────────────────────────────────────────────────────────
// Step Card (loading phase)
// ────────────────────────────────────────────────────────────────────
const StepCard: React.FC<{
  label: string;
  emoji: string;
  progress: Animated.Value;
  done: boolean;
  visible: boolean;
}> = ({ label, emoji, progress, done, visible }) => {
  const entranceAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(entranceAnim, {
        toValue: 1,
        tension: 55,
        friction: 9,
        useNativeDriver: true,
      }).start();
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [visible]);

  useEffect(() => {
    if (done) {
      Animated.spring(checkAnim, {
        toValue: 1,
        tension: 100,
        friction: 6,
        useNativeDriver: true,
      }).start();
    }
  }, [done]);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Animated.View
      style={[
        s.stepCard,
        done && s.stepCardDone,
        {
          opacity: entranceAnim,
          transform: [
            { translateY: entranceAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
            { scale: entranceAnim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) },
          ],
        },
      ]}
    >
      <View style={s.stepRow}>
        <View style={s.stepEmojiWrap}>
          <Text style={s.stepEmoji}>{emoji}</Text>
        </View>
        <View style={s.stepContent}>
          <Text style={[s.stepLabel, done && s.stepLabelDone]}>{label}</Text>
          <View style={s.progressTrack}>
            <Animated.View
              style={[s.progressFill, { width: widthInterpolated }, done && s.progressFillDone]}
            />
            {!done && (
              <Animated.View
                style={[
                  s.shimmer,
                  {
                    transform: [
                      {
                        translateX: shimmerAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-100, SW * 0.7],
                        }),
                      },
                    ],
                  },
                ]}
              />
            )}
          </View>
        </View>
        <Animated.View
          style={[
            s.statusBadge,
            done && s.statusBadgeDone,
            {
              transform: [
                {
                  scale: done
                    ? checkAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] })
                    : 1,
                },
              ],
            },
          ]}
        >
          {done ? (
            <Text style={s.statusCheck}>✓</Text>
          ) : (
            <Animated.View
              style={[
                s.spinner,
                {
                  transform: [
                    {
                      rotate: shimmerAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                },
              ]}
            />
          )}
        </Animated.View>
      </View>
    </Animated.View>
  );
};

// ────────────────────────────────────────────────────────────────────
// Success Celebration
// ────────────────────────────────────────────────────────────────────
const SuccessCelebration: React.FC<{ onFinished: () => void }> = ({ onFinished }) => {
  const circleAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const subAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(circleAnim, { toValue: 1, tension: 40, friction: 6, useNativeDriver: true }),
      Animated.spring(checkAnim, { toValue: 1, tension: 80, friction: 5, useNativeDriver: true }),
      Animated.timing(textAnim, { toValue: 1, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(subAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start(() => setTimeout(onFinished, 1000));
  }, []);

  const particles = Array.from({ length: 18 }).map((_, i) => ({
    angle: i * 20,
    distance: 80 + Math.random() * 60,
    size: 6 + Math.random() * 8,
    color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    delay: 100 + i * 40,
  }));

  return (
    <View style={s.celebrationContainer}>
      <View style={s.glowCircle} />
      <View style={s.particleContainer}>
        {particles.map((p, i) => (
          <ConfettiParticle key={i} {...p} />
        ))}
      </View>
      <Animated.View
        style={[
          s.successCircle,
          {
            transform: [{ scale: circleAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) }],
            opacity: circleAnim,
          },
        ]}
      >
        <Animated.Text
          style={[
            s.successCheck,
            {
              transform: [
                { scale: checkAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) },
                { rotate: checkAnim.interpolate({ inputRange: [0, 1], outputRange: ["-30deg", "0deg"] }) },
              ],
              opacity: checkAnim,
            },
          ]}
        >
          ✓
        </Animated.Text>
      </Animated.View>
      <Animated.View
        style={{
          opacity: textAnim,
          transform: [{ translateY: textAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
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

// ────────────────────────────────────────────────────────────────────
// Ready Screen (shown BEFORE user taps "Get Started")
// ────────────────────────────────────────────────────────────────────
const ReadyScreen: React.FC = () => {
  const heroAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = PROMISES.map(() => useRef(new Animated.Value(0)).current);
  const footerAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Hero entrance
    Animated.timing(heroAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Stagger promise cards
    Animated.stagger(
      150,
      cardAnims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          tension: 50,
          friction: 9,
          delay: 400,
          useNativeDriver: true,
        })
      )
    ).start();

    // Footer
    Animated.timing(footerAnim, {
      toValue: 1,
      duration: 400,
      delay: 900,
      useNativeDriver: true,
    }).start();

    // Pulsing arrow
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={s.readyContainer}>
      {/* Hero */}
      <Animated.View
        style={[
          s.readyHero,
          {
            opacity: heroAnim,
            transform: [
              { translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
            ],
          },
        ]}
      >
        <View style={s.readyEmojiWrap}>
          <Text style={s.readyEmojiText}>🚀</Text>
        </View>
        <Text style={s.readyTitle}>Ready to transform{"\n"}your nutrition?</Text>
        <Text style={s.readySubtitle}>
          Here's what NutriTrack will build for you
        </Text>
      </Animated.View>

      {/* Promise cards */}
      <View style={s.promiseContainer}>
        {PROMISES.map((item, index) => (
          <Animated.View
            key={index}
            style={[
              s.promiseCard,
              {
                opacity: cardAnims[index],
                transform: [
                  {
                    translateY: cardAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [24, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={s.promiseEmojiWrap}>
              <Text style={s.promiseEmoji}>{item.emoji}</Text>
            </View>
            <View style={s.promiseContent}>
              <Text style={s.promiseTitle}>{item.title}</Text>
              <Text style={s.promiseDesc}>{item.desc}</Text>
            </View>
            <View style={s.promiseCheckWrap}>
              <Text style={s.promiseCheckText}>✓</Text>
            </View>
          </Animated.View>
        ))}
      </View>

      {/* Footer nudge */}
      <Animated.View
        style={[
          s.readyFooter,
          {
            opacity: footerAnim,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <Text style={s.readyFooterText}>
          Tap{" "}
          <Text style={s.readyFooterBold}>Get Started</Text>
          {" "}to begin ↓
        </Text>
      </Animated.View>
    </View>
  );
};

// ────────────────────────────────────────────────────────────────────
// Main Completion Component
// ────────────────────────────────────────────────────────────────────
export const Completion: React.FC<CompletionProps> = ({
  startAnimation = false,
  onAnimationComplete,
  isSubmitting = false,
}) => {
  // Phase tracking
  const [phase, setPhase] = useState<"ready" | "loading" | "celebration">("ready");

  // Cross-fade between ready → loading
  const readyOpacity = useRef(new Animated.Value(1)).current;
  const loadingOpacity = useRef(new Animated.Value(0)).current;

  // Step progress
  const progress1 = useRef(new Animated.Value(0)).current;
  const progress2 = useRef(new Animated.Value(0)).current;
  const progress3 = useRef(new Animated.Value(0)).current;

  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [step3Done, setStep3Done] = useState(false);
  const [step1Visible, setStep1Visible] = useState(false);
  const [step2Visible, setStep2Visible] = useState(false);
  const [step3Visible, setStep3Visible] = useState(false);
  const [allDone, setAllDone] = useState(false);

  const loadingFadeOut = useRef(new Animated.Value(1)).current;
  const heroAnim = useRef(new Animated.Value(0)).current;
  const hasStartedRef = useRef(false);

  // ── Trigger: user tapped "Get Started" ──
  useEffect(() => {
    if (!startAnimation || hasStartedRef.current) return;
    hasStartedRef.current = true;

    const runSequence = async () => {
      // 1. Cross-fade: Ready → Loading
      setPhase("loading");
      Animated.parallel([
        Animated.timing(readyOpacity, {
          toValue: 0,
          duration: 350,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(loadingOpacity, {
          toValue: 1,
          duration: 400,
          delay: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      await wait(400);

      // 2. Hero text entrance
      await new Promise<void>((resolve) => {
        Animated.timing(heroAnim, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start(() => resolve());
      });

      await wait(200);

      // 3. Steps — one at a time
      setStep1Visible(true);
      await wait(300);
      await animateStep(progress1, STEPS[0].duration, () => setStep1Done(true));
      await wait(350);

      setStep2Visible(true);
      await wait(300);
      await animateStep(progress2, STEPS[1].duration, () => setStep2Done(true));
      await wait(350);

      setStep3Visible(true);
      await wait(300);
      await animateStep(progress3, STEPS[2].duration, () => setStep3Done(true));
      await wait(400);

      // 4. Fade out loading → show celebration
      setAllDone(true);
      await new Promise<void>((resolve) => {
        Animated.timing(loadingFadeOut, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }).start(() => resolve());
      });

      setPhase("celebration");
    };

    runSequence();
  }, [startAnimation]);

  const animateStep = (
    animatedValue: Animated.Value,
    duration: number,
    onDone: () => void
  ): Promise<void> => {
    return new Promise((resolve) => {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0.7,
          duration: duration * 0.5,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: duration * 0.5,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]).start(() => {
        onDone();
        resolve();
      });
    });
  };

  // ── Phase: Celebration ──
  if (phase === "celebration") {
    return (
      <SuccessCelebration onFinished={() => onAnimationComplete?.()} />
    );
  }

  // ── Phase: Ready + Loading (layered with cross-fade) ──
  return (
    <View style={s.container}>
      {/* Ready screen (visible initially, fades out on tap) */}
      {(phase === "ready" || phase === "loading") && (
        <Animated.View
          style={[s.phaseLayer, { opacity: readyOpacity }]}
          pointerEvents={phase === "ready" ? "auto" : "none"}
        >
          <ReadyScreen />
        </Animated.View>
      )}

      {/* Loading screen (fades in after tap) */}
      {phase === "loading" && (
        <Animated.View
          style={[s.phaseLayer, { opacity: Animated.multiply(loadingOpacity, loadingFadeOut) }]}
        >
          <View style={s.loadingInner}>
            {/* Hero */}
            <Animated.View
              style={[
                s.loadingHero,
                {
                  opacity: heroAnim,
                  transform: [
                    { translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
                  ],
                },
              ]}
            >
              <View style={s.loadingEmojiWrap}>
                <Text style={s.loadingEmoji}>✨</Text>
              </View>
              <Text style={s.loadingTitle}>Creating your plan</Text>
              <Text style={s.loadingSubtitle}>
                Personalizing NutriTrack based on{"\n"}your body and goals
              </Text>
            </Animated.View>

            {/* Steps */}
            <View style={s.stepsContainer}>
              <StepCard
                label={STEPS[0].label}
                emoji={STEPS[0].emoji}
                progress={progress1}
                done={step1Done}
                visible={step1Visible}
              />
              <StepCard
                label={STEPS[1].label}
                emoji={STEPS[1].emoji}
                progress={progress2}
                done={step2Done}
                visible={step2Visible}
              />
              <StepCard
                label={STEPS[2].label}
                emoji={STEPS[2].emoji}
                progress={progress3}
                done={step3Done}
                visible={step3Visible}
              />
            </View>

            {/* Footer */}
            <Text style={s.loadingFooter}>
              {isSubmitting
                ? "Almost there..."
                : allDone
                ? "Finishing up..."
                : "This only takes a moment"}
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

// ────────────────────────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  /* ── Layout ── */
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  phaseLayer: {
    ...StyleSheet.absoluteFillObject,
  },

  /* ── Ready Screen ── */
  readyContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: "center",
  },
  readyHero: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  readyEmojiWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.lg,
    borderWidth: 3,
    borderColor: COLORS.primaryMuted,
  },
  readyEmojiText: {
    fontSize: 40,
  },
  readyTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textDark,
    textAlign: "center",
    lineHeight: 36,
    marginBottom: SPACING.sm,
  },
  readySubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  /* ── Promise Cards ── */
  promiseContainer: {
    gap: SPACING.sm + 2,
    marginBottom: SPACING.xl,
  },
  promiseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 18,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  promiseEmojiWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  promiseEmoji: {
    fontSize: 20,
  },
  promiseContent: {
    flex: 1,
  },
  promiseTitle: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.textDark,
    marginBottom: 2,
  },
  promiseDesc: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  promiseCheckWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.success,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: SPACING.sm,
  },
  promiseCheckText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },

  /* ── Ready Footer ── */
  readyFooter: {
    alignItems: "center",
  },
  readyFooterText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    textAlign: "center",
  },
  readyFooterBold: {
    color: COLORS.primary,
    fontWeight: "800",
  },

  /* ── Loading Screen ── */
  loadingInner: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: "center",
  },
  loadingHero: {
    alignItems: "center",
    marginBottom: SPACING.xl + SPACING.md,
  },
  loadingEmojiWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  loadingEmoji: {
    fontSize: 32,
  },
  loadingTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  loadingSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  loadingFooter: {
    ...TYPOGRAPHY.small,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: SPACING.xl,
  },

  /* ── Steps ── */
  stepsContainer: {
    gap: SPACING.md,
  },
  stepCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 20,
    padding: SPACING.md + 4,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  stepCardDone: {
    borderColor: COLORS.success,
    backgroundColor: "#F8FFF8",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepEmojiWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.backgroundGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  stepEmoji: {
    fontSize: 20,
  },
  stepContent: {
    flex: 1,
    marginRight: SPACING.md,
  },
  stepLabel: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.textDark,
    marginBottom: 8,
  },
  stepLabelDone: {
    color: COLORS.success,
  },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 4,
    overflow: "hidden",
    position: "relative",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  progressFillDone: {
    backgroundColor: COLORS.success,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 60,
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 4,
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.backgroundGray,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadgeDone: {
    backgroundColor: COLORS.success,
  },
  statusCheck: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 16,
  },
  spinner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: COLORS.border,
    borderTopColor: COLORS.primary,
  },

  /* ── Celebration ── */
  celebrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
  },
  glowCircle: {
    position: "absolute",
    width: SW * 0.8,
    height: SW * 0.8,
    borderRadius: SW * 0.4,
    backgroundColor: "rgba(46, 204, 113, 0.06)",
  },
  particleContainer: {
    position: "absolute",
    width: 0,
    height: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.success,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.xl,
    ...SHADOWS.large,
  },
  successCheck: {
    fontSize: 52,
    color: COLORS.white,
    fontWeight: "800",
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