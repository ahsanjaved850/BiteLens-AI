import {
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY
} from "@/src/Screens/Onboarding/Onboarding.style";
import React from "react";
import { Image, StatusBar, StyleSheet, Text, View } from "react-native";

const CONTENT = {
  header: {
    title: "Snap Your Meal",
    subtitle: "AI analyzes nutrition in seconds",
  },
  image: require("@/assets/images/vegan.jpg"),
  card: {
    title: "Instant Analysis",
  },
  nutritionData: [
    { label: "Calories", value: "320 kcal", color: "#FF6B6B" },
    { label: "Carbs", value: "54g", color: "#8BC34A" },
    { label: "Protein", value: "13g", color: "#2196F3" },
    { label: "Fats", value: "5g", color: "#F5A623" },
  ],
  stats: [
    { value: "95%", label: "Accuracy" },
    { value: "10M+", label: "Foods analyzed" },
    { value: "500+", label: "Global cuisines" },
  ],
} as const;

export const Demo: React.FC = () => {
  return (
    <View style={styles.safeArea}>
      <View style={styles.screenContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>{CONTENT.header.title}</Text>
          <Text style={styles.subtitle}>{CONTENT.header.subtitle}</Text>
        </View>

        {/* Food Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={CONTENT.image}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Nutrition Card */}
        <View style={styles.nutritionCard}>
          <Text style={styles.cardTitle}>{CONTENT.card.title}</Text>
          {CONTENT.nutritionData.map((item, index) => (
            <View
              key={item.label}
              style={[
                styles.nutritionRow,
                index === CONTENT.nutritionData.length - 1 && styles.nutritionRowLast,
              ]}
            >
              <View style={styles.nutritionLabel}>
                <View style={[styles.dot, { backgroundColor: item.color }]} />
                <Text style={styles.nutritionText}>{item.label}</Text>
              </View>
              <Text style={styles.nutritionValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Bottom Stats */}
        <View style={styles.statsRow}>
          {CONTENT.stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
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
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    textAlign: "center",
  },
  imageWrapper: {
    width: "100%",
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: SPACING.md,
    borderWidth: 3,
    borderColor: COLORS.primaryMuted,
    ...SHADOWS.medium,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  nutritionCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 20,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textDark,
    marginBottom: SPACING.md,
  },
  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  nutritionRowLast: {
    borderBottomWidth: 0,
  },
  nutritionLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  nutritionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  nutritionValue: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.textDark,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
    fontWeight: "800",
  },
  statLabel: {
    ...TYPOGRAPHY.tiny,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});