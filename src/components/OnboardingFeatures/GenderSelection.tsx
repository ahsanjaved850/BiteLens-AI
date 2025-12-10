import { updateGender } from "@/backend/sendData";
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

interface GenderSelectionProps {
  onValidationChange?: (isValid: boolean) => void;
}

export const GenderSelection: React.FC<GenderSelectionProps> = ({
  onValidationChange,
}) => {
  const [gender, setGender] = useState<string>("");

  const handlePress = async (selectedGender: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setGender(selectedGender);
  };

  useEffect(() => {
    const isValid = gender.length > 0;
    onValidationChange?.(isValid);

    if (isValid) {
      updateGender(gender);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [gender]);

  const options = [{ label: "Male" }, { label: "Female" }, { label: "Other" }];

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
            <Text style={modernStyles.headerTitle}>About You</Text>
            <View style={modernStyles.spacerSmall} />
            <Text style={modernStyles.subtitleLight}>
              Help us personalize your experience
            </Text>
          </View>

          {/* Options */}
          <View
            style={[modernStyles.optionsContainer, { marginTop: SPACING.xxl }]}
          >
            {options.map((option) => {
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
