import { updateName } from "@/backend/sendData";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY
} from "@/src/Screens/Onboarding/Onboarding.style";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

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
  const onValidationChangeRef = useRef(onValidationChange);

  useEffect(() => {
    onValidationChangeRef.current = onValidationChange;
  }, [onValidationChange]);

  const isValidName = (value: string): boolean => {
    const trimmed = value.trim();
    return (
      trimmed.length >= VALIDATION.minLength &&
      trimmed.length <= VALIDATION.maxLength
    );
  };

  useEffect(() => {
    const isValid = isValidName(name);
    onValidationChangeRef.current?.(isValid);
  }, [name]);

  const submitNameToBackend = useCallback(async (nameToSubmit: string) => {
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
  }, []);

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
    <View style={styles.safeArea}>
      <View style={styles.screenContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Emoji */}
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{CONTENT.emoji}</Text>
          </View>

          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>{CONTENT.header.title}</Text>
            <Text style={styles.subtitle}>{CONTENT.header.subtitle}</Text>
          </View>

          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder={CONTENT.input.placeholder}
              value={name}
              onChangeText={handleTextChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={[
                styles.input,
                (isFocused || name) && styles.inputFocused,
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  emojiContainer: {
    alignItems: "center",
    marginTop: SPACING.xxl,
  },
  emoji: {
    fontSize: 72,
  },
  headerSection: {
    alignItems: "center",
    marginTop: SPACING.md,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    textAlign: "center",
  },
  inputContainer: {
    marginTop: SPACING.xxl,
  },
  input: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: SPACING.md,
    ...TYPOGRAPHY.body,
    color: COLORS.textDark,
    backgroundColor: COLORS.backgroundCard,
    minHeight: 58,
    textAlign: "center",
    fontSize: 18,
  },
  inputFocused: {
    borderColor: COLORS.primary,
  },
  behindQuestion: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 14,
    padding: SPACING.md,
    marginTop: SPACING.xl,
  },
  behindEmoji: {
    fontSize: 28,
    marginRight: SPACING.sm,
  },
  behindTitle: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.textDark,
    marginBottom: 2,
  },
  behindText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});