import { updateBodyStats } from "@/backend/sendData";
import {
  COLORS,
  modernStyles,
  SPACING,
} from "@/src/Screens/Onboarding/Onboarding.style";
import * as Haptics from "expo-haptics";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ScrollView, StatusBar, Text, TextInput, View } from "react-native";

interface PhysiqueInputProps {
  onValidationChange?: (isValid: boolean) => void;
}

export const BodyStatInput: React.FC<PhysiqueInputProps> = ({
  onValidationChange,
}) => {
  const [age, setAge] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [focusedField, setFocusedField] = useState<string>("");

  // Refs for focusing next input
  const heightRef = useRef<TextInput>(null);
  const ageRef = useRef<TextInput>(null);

  // Ref to track if we've shown success haptic
  const hasShownSuccessRef = useRef(false);

  // Calculate validation status - memoized
  const isValid = useMemo(() => {
    return age.trim().length > 0 && height.trim().length > 0;
  }, [age, height]);

  // Validation effect - ONLY updates parent, no other side effects
  useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid]); // Only depend on isValid, not individual fields

  // Save effect - debounced, only when valid
  useEffect(() => {
    if (!isValid) {
      hasShownSuccessRef.current = false;
      return;
    }

    const saveTimer = setTimeout(() => {
      try {
        updateBodyStats(age, height);

        // Only show success haptic once
        if (!hasShownSuccessRef.current) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          hasShownSuccessRef.current = true;
        }
      } catch (error) {
        console.error("Error saving physique:", error);
      }
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [age, height, isValid]);

  // Memoized handlers to prevent re-creation
  const handleFocus = useCallback((fieldName: string) => {
    setFocusedField(fieldName);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedField("");
  }, []);

  const handleAgeSubmit = useCallback(() => {
    heightRef.current?.focus();
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
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={{ alignItems: "center" }}>
            <Text style={modernStyles.headerTitle}>Your Body Stats</Text>
            <Text style={modernStyles.subtitleLight}>
              Help us create your personalized plan
            </Text>
          </View>

          {/* Form */}
          <View style={[modernStyles.formContainer, { marginTop: SPACING.xl }]}>
            {/* Age Input */}
            <View style={modernStyles.formGroup}>
              <Text style={modernStyles.formLabel}>AGE</Text>
              <TextInput
                ref={ageRef}
                placeholder="25 years"
                value={age}
                onChangeText={setAge}
                onFocus={() => handleFocus("age")}
                onBlur={handleBlur}
                onSubmitEditing={handleAgeSubmit}
                keyboardType="numeric"
                style={[
                  modernStyles.formInput,
                  focusedField === "age" && modernStyles.formInputFocused,
                ]}
                placeholderTextColor={COLORS.textLight}
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>

            {/* Height Input */}
            <View style={modernStyles.formGroup}>
              <Text style={modernStyles.formLabel}>HEIGHT</Text>
              <TextInput
                ref={heightRef}
                placeholder="170 cm"
                value={height}
                onChangeText={setHeight}
                onFocus={() => handleFocus("height")}
                onBlur={handleBlur}
                keyboardType="numeric"
                style={[
                  modernStyles.formInput,
                  focusedField === "height" && modernStyles.formInputFocused,
                ]}
                placeholderTextColor={COLORS.textLight}
                returnKeyType="done"
                blurOnSubmit={false}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
