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

const CONTENT = {
  emoji: "👋",
  header: {
    title: "Nice to meet you!",
    subtitle: "What should we call you?",
  },
  input: {
    placeholder: "Enter your name",
  },
} as const;

const VALIDATION = {
  minLength: 2,
  maxLength: 50,
  debounceMs: 800,
} as const;

export const NameAdding: React.FC<NameAddingProps> = ({
  onValidationChange,
}) => {
  const [name, setName] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSubmittedNameRef = useRef<string>("");

  const isValidName = useCallback((value: string): boolean => {
    const trimmed = value.trim();
    return (
      trimmed.length >= VALIDATION.minLength &&
      trimmed.length <= VALIDATION.maxLength
    );
  }, []);

  useEffect(() => {
    const isValid = isValidName(name);
    onValidationChange?.(isValid);
  }, [name, isValidName, onValidationChange]);

  const submitNameToBackend = useCallback(
    async (nameToSubmit: string) => {
      const trimmedName = nameToSubmit.trim();

      if (
        trimmedName === lastSubmittedNameRef.current ||
        !isValidName(trimmedName)
      ) {
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
      } finally {
        setIsSubmitting(false);
      }
    },
    [isValidName]
  );

  const handleTextChange = useCallback(
    (text: string) => {
      setName(text);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        submitNameToBackend(text);
      }, VALIDATION.debounceMs);
    },
    [submitNameToBackend]
  );

  const handleBlur = useCallback(() => {
    setIsFocused(false);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (name.trim()) {
      submitNameToBackend(name);
    }
  }, [name, submitNameToBackend]);

  const handleFocus = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFocused(true);
  }, []);

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
            <Text style={modernStyles.emojiLarge}>{CONTENT.emoji}</Text>
          </View>

          {/* Header */}
          <View style={{ alignItems: "center", marginTop: SPACING.md }}>
            <Text style={modernStyles.headerTitle}>{CONTENT.header.title}</Text>
            <View style={modernStyles.spacerSmall} />
            <Text style={modernStyles.subtitleLight}>
              {CONTENT.header.subtitle}
            </Text>
          </View>

          {/* Input Section */}
          <View
            style={[modernStyles.inputContainer, { marginTop: SPACING.xxl }]}
          >
            <TextInput
              placeholder={CONTENT.input.placeholder}
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
