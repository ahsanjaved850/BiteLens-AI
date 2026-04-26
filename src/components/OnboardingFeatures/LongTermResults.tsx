import {
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

// ────────────────────────────────────────────────────────────────────
// Long-Term Results — Restricted Diet vs BiteLens Meal Plan
// Based on competitor's comparison slide, adapted to BiteLens brand
// ────────────────────────────────────────────────────────────────────

const CONTENT = {
  title: "BiteLens delivers\nlong-term results that\nfit your life",
  restricted: {
    title: "Restricted\nDiet",
    points: [
      "Only temporary results",
      "Ignores your needs",
      "Unpleasant food to stick with",
      "Eating the same food repeatedly",
    ],
  },
  bitelens: {
    title: "BiteLens\nMeal Plan",
    points: [
      "Achieves long-lasting results",
      "Tailored to your lifestyle",
      "Healthy and delicious meals",
      "Diverse and flexible meal planning",
    ],
  },
} as const;

export const LongTermResults: React.FC = () => {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const leftAnim = useRef(new Animated.Value(0)).current;
  const rightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(leftAnim, {
        toValue: 1,
        tension: 50,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.spring(rightAnim, {
        toValue: 1,
        tension: 50,
        friction: 9,
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
          <Text style={styles.headerTitle}>{CONTENT.title}</Text>
        </Animated.View>

        {/* Comparison Cards */}
        <View style={styles.compRow}>
          {/* Restricted Diet — Bad */}
          <Animated.View
            style={[
              styles.cardBad,
              {
                opacity: leftAnim,
                transform: [
                  {
                    translateX: leftAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.cardTitleBad}>{CONTENT.restricted.title}</Text>
            {CONTENT.restricted.points.map((point, i) => (
              <View key={i} style={styles.pointRow}>
                <Text style={styles.pointX}>✕</Text>
                <Text style={styles.pointTextBad}>{point}</Text>
              </View>
            ))}
            <Text style={styles.cardEmoji}>😕</Text>
          </Animated.View>

          {/* BiteLens — Good */}
          <Animated.View
            style={[
              styles.cardGood,
              {
                opacity: rightAnim,
                transform: [
                  {
                    translateX: rightAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.cardTitleGood}>{CONTENT.bitelens.title}</Text>
            {CONTENT.bitelens.points.map((point, i) => (
              <View key={i} style={styles.pointRow}>
                <Text style={styles.pointCheck}>✓</Text>
                <Text style={styles.pointTextGood}>{point}</Text>
              </View>
            ))}
            <Text style={styles.cardEmoji}>😊</Text>
            <View style={styles.heartBadge}>
              <Text style={styles.heartText}>❤️</Text>
            </View>
          </Animated.View>
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
    justifyContent: "center",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textDark,
    textAlign: "center",
    lineHeight: 36,
  },
  compRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },

  // Bad card
  cardBad: {
    flex: 1,
    backgroundColor: "#FFF0ED",
    borderRadius: 20,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  cardTitleBad: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  pointX: {
    fontSize: 12,
    color: "#FF4757",
    marginRight: 6,
    fontWeight: "700",
  },
  pointTextBad: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 18,
  },

  // Good card
  cardGood: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
    ...SHADOWS.small,
  },
  cardTitleGood: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  pointCheck: {
    fontSize: 12,
    color: COLORS.success,
    marginRight: 6,
    fontWeight: "700",
  },
  pointTextGood: {
    ...TYPOGRAPHY.small,
    color: COLORS.textDark,
    fontWeight: "500",
    flex: 1,
    lineHeight: 18,
  },

  // Shared
  pointRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardEmoji: {
    fontSize: 36,
    alignSelf: "center",
    marginTop: SPACING.md,
  },
  heartBadge: {
    position: "absolute",
    top: SPACING.md,
    right: SPACING.md,
  },
  heartText: {
    fontSize: 18,
  },
});
