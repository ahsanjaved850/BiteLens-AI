import {
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "@/src/Screens/Onboarding/Onboarding.style";
import { getSelectedBirthYear } from "@/src/components/OnboardingFeatures/BirthYearPicker";
import { getGlobalCurrentWeight } from "@/src/components/OnboardingFeatures/CurrentWeight";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

// ────────────────────────────────────────────────────────────────────
// Content
// ────────────────────────────────────────────────────────────────────
const CONTENT = {
  preTitle: "Built just for you",
  title: "Your personalized\ndaily plan",
  subtitle: "Based on your body stats and goals",
} as const;

// ────────────────────────────────────────────────────────────────────
// Basic TDEE / Macro calculator (Mifflin-St Jeor)
// In production, this should come from your backend AI
// ────────────────────────────────────────────────────────────────────
function calculatePlan(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: string,
  goal: string
) {
  let bmr: number;
  if (gender === "Female") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }

  const tdee = Math.round(bmr * 1.55);

  let targetCal: number;
  if (goal === "Lose") {
    targetCal = Math.round(tdee - 500);
  } else if (goal === "Gain") {
    targetCal = Math.round(tdee + 350);
  } else {
    targetCal = tdee;
  }

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

// ────────────────────────────────────────────────────────────────────
// Animated Macro Card
// ────────────────────────────────────────────────────────────────────
const MacroCard: React.FC<{
  label: string;
  value: number;
  unit: string;
  color: string;
  delay: number;
}> = ({ label, value, unit, color, delay }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        macroStyles.card,
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
      <View style={[macroStyles.dot, { backgroundColor: color }]} />
      <Text style={macroStyles.value}>
        {value}
        <Text style={macroStyles.unit}>{unit}</Text>
      </Text>
      <Text style={macroStyles.label}>{label}</Text>
    </Animated.View>
  );
};

const macroStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 16,
    padding: SPACING.md,
    alignItems: "center",
    ...SHADOWS.small,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  unit: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textLight,
  },
  label: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: "600",
  },
});

// ────────────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────────────
export const PersonalizedPlan: React.FC = () => {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const calAnim = useRef(new Animated.Value(0)).current;
  const detailAnim = useRef(new Animated.Value(0)).current;

  const currentWeight = getGlobalCurrentWeight() || 78;
  const birthYear = getSelectedBirthYear() || 2000;
  const age = new Date().getFullYear() - birthYear;

  const gender = "Male";
  const goal = "Lose";
  const heightCm = 170;

  const plan = calculatePlan(currentWeight, heightCm, age, gender, goal);

  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(calAnim, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(detailAnim, {
        toValue: 1,
        duration: 500,
        delay: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.screenContainer}>
        {/* Header */}
        <Animated.View
          style={[
            styles.headerSection,
            {
              opacity: headerAnim,
              transform: [
                {
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.preTitle}>{CONTENT.preTitle}</Text>
          <Text style={styles.headerTitle}>{CONTENT.title}</Text>
          <Text style={styles.subtitle}>{CONTENT.subtitle}</Text>
        </Animated.View>

        {/* Calorie Hero Card */}
        <Animated.View
          style={[
            styles.calorieCard,
            {
              opacity: calAnim,
              transform: [
                {
                  scale: calAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.calLabel}>Daily Calorie Target</Text>
          <View style={styles.calValueRow}>
            <Text style={styles.calValue}>{plan.calories}</Text>
            <Text style={styles.calUnit}>kcal</Text>
          </View>
          <View style={styles.calBadge}>
            <Text style={styles.calBadgeText}>
              {goal === "Lose"
                ? "Healthy deficit for steady progress"
                : goal === "Gain"
                ? "Clean surplus for lean gains"
                : "Maintenance for your body"}
            </Text>
          </View>
        </Animated.View>

        {/* Macro Cards */}
        <Animated.View style={[styles.macroRow, { opacity: detailAnim }]}>
          <MacroCard label="Protein" value={plan.protein} unit="g" color="#2196F3" delay={1000} />
          <MacroCard label="Carbs" value={plan.carbs} unit="g" color="#8BC34A" delay={1150} />
          <MacroCard label="Fat" value={plan.fat} unit="g" color="#F5A623" delay={1300} />
        </Animated.View>

        {/* Body Stats Row */}
        <Animated.View style={[styles.statsCard, { opacity: detailAnim }]}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{plan.bmi}</Text>
            <Text style={styles.statLabel}>BMI</Text>
            <View
              style={[
                styles.statBadge,
                {
                  backgroundColor:
                    plan.bmiCategory === "Normal"
                      ? COLORS.success
                      : plan.bmiCategory === "Overweight"
                      ? "#F5A623"
                      : plan.bmiCategory === "Obese"
                      ? "#FF4757"
                      : "#2196F3",
                },
              ]}
            >
              <Text style={styles.statBadgeText}>{plan.bmiCategory}</Text>
            </View>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{plan.waterL}L</Text>
            <Text style={styles.statLabel}>Daily Water</Text>
            <View style={[styles.statBadge, { backgroundColor: "#2196F3" }]}>
              <Text style={styles.statBadgeText}>Recommended</Text>
            </View>
          </View>
        </Animated.View>

        {/* Reassurance */}
        <Animated.View style={[styles.reassurance, { opacity: detailAnim }]}>
          <Text style={styles.reassuranceText}>
            These targets adapt as you progress — no rigid numbers
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

// ────────────────────────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  headerSection: {
    alignItems: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  preTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: "700",
    marginBottom: SPACING.xs,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textDark,
    textAlign: "center",
    lineHeight: 36,
  },
  subtitle: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.sm,
  },
  calorieCard: {
    backgroundColor: COLORS.accent,
    borderRadius: 24,
    padding: SPACING.xl,
    alignItems: "center",
    ...SHADOWS.medium,
  },
  calLabel: {
    ...TYPOGRAPHY.body,
    color: "rgba(255,255,255,0.8)",
    marginBottom: SPACING.xs,
  },
  calValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  calValue: {
    fontSize: 56,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: -2,
  },
  calUnit: {
    fontSize: 20,
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
    marginLeft: 6,
  },
  calBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: SPACING.sm,
  },
  calBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.white,
  },
  macroRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  statsCard: {
    flexDirection: "row",
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 20,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    ...SHADOWS.small,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  statLabel: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 6,
  },
  statBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: SPACING.md,
  },
  reassurance: {
    alignItems: "center",
    marginTop: SPACING.lg,
  },
  reassuranceText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
