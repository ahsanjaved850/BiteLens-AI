import { updateGender } from "@/backend/sendData";
import {
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "@/src/Screens/Onboarding/Onboarding.style";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
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
  options: [
    { label: "Male", emoji: "👨" },
    { label: "Female", emoji: "👩" },
    { label: "Other", emoji: "🧑" },
  ],
} as const;

export const GenderSelection: React.FC<GenderSelectionProps> = ({
  onValidationChange,
}) => {
  const [gender, setGender] = useState<string>("");
  const hasShownSuccessRef = useRef(false);
  const onValidationChangeRef = useRef(onValidationChange);

  useEffect(() => {
    onValidationChangeRef.current = onValidationChange;
  }, [onValidationChange]);

  useEffect(() => {
    const isValid = gender.length > 0;
    onValidationChangeRef.current?.(isValid);
  }, [gender]);

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
    <View style={styles.safeArea}>
      <View style={styles.screenContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>{CONTENT.header.title}</Text>
            <Text style={styles.subtitle}>{CONTENT.header.subtitle}</Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {CONTENT.options.map((option) => {
              const isSelected = gender === option.label;
              return (
                <TouchableOpacity
                  key={option.label}
                  onPress={() => handlePress(option.label)}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionEmoji}>{option.emoji}</Text>
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
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
  headerSection: {
    alignItems: "center",
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
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
  optionsContainer: {
    marginTop: SPACING.xxl,
    gap: SPACING.md,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.backgroundCard,
    minHeight: 72,
  },
  optionButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    ...SHADOWS.small,
  },
  optionEmoji: {
    fontSize: 36,
    marginRight: SPACING.md,
  },
  optionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: "500",
    flex: 1,
  },
  optionTextSelected: {
    color: COLORS.textDark,
    fontWeight: "700",
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
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