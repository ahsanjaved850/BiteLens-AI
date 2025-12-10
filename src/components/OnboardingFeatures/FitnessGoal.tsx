import { updateGoal } from "@/backend/sendData";
import {
  COLORS,
  modernStyles,
  SPACING,
} from "@/src/Screens/Onboarding/Onboarding.style";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
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

export const FitnessGoal: React.FC<FitnessGoalProps> = ({
  onValidationChange,
}) => {
  const [goal, setGoal] = useState<string>("");

  useEffect(() => {
    const isValid = goal.length > 0;
    onValidationChange?.(isValid);

    if (isValid) {
      updateGoal(goal);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [goal]);

  const handlePress = async (selectedGoal: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setGoal(selectedGoal);
  };

  const options = [
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
  ];

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
            <Text style={modernStyles.headerTitle}>Your Goal</Text>
            <View style={modernStyles.spacerSmall} />
            <Text style={modernStyles.subtitleLight}>
              What would you like to achieve?
            </Text>
          </View>

          {/* Options */}
          <View
            style={[modernStyles.optionsContainer, { marginTop: SPACING.xxl }]}
          >
            {options.map((option) => {
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
