import {
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";

type CompletionProps = {
  startAnimation?: boolean;
  onAnimationComplete?: () => void;
  isSubmitting?: boolean;
};

const STEPS = [
  "Analyzing your profile",
  "Building your calorie target",
  "Calculating your macros",
];

export const Completion: React.FC<CompletionProps> = ({
  startAnimation = false,
  onAnimationComplete,
  isSubmitting = false,
}) => {
  const progress1 = useRef(new Animated.Value(0)).current;
  const progress2 = useRef(new Animated.Value(0)).current;
  const progress3 = useRef(new Animated.Value(0)).current;

  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [step3Done, setStep3Done] = useState(false);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!startAnimation || hasStartedRef.current) return;

    hasStartedRef.current = true;

    const runSequence = async () => {
      await animateStep(progress1, () => setStep1Done(true));
      await animateStep(progress2, () => setStep2Done(true));
      await animateStep(progress3, () => setStep3Done(true));

      onAnimationComplete?.();
    };

    runSequence();
  }, [startAnimation]);

  const animateStep = (
    animatedValue: Animated.Value,
    onDone: () => void
  ): Promise<void> => {
    return new Promise((resolve) => {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start(() => {
        onDone();
        setTimeout(resolve, 250);
      });
    });
  };

  const renderStep = (
    label: string,
    progress: Animated.Value,
    done: boolean
  ) => {
    const widthInterpolated = progress.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "100%"],
    });

    return (
      <View style={styles.stepCard}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepLabel}>{label}</Text>
          <View style={[styles.statusBadge, done && styles.statusBadgeDone]}>
            {done ? (
              <Text style={styles.statusCheck}>✓</Text>
            ) : (
              <ActivityIndicator size="small" color={COLORS.primary} />
            )}
          </View>
        </View>

        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: widthInterpolated }]} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Creating your plan</Text>
        <Text style={styles.subtitle}>
          We’re personalizing NutriTrack based on your body stats and goal.
        </Text>
      </View>

      <View style={styles.stepsContainer}>
        {renderStep(STEPS[0], progress1, step1Done)}
        {renderStep(STEPS[1], progress2, step2Done)}
        {renderStep(STEPS[2], progress3, step3Done)}
      </View>

      <Text style={styles.footerText}>
        {isSubmitting
          ? "Saving your plan and preparing your dashboard..."
          : "This only takes a moment."}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  hero: {
    marginBottom: SPACING.xl,
    alignItems: "center",
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  stepsContainer: {
    gap: SPACING.md,
  },
  stepCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 20,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  stepLabel: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.textDark,
    flex: 1,
    marginRight: SPACING.md,
  },
  statusBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadgeDone: {
    backgroundColor: COLORS.success,
  },
  statusCheck: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
  progressTrack: {
    height: 10,
    backgroundColor: COLORS.border,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },
  footerText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: SPACING.xl,
  },
});