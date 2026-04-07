import {
  COLORS,
  SPACING,
  TYPOGRAPHY
} from "@/src/Screens/Onboarding/Onboarding.style";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface HealthConcernsProps {
  onValidationChange?: (isValid: boolean) => void;
}

const CONTENT = {
  header: {
    title: "Any health concerns?",
  },
  behindQuestion: "Safe Exercise Recommendations based on your health profile...",
  options: [
    { label: "I don't have any of these", emoji: "🤷", isNone: true },
    { label: "Hypertension", emoji: "💧" },
    { label: "High Cholesterol", emoji: "🩺" },
    { label: "Obesity", emoji: "🍪" },
    { label: "Diabetes", emoji: "💉" },
    { label: "Heart Disease", emoji: "❤️" },
    { label: "Food Allergies", emoji: "⚠️" },
  ],
} as const;

export const HealthConcerns: React.FC<HealthConcernsProps> = ({
  onValidationChange,
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const isValid = selected.length > 0;
    onValidationChange?.(isValid);
  }, [selected]);

  const handlePress = useCallback(
    async (label: string, isNone?: boolean) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      setSelected((prev) => {
        if (isNone) {
          // If "none" is tapped, clear everything and select only "none"
          return prev.includes(label) ? [] : [label];
        }

        // If any other option is tapped, remove "none" if present
        const withoutNone = prev.filter(
          (s) => s !== "I don't have any of these"
        );

        if (withoutNone.includes(label)) {
          return withoutNone.filter((s) => s !== label);
        }
        return [...withoutNone, label];
      });
    },
    []
  );

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.screenContainer}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>{CONTENT.header.title}</Text>
        </View>

        {/* Options */}
        <ScrollView
          contentContainerStyle={styles.optionsContainer}
          showsVerticalScrollIndicator={false}
        >
          {CONTENT.options.map((option) => {
            const isSelected = selected.includes(option.label);
            return (
              <TouchableOpacity
                key={option.label}
                onPress={() => handlePress(option.label, option.isNone)}
                style={[
                  styles.optionRow,
                  isSelected && styles.optionRowSelected,
                ]}
                activeOpacity={0.7}
              >
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <Text
                  style={[
                    styles.optionLabel,
                    isSelected && styles.optionLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
                <View
                  style={[
                    styles.checkbox,
                    isSelected && styles.checkboxSelected,
                  ]}
                >
                  {isSelected && (
                    <Text style={styles.checkboxText}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
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
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textDark,
    textAlign: "center",
  },
  behindQuestion: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  behindEmoji: {
    fontSize: 28,
    marginRight: SPACING.sm,
  },
  behindTitle: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.textDark,
  },
  behindText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
  },
  moreLink: {
    ...TYPOGRAPHY.small,
    color: COLORS.primary,
    fontWeight: "600",
    marginLeft: SPACING.sm,
  },
  optionsContainer: {
    gap: 10,
    paddingBottom: SPACING.xxxl,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  optionRowSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  optionEmoji: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  optionLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: "500",
    flex: 1,
  },
  optionLabelSelected: {
    color: COLORS.textDark,
    fontWeight: "600",
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },
});
