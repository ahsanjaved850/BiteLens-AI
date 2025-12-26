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

interface OtherAppsProps {
  onValidationChange?: (isValid: boolean) => void;
}

const CONTENT = {
  header: {
    title: "Your Experience",
    subtitle: "Have you used nutrition tracking\napps before?",
  },
  options: [
    {
      label: "Yes",
      icon: "✅",
      description: "I've tried tracking apps",
    },
    {
      label: "No",
      icon: "🆕",
      description: "This is my first time",
    },
  ],
} as const;

export const OtherApps: React.FC<OtherAppsProps> = ({ onValidationChange }) => {
  const [oldUser, setOldUser] = useState<string>("");

  useEffect(() => {
    const isValid = oldUser.length > 0;
    onValidationChange?.(isValid);
  }, [oldUser]); // ✅ Removed onValidationChange

  const handlePress = useCallback(async (selectedOption: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setOldUser(selectedOption);
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
              const isSelected = oldUser === option.label;
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
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};