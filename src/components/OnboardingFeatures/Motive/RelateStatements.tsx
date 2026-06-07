import {
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "@/src/Screens/Onboarding/Onboarding.style";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const STATEMENTS = [
  { image: require("@/assets/images/Onboarding/motiv2.png") },
  { image: require("@/assets/images/Onboarding/motiv3.png") },
  { image: require("@/assets/images/Onboarding/motiv1.png") },
] as const;

interface RelateStatementsProps {
  onValidationChange?: (isValid: boolean) => void;
  onComplete?: () => void;
}

export const RelateStatements: React.FC<RelateStatementsProps> = ({
  onValidationChange,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const cardAnim = useRef(new Animated.Value(0)).current;
  const isAnimatingRef = useRef(false);

  const currentStatement = STATEMENTS[currentIndex];
  const isLastStatement = currentIndex === STATEMENTS.length - 1;
  const onValidationChangeRef = useRef(onValidationChange);
  useEffect(() => {
    onValidationChangeRef.current = onValidationChange;
  }, [onValidationChange]);

  useEffect(() => {
    onValidationChangeRef.current?.(isComplete);
  }, [isComplete]);

  useEffect(() => {
    cardAnim.setValue(0);

    Animated.spring(cardAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [currentIndex, cardAnim]);

  const handleAnswer = useCallback(
    async (answer: boolean) => {
      if (isAnimatingRef.current || isComplete) return;
      isAnimatingRef.current = true;

      await Haptics.impactAsync(
        answer
          ? Haptics.ImpactFeedbackStyle.Medium
          : Haptics.ImpactFeedbackStyle.Light,
      );

      // Animate the current card out for EVERY answer, including the last one
      Animated.timing(cardAnim, {
        toValue: 2,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        isAnimatingRef.current = false;

        if (isLastStatement) {
          setIsComplete(true); // marks page valid via the existing effect
          onComplete?.(); // auto-advance — no extra Continue tap needed
          return;
        }

        setCurrentIndex((prev) => prev + 1); // fades the next image in
      });
    },
    [cardAnim, isLastStatement, isComplete, onComplete],
  );
  const progressDots = STATEMENTS.map((_, i) => {
    const isAnswered = isComplete || i < currentIndex;
    const isCurrent = !isComplete && i === currentIndex;

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

  return (
    <View style={styles.safeArea}>
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

      <View style={styles.screenContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>
            Do you relate to the{"\n"}image below?
          </Text>

          <View style={styles.progressRow}>{progressDots}</View>
        </View>

        <Animated.View
          style={[
            styles.statementCard,
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
          <Image
            source={currentStatement.image}
            style={styles.statementImage}
            resizeMode="contain"
          />
        </Animated.View>

        {!isComplete && (
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
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundGradientTop,
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
    letterSpacing: -0.8,
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
    backgroundColor: "rgba(28, 43, 54, 0.16)",
  },

  progressDotDone: {
    backgroundColor: COLORS.primary,
  },

  progressDotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
    borderRadius: 5,
  },
  statementCard: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.xl,
    backgroundColor: "transparent",
  },

  statementImage: {
    width: "120%",
    height: "100%",
  },

  buttonRow: {
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  noButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderRadius: 22,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(28, 43, 54, 0.14)",
  },

  noButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textDark,
  },

  yesButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    paddingVertical: 18,
    alignItems: "center",
    ...SHADOWS.small,
  },

  yesButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.white,
  },
});
