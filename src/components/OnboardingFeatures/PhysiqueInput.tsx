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
import {
  Keyboard,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";

interface PhysiqueInputProps {
  onValidationChange?: (isValid: boolean) => void;
}

const CONTENT = {
  header: {
    title: "Your Weight Stats",
    subtitle: "Help us create your personalized plan",
  },
  fields: {
    weight: {
      label: "CURRENT WEIGHT",
      placeholder: "70 kg",
      returnKey: "next" as const,
    },
    targetWeight: {
      label: "TARGET WEIGHT",
      placeholder: "65 kg",
      returnKey: "next" as const,
    },
  },
} as const;

const SAVE_DEBOUNCE_MS = 1000;

export const PhysiqueInput: React.FC<PhysiqueInputProps> = ({
  onValidationChange,
}) => {
  const [weight, setWeight] = useState<string>("");
  const [targetWeight, setTargetWeight] = useState<string>("");
  const [focusedField, setFocusedField] = useState<string>("");

  const weightRef = useRef<TextInput>(null);
  const targetWeightRef = useRef<TextInput>(null);
  const hasShownSuccessRef = useRef(false);

  const isValid = useMemo(() => {
    return weight.trim().length > 0 && targetWeight.trim().length > 0;
  }, [weight, targetWeight]);

  useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  useEffect(() => {
    if (!isValid) {
      hasShownSuccessRef.current = false;
      return;
    }

    const saveTimer = setTimeout(() => {
      try {
        updateWeightStats(weight, targetWeight);

        if (!hasShownSuccessRef.current) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          hasShownSuccessRef.current = true;
        }
      } catch (error) {
        console.error("Error saving physique:", error);
      }
    }, SAVE_DEBOUNCE_MS);

    return () => clearTimeout(saveTimer);
  }, [weight, targetWeight, isValid]);

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

  const handleTargetWeightSubmit = useCallback(() => {
    Keyboard.dismiss();
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
            <Text style={modernStyles.headerTitle}>{CONTENT.header.title}</Text>
            <Text style={modernStyles.subtitleLight}>
              {CONTENT.header.subtitle}
            </Text>
          </View>

          {/* Form */}
          <View style={[modernStyles.formContainer, { marginTop: SPACING.xl }]}>
            {/* Weight Input */}
            <View style={modernStyles.formGroup}>
              <Text style={modernStyles.formLabel}>
                {CONTENT.fields.weight.label}
              </Text>
              <TextInput
                ref={weightRef}
                placeholder={CONTENT.fields.weight.placeholder}
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
                returnKeyType={CONTENT.fields.weight.returnKey}
                blurOnSubmit={false}
              />
            </View>

            {/* Target Weight Input */}
            <View style={modernStyles.formGroup}>
              <Text style={modernStyles.formLabel}>
                {CONTENT.fields.targetWeight.label}
              </Text>
              <TextInput
                ref={targetWeightRef}
                placeholder={CONTENT.fields.targetWeight.placeholder}
                value={targetWeight}
                onChangeText={setTargetWeight}
                onFocus={() => handleFocus("targetWeight")}
                onBlur={handleBlur}
                onSubmitEditing={handleTargetWeightSubmit}
                keyboardType="numeric"
                style={[
                  modernStyles.formInput,
                  focusedField === "targetWeight" &&
                    modernStyles.formInputFocused,
                ]}
                placeholderTextColor={COLORS.textLight}
                returnKeyType={CONTENT.fields.targetWeight.returnKey}
                blurOnSubmit={false}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
