import {
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "@/src/Screens/Onboarding/Onboarding.style";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SW } = Dimensions.get("window");

// ────────────────────────────────────────────────────────────────────
// "Do you relate?" Statements — User taps Yes/No
// Based on competitor's relatable pain-point cards
// Each statement validates a key user pain, building empathy
// ────────────────────────────────────────────────────────────────────

const STATEMENTS = [
  {
    text: "Junk food is my guilty pleasure. I always regret it after indulging.",
    emoji: "🍩",
    bgColor: "#F3E8FF",
    accentColor: "#9B59B6",
  },
  {
    text: "I always throw in the towel when diet meal prep gets too tricky.",
    emoji: "🍝",
    bgColor: "#E8F5E9",
    accentColor: "#2ECC71",
  },
  {
    text: "I want to lose weight but I don't know what to eat.",
    emoji: "🤔",
    bgColor: "#E3F2FD",
    accentColor: "#3498DB",
  },
  {
    text: "I always feel unsatisfied with my body when I look in the mirror.",
    emoji: "🪞",
    bgColor: "#FFF8E1",
    accentColor: "#F5A623",
  },
] as const;

interface RelateStatementsProps {
  onValidationChange?: (isValid: boolean) => void;
}

export const RelateStatements: React.FC<RelateStatementsProps> = ({
  onValidationChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const cardAnim = useRef(new Animated.Value(0)).current;

  const isComplete = currentIndex >= STATEMENTS.length;
  const currentStatement = STATEMENTS[currentIndex];

  useEffect(() => {
    onValidationChange?.(isComplete);
  }, [isComplete]);

  // Animate card entrance
  useEffect(() => {
    if (!isComplete) {
      cardAnim.setValue(0);
      Animated.spring(cardAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [currentIndex]);

  const handleAnswer = useCallback(
    async (answer: boolean) => {
      await Haptics.impactAsync(
        answer
          ? Haptics.ImpactFeedbackStyle.Medium
          : Haptics.ImpactFeedbackStyle.Light
      );

      setAnswers((prev) => ({ ...prev, [currentIndex]: answer }));

      // Animate card exit
      Animated.timing(cardAnim, {
        toValue: 2,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex((prev) => prev + 1);
      });
    },
    [currentIndex, cardAnim]
  );

  // Progress dots
  const progressDots = STATEMENTS.map((_, i) => {
    const isAnswered = i < currentIndex;
    const isCurrent = i === currentIndex;
    return (
      <View
        key={i}
        style={[
          styles.progressDot,
          isAnswered && styles.progressDotDone,
          isCurrent && styles.progressDotActive,
        ]}
      />
    );
  });

  if (isComplete) {
    // Summary view
    const yesCount = Object.values(answers).filter(Boolean).length;
    return (
      <View style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryEmoji}>💡</Text>
          <Text style={styles.summaryTitle}>We understand you.</Text>
          <Text style={styles.summarySubtitle}>
            {yesCount >= 3
              ? "You're not alone — most of our users relate to these struggles. BiteLens was built to fix every one of them."
              : yesCount >= 1
              ? "Everyone's journey is different. BiteLens adapts to your specific challenges."
              : "Great — you're already ahead! BiteLens will help you stay on track effortlessly."}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.screenContainer}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Do you relate to the{"\n"}statement below?</Text>
          <View style={styles.progressRow}>{progressDots}</View>
        </View>

        {/* Statement Card */}
        <Animated.View
          style={[
            styles.statementCard,
            { backgroundColor: currentStatement.bgColor },
            {
              opacity: cardAnim.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0, 1, 0],
              }),
              transform: [
                {
                  scale: cardAnim.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [0.9, 1, 0.9],
                  }),
                },
                {
                  translateY: cardAnim.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [30, 0, -30],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Quote marks */}
          <Text style={[styles.quoteMark, { color: currentStatement.accentColor }]}>
            "
          </Text>
          <Text style={styles.statementText}>{currentStatement.text}</Text>
          <Text style={styles.statementEmoji}>{currentStatement.emoji}</Text>
        </Animated.View>

        {/* Yes / No Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.noButton}
            onPress={() => handleAnswer(false)}
            activeOpacity={0.7}
          >
            <Text style={styles.noButtonText}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.yesButton}
            onPress={() => handleAnswer(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.yesButtonText}>Yes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textDark,
    textAlign: "center",
    lineHeight: 36,
  },
  progressRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: SPACING.md,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.borderLight,
  },
  progressDotDone: {
    backgroundColor: COLORS.primary,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
    borderRadius: 5,
  },

  // Statement Card
  statementCard: {
    flex: 1,
    borderRadius: 24,
    padding: SPACING.xl,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.xl,
    ...SHADOWS.medium,
  },
  quoteMark: {
    fontSize: 64,
    fontWeight: "900",
    position: "absolute",
    top: SPACING.lg,
    left: SPACING.lg,
    opacity: 0.4,
    lineHeight: 64,
  },
  statementText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textDark,
    textAlign: "center",
    lineHeight: 28,
    marginBottom: SPACING.xl,
  },
  statementEmoji: {
    fontSize: 72,
  },

  // Buttons
  buttonRow: {
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  noButton: {
    flex: 1,
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  noButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  yesButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    ...SHADOWS.small,
  },
  yesButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.white,
  },

  // Summary
  summaryContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
  },
  summaryEmoji: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  summaryTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  summarySubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
});
