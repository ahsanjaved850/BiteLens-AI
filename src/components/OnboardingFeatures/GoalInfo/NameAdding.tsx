import { COLORS, SPACING } from "@/src/Screens/Onboarding/Onboarding.style";
import { saveOnboardingData } from "@/src/utils/onboarding/onboardingStorage";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
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
  header: {
    badge: "Almost there",
    title: "What should we\ncall you?",
    subtitle: "We'll personalise your experience around you",
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
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    )
      return;
    try {
      setIsSubmitting(true);
      await saveOnboardingData({ full_name: trimmedName });
      lastSubmittedNameRef.current = trimmedName;
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        submitNameToBackend(text);
      }, VALIDATION.debounceMs);
    },
    [submitNameToBackend],
  );

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (name.trim()) submitNameToBackend(name);
  }, [name, submitNameToBackend]);

  const handleFocus = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFocused(true);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  return (
    <View style={s.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.backgroundGradientTop}
      />

      {/* ── Gradient — identical to every other onboarding screen ── */}
      <LinearGradient
        colors={[
          COLORS.backgroundGradientTop,
          COLORS.backgroundGradientMid,
          COLORS.backgroundGradientBottom,
        ]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header ── */}
        <View style={s.header}>
          {/* Orange uppercase badge — same as FitnessGoal, BodyTransformation */}
          <Text style={s.title}>{CONTENT.header.title}</Text>
          <Text style={s.subtitle}>{CONTENT.header.subtitle}</Text>
        </View>

        {/* ── Name input ── */}
        <View style={s.inputWrap}>
          {/* Label — orange uppercase, same as Login screen EMAIL/PASSWORD labels */}
          <Text style={s.inputLabel}>Your name</Text>
          <TextInput
            placeholder={CONTENT.input.placeholder}
            value={name}
            onChangeText={handleTextChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={[
              s.input,
              isFocused && s.inputFocused,
              name.length > 0 && !isFocused && s.inputFilled,
            ]}
            placeholderTextColor={COLORS.textLight}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            editable={!isSubmitting}
          />

          {/* Character count — subtle, only shown when typing */}
          {name.length > 0 && (
            <Text style={s.charCount}>
              {name.trim().length} / {VALIDATION.maxLength}
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.backgroundGradientTop,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    paddingTop: SPACING.sm,
  },

  // ─── Header ────────────────────────────────────────────────────
  header: {
    alignItems: "center",
    marginTop: SPACING.xl,
    marginBottom: SPACING.xxl,
  },
  badge: {
    // CHANGED: was missing entirely — added orange uppercase badge
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary, // #F47B20
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: SPACING.sm,
  },
  title: {
    // CHANGED: was TYPOGRAPHY.h1 — now explicit for clarity
    fontSize: 30,
    fontWeight: "700",
    color: COLORS.textDark, // #0F1A22
    textAlign: "center",
    letterSpacing: -0.8,
    lineHeight: 38,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.textSecondary, // #7A8A98
    textAlign: "center",
    lineHeight: 22,
  },

  // ─── Input ─────────────────────────────────────────────────────
  inputWrap: {
    marginBottom: SPACING.xl,
  },
  inputLabel: {
    // CHANGED: was absent — added orange uppercase label matching Login screen
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary, // #F47B20
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: SPACING.sm,
    marginTop: 150,
  },
  input: {
    borderWidth: 1.5, // CHANGED: was 2 — matches Login input
    borderColor: COLORS.border, // #F0DED0 warm peach border
    borderRadius: 16,
    padding: SPACING.lg,
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textDark,
    backgroundColor: "#FFFAF6", // CHANGED: was backgroundCard — warm off-white
    minHeight: 58,
    textAlign: "center",
  },
  inputFocused: {
    borderColor: COLORS.primary, // #F47B20
    backgroundColor: "#FFF3E8", // CHANGED: warm peach tint on focus (matches Login)
  },
  inputFilled: {
    // CHANGED: new — subtle green border when filled and valid
    borderColor: "#2ECC71",
  },
  charCount: {
    // CHANGED: new — muted char count below input
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.textLight,
    textAlign: "right",
    marginTop: 6,
  },

  // ─── Info card ──────────────────────────────────────────────────
  infoCard: {
    // CHANGED: was behindQuestion with backgroundGray — now warm themed card
    // with left orange accent bar, matching MealDetails AI notice style
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.primaryLight, // #FFF3E8
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primaryMuted, // #FFE0C2
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary, // #F47B20
    gap: 10,
  },
  infoIcon: {
    fontSize: 22,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 3,
  },
  infoText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});
