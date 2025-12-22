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
    title: "Your Body Stats",
    subtitle: "Help us create your personalized plan",
  },
  fields: {
    age: {
      label: "AGE",
      placeholder: "25 years",
      returnKey: "next" as const,
    },
    height: {
      label: "HEIGHT",
      placeholder: "170 cm",
      returnKey: "next" as const,
    },
  },
} as const;

const SAVE_DEBOUNCE_MS = 1000;

export const BodyStatInput: React.FC<PhysiqueInputProps> = ({
  onValidationChange,
}) => {
  const [age, setAge] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [focusedField, setFocusedField] = useState<string>("");

  const heightRef = useRef<TextInput>(null);
  const ageRef = useRef<TextInput>(null);
  const hasShownSuccessRef = useRef(false);

  const isValid = useMemo(() => {
    return age.trim().length > 0 && height.trim().length > 0;
  }, [age, height]);

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
        updateBodyStats(age, height);

        if (!hasShownSuccessRef.current) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          hasShownSuccessRef.current = true;
        }
      } catch (error) {
        console.error("Error saving physique:", error);
      }
    }, SAVE_DEBOUNCE_MS);

    return () => clearTimeout(saveTimer);
  }, [age, height, isValid]);

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

  const handleHeightSubmit = useCallback(() => {
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
            {/* Age Input */}
            <View style={modernStyles.formGroup}>
              <Text style={modernStyles.formLabel}>
                {CONTENT.fields.age.label}
              </Text>
              <TextInput
                ref={ageRef}
                placeholder={CONTENT.fields.age.placeholder}
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
                returnKeyType={CONTENT.fields.age.returnKey}
                blurOnSubmit={false}
              />
            </View>

            {/* Height Input */}
            <View style={modernStyles.formGroup}>
              <Text style={modernStyles.formLabel}>
                {CONTENT.fields.height.label}
              </Text>
              <TextInput
                ref={heightRef}
                placeholder={CONTENT.fields.height.placeholder}
                value={height}
                onChangeText={setHeight}
                onFocus={() => handleFocus("height")}
                onBlur={handleBlur}
                onSubmitEditing={handleHeightSubmit}
                keyboardType="numeric"
                style={[
                  modernStyles.formInput,
                  focusedField === "height" && modernStyles.formInputFocused,
                ]}
                placeholderTextColor={COLORS.textLight}
                returnKeyType={CONTENT.fields.height.returnKey}
                blurOnSubmit={false}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
