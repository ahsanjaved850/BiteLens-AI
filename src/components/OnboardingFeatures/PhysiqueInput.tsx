import { updateWeightStats } from "@/backend/sendData";
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

export const PhysiqueInput: React.FC<PhysiqueInputProps> = ({
  onValidationChange,
}) => {
  const [weight, setWeight] = useState<string>("");
  const [targetWeight, setTargetWeight] = useState<string>("");
  const [focusedField, setFocusedField] = useState<string>("");

  // Refs for focusing next input
  const weightRef = useRef<TextInput>(null);
  const targetWeightRef = useRef<TextInput>(null);

  // Ref to track if we've shown success haptic
  const hasShownSuccessRef = useRef(false);

  // Calculate validation status - memoized
  const isValid = useMemo(() => {
    return weight.trim().length > 0 && targetWeight.trim().length > 0;
  }, [weight, targetWeight]);

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
        updateWeightStats(weight, targetWeight);

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
  }, [weight, targetWeight, isValid]);

  // Memoized handlers to prevent re-creation
  const handleFocus = useCallback((fieldName: string) => {
    setFocusedField(fieldName);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedField("");
  }, []);

  const handleWeightSubmit = useCallback(() => {
    targetWeightRef.current?.focus();
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
            <Text style={modernStyles.headerTitle}>Your Weight Stats</Text>
            <Text style={modernStyles.subtitleLight}>
              Help us create your personalized plan
            </Text>
          </View>

          {/* Form */}
          <View style={[modernStyles.formContainer, { marginTop: SPACING.xl }]}>
            {/* Weight Input */}
            <View style={modernStyles.formGroup}>
              <Text style={modernStyles.formLabel}>CURRENT WEIGHT</Text>
              <TextInput
                ref={weightRef}
                placeholder="70 kg"
                value={weight}
                onChangeText={setWeight}
                onFocus={() => handleFocus("weight")}
                onBlur={handleBlur}
                onSubmitEditing={handleWeightSubmit}
                keyboardType="numeric"
                style={[
                  modernStyles.formInput,
                  focusedField === "weight" && modernStyles.formInputFocused,
                ]}
                placeholderTextColor={COLORS.textLight}
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>

            {/* Target Weight Input */}
            <View style={modernStyles.formGroup}>
              <Text style={modernStyles.formLabel}>TARGET WEIGHT</Text>
              <TextInput
                ref={targetWeightRef}
                placeholder="65 kg"
                value={targetWeight}
                onChangeText={setTargetWeight}
                onFocus={() => handleFocus("targetWeight")}
                onBlur={handleBlur}
                keyboardType="numeric"
                style={[
                  modernStyles.formInput,
                  focusedField === "targetWeight" &&
                    modernStyles.formInputFocused,
                ]}
                placeholderTextColor={COLORS.textLight}
                returnKeyType="done"
                blurOnSubmit={true}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
