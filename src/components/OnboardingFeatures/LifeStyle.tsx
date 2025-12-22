import {
  COLORS,
  modernStyles,
  SPACING,
} from "@/src/Screens/Onboarding/Onboarding.style";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface LifeStyleProps {
  onValidationChange?: (isValid: boolean) => void;
}

const CONTENT = {
  header: {
    title: "Your Motivation",
    subtitle: "What matters most to you?",
  },
  options: [
    {
      label: "Eat and live healthier",
      icon: "🥗",
      description: "Nutritious daily choices",
    },
    {
      label: "Feel better about my body",
      icon: "💪",
      description: "Build confidence",
    },
    {
      label: "Stay consistent and motivated",
      icon: "🎯",
      description: "Maintain healthy habits",
    },
  ],
} as const;

export const LifeStyle: React.FC<LifeStyleProps> = ({ onValidationChange }) => {
  const [lifeStyle, setLifeStyle] = useState<string>("");

  useEffect(() => {
    const isValid = lifeStyle.length > 0;
    onValidationChange?.(isValid);
  }, [lifeStyle, onValidationChange]);

  const handlePress = useCallback(async (selectedOption: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLifeStyle(selectedOption);
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
              const isSelected = lifeStyle === option.label;
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
