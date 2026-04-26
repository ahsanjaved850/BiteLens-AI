import {
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "@/src/Screens/Onboarding/Onboarding.style";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface FoodRecordHabitProps {
  onValidationChange?: (isValid: boolean) => void;
}

const CONTENT = {
  header: {
    title: "Do you usually keep a\nrecord of what you eat?",
  },
  options: [
    { label: "Every meal", emoji: "🍽️" },
    { label: "I do when I remember", emoji: "☕" },
    { label: "Not at all", emoji: "❌" },
  ],
} as const;

export const FoodRecordHabit: React.FC<FoodRecordHabitProps> = ({
  onValidationChange,
}) => {
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    onValidationChange?.(selected.length > 0);
  }, [selected]);

  const handlePress = useCallback(async (option: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelected(option);
  }, []);

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
            const isSelected = selected === option.label;
            return (
              <TouchableOpacity
                key={option.label}
                onPress={() => handlePress(option.label)}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                ]}
                activeOpacity={0.7}
              >
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
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
    marginBottom: SPACING.xxl,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textDark,
    textAlign: "center",
    lineHeight: 36,
  },
  optionsContainer: {
    gap: SPACING.md,
    paddingBottom: SPACING.xxxl,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.backgroundCard,
    minHeight: 72,
  },
  optionButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    ...SHADOWS.small,
  },
  optionEmoji: {
    fontSize: 36,
    marginRight: SPACING.md,
  },
  optionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: "500",
    flex: 1,
  },
  optionTextSelected: {
    color: COLORS.textDark,
    fontWeight: "700",
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
});
