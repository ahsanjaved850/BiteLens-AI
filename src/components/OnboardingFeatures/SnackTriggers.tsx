import {
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
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

interface SnackTriggersProps {
  onValidationChange?: (isValid: boolean) => void;
}

const CONTENT = {
  header: {
    title: "What typically triggers\nyour urge to snack\nand nibble?",
  },
  options: [
    { label: "Food around me", emoji: "🍕" },
    { label: "Boredom", emoji: "⏳" },
    { label: "Hunger", emoji: "🤤" },
    { label: "Other people snacking", emoji: "🍟" },
    { label: "Something else", emoji: "❓" },
  ],
} as const;

export const SnackTriggers: React.FC<SnackTriggersProps> = ({
  onValidationChange,
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    onValidationChange?.(selected.length > 0);
  }, [selected]);

  const handlePress = useCallback(
    async (label: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setSelected((prev) =>
        prev.includes(label)
          ? prev.filter((s) => s !== label)
          : [...prev, label]
      );
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
                onPress={() => handlePress(option.label)}
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
                  {isSelected && <Text style={styles.checkboxText}>✓</Text>}
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
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textDark,
    textAlign: "center",
    lineHeight: 36,
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
