import {
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "@/src/Screens/Onboarding/Onboarding.style";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface OtherAppsProps {
  onValidationChange?: (isValid: boolean) => void;
}

const CONTENT = {
  header: {
    title: "Have you ever tried\ntracking your diet or\ncalorie intake?",
  },
  behindQuestion: "Understanding Your Experience helps us tailor the app...",
  options: [
    { label: "Frequently track", emoji: "😉" },
    { label: "Occasionally track", emoji: "😄" },
    { label: "Never track", emoji: "😮" },
  ],
} as const;

export const OtherApps: React.FC<OtherAppsProps> = ({ onValidationChange }) => {
  const [oldUser, setOldUser] = useState<string>("");

  useEffect(() => {
    const isValid = oldUser.length > 0;
    onValidationChange?.(isValid);
  }, [oldUser]);

  const handlePress = useCallback(async (selectedOption: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setOldUser(selectedOption);
  }, []);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.screenContainer}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>{CONTENT.header.title}</Text>
        </View>

        {/* Options */}
        <ScrollView
          contentContainerStyle={styles.optionsContainer}
          showsVerticalScrollIndicator={false}
        >
          {CONTENT.options.map((option) => {
            const isSelected = oldUser === option.label;
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
              </TouchableOpacity>
            );
          })}
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
    paddingHorizontal: SPACING.lg,
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
    lineHeight: 36,
  },
  behindQuestion: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  behindEmoji: {
    fontSize: 28,
    marginRight: SPACING.sm,
  },
  behindTitle: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.textDark,
  },
  behindText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
  },
  moreLink: {
    ...TYPOGRAPHY.small,
    color: COLORS.primary,
    fontWeight: "600",
    marginLeft: SPACING.sm,
  },
  optionsContainer: {
    gap: SPACING.md,
    paddingBottom: SPACING.xxxl,
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
});