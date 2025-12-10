import { updateName } from "@/backend/sendData";
import {
  COLORS,
  modernStyles,
  SPACING,
} from "@/src/Screens/Onboarding/Onboarding.style";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, StatusBar, Text, TextInput, View } from "react-native";

interface NameAddingProps {
  onValidationChange?: (isValid: boolean) => void;
}

export const NameAdding: React.FC<NameAddingProps> = ({
  onValidationChange,
}) => {
  const [name, setName] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSubmittedNameRef = useRef<string>("");

  // Validate name format
  const isValidName = useCallback((value: string): boolean => {
    const trimmed = value.trim();
    return trimmed.length >= 2 && trimmed.length <= 50;
  }, []);

  // Update validation state only
  useEffect(() => {
    const isValid = isValidName(name);
    onValidationChange?.(isValid);
  }, [name, isValidName, onValidationChange]);

  // Debounced API call
  const submitNameToBackend = useCallback(
    async (nameToSubmit: string) => {
      const trimmedName = nameToSubmit.trim();

      // Avoid duplicate submissions
      if (trimmedName === lastSubmittedNameRef.current) {
        return;
      }

      if (!isValidName(trimmedName)) {
        return;
      }

      try {
        setIsSubmitting(true);
        await updateName(trimmedName);
        lastSubmittedNameRef.current = trimmedName;
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
      } catch (error) {
        console.error("Failed to update name:", error);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        // Optionally: show error message to user
      } finally {
        setIsSubmitting(false);
      }
    },
    [isValidName]
  );

  // Handle text changes with debouncing
  const handleTextChange = useCallback(
    (text: string) => {
      setName(text);

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer for debounced API call
      debounceTimerRef.current = setTimeout(() => {
        submitNameToBackend(text);
      }, 800); // Wait 800ms after user stops typing
    },
    [submitNameToBackend]
  );

  // Handle blur event - immediate submission
  const handleBlur = useCallback(() => {
    setIsFocused(false);

    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Submit immediately on blur
    if (name.trim()) {
      submitNameToBackend(name);
    }
  }, [name, submitNameToBackend]);

  const handleFocus = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFocused(true);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
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
          {/* Welcome Emoji */}
          <View style={{ alignItems: "center" }}>
            <Text style={modernStyles.emojiLarge}>👋</Text>
          </View>

          {/* Header */}
          <View style={{ alignItems: "center", marginTop: SPACING.md }}>
            <Text style={modernStyles.headerTitle}>Nice to meet you!</Text>
            <View style={modernStyles.spacerSmall} />
            <Text style={modernStyles.subtitleLight}>
              What should we call you?
            </Text>
          </View>

          {/* Input Section */}
          <View
            style={[modernStyles.inputContainer, { marginTop: SPACING.xxl }]}
          >
            <TextInput
              placeholder="Enter your name"
              value={name}
              onChangeText={handleTextChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={[
                modernStyles.input,
                (isFocused || name) && modernStyles.inputFocused,
              ]}
              placeholderTextColor={COLORS.textLight}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              editable={!isSubmitting}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
