import { updateGoal } from "@/backend/sendData";
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

interface FitnessGoalProps {
  onValidationChange?: (isValid: boolean) => void;
}

const CONTENT = {
  header: {
    title: "Your Goal",
    subtitle: "What would you like to achieve?",
  },
  options: [
    {
      label: "Gain",
      icon: "💪",
      description: "Build muscle mass",
    },
    {
      label: "Maintain",
      icon: "⚖️",
      description: "Stay at current weight",
    },
    {
      label: "Lose",
      icon: "🎯",
      description: "Healthy weight loss",
    },
  ],
} as const;

export const FitnessGoal: React.FC<FitnessGoalProps> = ({
  onValidationChange,
}) => {
  const [goal, setGoal] = useState<string>("");
  const hasShownSuccessRef = useRef(false);

  useEffect(() => {
    const isValid = goal.length > 0;
    onValidationChange?.(isValid);

    if (!isValid) {
      hasShownSuccessRef.current = false;
      return;
    }

    updateGoal(goal);

    if (!hasShownSuccessRef.current) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      hasShownSuccessRef.current = true;
    }
  }, [goal]);

  const handlePress = useCallback(async (selectedGoal: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setGoal(selectedGoal);
  }, []);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.screenContainer}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>{CONTENT.header.title}</Text>
            <Text style={styles.subtitle}>{CONTENT.header.subtitle}</Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {CONTENT.options.map((option) => {
              const isSelected = goal === option.label;
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
                  <Text style={styles.optionEmoji}>{option.icon}</Text>
                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text style={styles.optionDescription}>
                      {option.description}
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
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
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  headerSection: {
    alignItems: "center",
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    textAlign: "center",
  },
  optionsContainer: {
    marginTop: SPACING.xxl,
    gap: SPACING.md,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.backgroundCard,
    minHeight: 80,
  },
  optionButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    ...SHADOWS.small,
  },
  optionEmoji: {
    fontSize: 40,
    marginRight: SPACING.md,
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: "500",
  },
  optionTextSelected: {
    color: COLORS.textDark,
    fontWeight: "700",
  },
  optionDescription: {
    ...TYPOGRAPHY.small,
    color: COLORS.textLight,
    marginTop: 3,
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