import { updateGender } from "@/backend/sendData";
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

interface GenderSelectionProps {
  onValidationChange?: (isValid: boolean) => void;
}

const CONTENT = {
  header: {
    title: "About You",
    subtitle: "Help us personalize your experience",
  },
  options: [{ label: "Male" }, { label: "Female" }, { label: "Other" }],
} as const;

export const GenderSelection: React.FC<GenderSelectionProps> = ({
  onValidationChange,
}) => {
  const [gender, setGender] = useState<string>("");
  const hasShownSuccessRef = useRef(false);
  const onValidationChangeRef = useRef(onValidationChange);

  // Update ref when callback changes
  useEffect(() => {
    onValidationChangeRef.current = onValidationChange;
  }, [onValidationChange]);

  // Validation effect - separate from submission
  useEffect(() => {
    const isValid = gender.length > 0;
    onValidationChangeRef.current?.(isValid);
  }, [gender]);

  // Submission effect - only runs when gender changes
  useEffect(() => {
    if (!gender) {
      hasShownSuccessRef.current = false;
      return;
    }

    const saveGender = async () => {
      try {
        await updateGender(gender);

        if (!hasShownSuccessRef.current) {
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          );
          hasShownSuccessRef.current = true;
        }
      } catch (error) {
        console.error("Failed to update gender:", error);
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Error
        );
      }
    };

    saveGender();
  }, [gender]);

  const handlePress = useCallback(async (selectedGender: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setGender(selectedGender);
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
              const isSelected = gender === option.label;
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
                  <Text
                    style={[
                      modernStyles.optionText,
                      isSelected && modernStyles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};