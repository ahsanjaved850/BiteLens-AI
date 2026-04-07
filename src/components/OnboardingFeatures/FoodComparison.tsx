import {
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";

const CONTENT = {
  title: "Learn to make better\nfood choices",
  subtitle: "same Cal different result",
  leftCard: {
    calories: "590 cal",
    title: "That one drink",
    points: [
      { icon: "❌", text: "Quick hunger" },
      { icon: "❌", text: "Low nutrients" },
      { icon: "❌", text: "Crashes energy" },
    ],
  },
  rightCard: {
    calories: "590 cal",
    title: "An entire meal",
    points: [
      { icon: "✅", text: "High satiety" },
      { icon: "✅", text: "Rich nutrients" },
      { icon: "✅", text: "Boosts energy" },
    ],
  },
} as const;

export const FoodComparison: React.FC = () => {
  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.screenContainer}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>{CONTENT.title}</Text>
          <Text style={styles.subtitle}>{CONTENT.subtitle}</Text>
        </View>

        {/* Comparison Cards */}
        <View style={styles.cardsContainer}>
          {/* Left Card - Bad */}
          <View style={styles.cardNegative}>
            <View style={styles.calBadge}>
              <Text style={styles.calBadgeText}>
                {CONTENT.leftCard.calories}
              </Text>
            </View>
            <Text style={styles.drinkEmoji}>🥤</Text>
            <Text style={styles.cardTitle}>{CONTENT.leftCard.title}</Text>
            {CONTENT.leftCard.points.map((point, index) => (
              <View key={index} style={styles.pointRow}>
                <Text style={styles.pointIcon}>{point.icon}</Text>
                <Text style={styles.pointText}>{point.text}</Text>
              </View>
            ))}
          </View>

          {/* Arrow */}
          <View style={styles.arrowContainer}>
            <Text style={styles.arrowText}>➡️</Text>
          </View>

          {/* Right Card - Good */}
          <View style={styles.cardPositive}>
            <View style={[styles.calBadge, styles.calBadgeGood]}>
              <Text style={styles.calBadgeText}>
                {CONTENT.rightCard.calories}
              </Text>
            </View>
            <Text style={styles.mealEmoji}>🥗</Text>
            <Text style={styles.cardTitle}>{CONTENT.rightCard.title}</Text>
            {CONTENT.rightCard.points.map((point, index) => (
              <View key={index} style={styles.pointRow}>
                <Text style={styles.pointIcon}>{point.icon}</Text>
                <Text style={styles.pointText}>{point.text}</Text>
              </View>
            ))}
          </View>
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
  subtitle: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.textDark,
    textAlign: "center",
    marginTop: SPACING.xs,
  },
  cardsContainer: {
    flexDirection: "row",
    gap: SPACING.sm,
    alignItems: "center",
  },
  cardNegative: {
    flex: 1,
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 20,
    padding: SPACING.md,
    alignItems: "center",
    ...SHADOWS.small,
  },
  cardPositive: {
    flex: 1,
    backgroundColor: "#FFF3CD",
    borderRadius: 20,
    padding: SPACING.md,
    alignItems: "center",
    ...SHADOWS.small,
  },
  calBadge: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: SPACING.sm,
  },
  calBadgeGood: {
    backgroundColor: COLORS.accent,
  },
  calBadgeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    fontWeight: "700",
  },
  drinkEmoji: {
    fontSize: 56,
    marginBottom: SPACING.sm,
  },
  mealEmoji: {
    fontSize: 56,
    marginBottom: SPACING.sm,
  },
  cardTitle: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  pointRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    alignSelf: "flex-start",
    paddingLeft: SPACING.xs,
  },
  pointIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  pointText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
  },
  arrowContainer: {
    position: "absolute",
    left: "50%",
    marginLeft: -16,
    zIndex: 1,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.backgroundCard,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.small,
  },
  arrowText: {
    fontSize: 16,
  },
  sourceContainer: {
    alignItems: "center",
    marginTop: SPACING.xl,
  },
  sourceText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textLight,
    textDecorationLine: "underline",
  },
});
