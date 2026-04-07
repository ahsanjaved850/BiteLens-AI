import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  SHADOWS,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React from "react";
import { StatusBar, Text, View, StyleSheet } from "react-native";

const CONTENT = {
  title: "Master your macros for\nnutritional balance",
  cardTitle: "Nutrition Facts",
  macros: [
    { label: "Fat", current: 40, target: 50, color: "#F5A623", unit: "g" },
    { label: "Net Carbs", current: 160, target: 180, color: "#8BC34A", unit: "g" },
    { label: "Protein", current: 20, target: 72, color: "#FF4757", unit: "g", warning: true },
    { label: "Fiber", current: 24, target: 30, color: "#F5A623", unit: "g" },
  ],
} as const;

export const MacroTracker: React.FC = () => {
  return (
    <View style={styles.safeArea}>
      <View style={styles.screenContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>{CONTENT.title}</Text>
        </View>

        {/* Macro Card */}
        <View style={styles.macroCard}>
          <View style={styles.macroCardInner}>
            <Text style={styles.macroCardTitle}>{CONTENT.cardTitle}</Text>

            {CONTENT.macros.map((macro, index) => {
              const percent = Math.min((macro.current / macro.target) * 100, 100);
              const isWarning = macro.warning;

              return (
                <View
                  key={index}
                  style={[
                    styles.macroRow,
                    isWarning && styles.macroRowWarning,
                  ]}
                >
                  <View style={styles.macroHeader}>
                    <Text style={[styles.macroLabel, isWarning && styles.macroLabelWarning]}>
                      {macro.label}
                    </Text>
                    <View style={styles.macroValueRow}>
                      {isWarning && <Text style={styles.warningIcon}>⚠️</Text>}
                      <Text style={[styles.macroValue, isWarning && styles.macroValueWarning]}>
                        {macro.current}
                      </Text>
                      <Text style={styles.macroTarget}>/{macro.target}{macro.unit}</Text>
                    </View>
                  </View>
                  <View style={styles.progressBg}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${percent}%`,
                          backgroundColor: macro.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
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
    marginBottom: SPACING.xxl,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textDark,
    textAlign: "center",
    lineHeight: 36,
  },
  macroCard: {
    backgroundColor: COLORS.accent,
    borderRadius: 24,
    padding: SPACING.md,
    ...SHADOWS.large,
  },
  macroCardInner: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
  },
  macroCardTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textDark,
    fontWeight: "800",
    marginBottom: SPACING.lg,
  },
  macroRow: {
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.sm,
    borderRadius: 12,
  },
  macroRowWarning: {
    backgroundColor: "#FFE0E0",
    paddingHorizontal: SPACING.sm,
    marginHorizontal: -SPACING.sm,
  },
  macroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  macroLabel: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.textDark,
  },
  macroLabelWarning: {
    color: COLORS.error,
    fontWeight: "700",
  },
  macroValueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  warningIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  macroValue: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.textDark,
  },
  macroValueWarning: {
    color: COLORS.error,
    fontWeight: "700",
  },
  macroTarget: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
  },
  progressBg: {
    height: 8,
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
});
