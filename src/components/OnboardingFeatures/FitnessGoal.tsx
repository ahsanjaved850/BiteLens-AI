import { updateGoal } from "@/backend/sendData";
import {
  COLORS,
  modernStyles,
  SPACING,
} from "@/src/Screens/Onboarding/Onboarding.style";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StatusBar,
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
  }, [goal]); // ✅ Removed onValidationChange

  const handlePress = useCallback(async (selectedGoal: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setGoal(selectedGoal);
  }, []);

  return (
    <View style={modernStyles.safeArea}>
      <View style={modernStyles.screenContainer}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.background}
        />
        <ScrollView
          contentContainerStyle={modernStyles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ alignItems: "center" }}>
            <Text style={modernStyles.headerTitle}>{CONTENT.header.title}</Text>
            <View style={modernStyles.spacerSmall} />
            <Text style={modernStyles.subtitleLight}>
              {CONTENT.header.subtitle}
            </Text>
          </View>

          {/* Options */}
          <View
            style={[modernStyles.optionsContainer, { marginTop: SPACING.xxl }]}
          >
            {CONTENT.options.map((option) => {
              const isSelected = goal === option.label;
              return (
                <TouchableOpacity
                  key={option.label}
                  onPress={() => handlePress(option.label)}
                  style={[
                    modernStyles.optionButton,
                    isSelected && modernStyles.optionButtonSelected,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={modernStyles.optionIconLarge}>
                    {option.icon}
                  </Text>
                  <View style={modernStyles.optionContent}>
                    <Text
                      style={[
                        modernStyles.optionText,
                        isSelected && modernStyles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text style={modernStyles.optionDescription}>
                      {option.description}
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={modernStyles.optionCheckmark}>
                      <Text style={modernStyles.checkmarkText}>✓</Text>
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