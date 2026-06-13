import { COLORS, SPACING } from "@/src/Screens/Onboarding/Onboarding.style";
import { saveOnboardingData } from "@/src/utils/onboarding/onboardingStorage";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Image,
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
    title: "What's your gender?",
    subtitle: "This helps us tailor your plan",
  },
  options: [
    {
      label: "Male",
      icon: require("@/assets/images/icons/male.png"),
      accent: "#EF4444",
      accentLight: "#FEE2E2",
    },
    {
      label: "Female",
      icon: require("@/assets/images/icons/female.png"),
      accent: "#3B82F6",
      accentLight: "#DBEAFE",
    },
    {
      label: "Other",
      icon: require("@/assets/images/icons/others.png"),
      accent: "#8B5CF6",
      accentLight: "#EDE9FE",
    },
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
        await saveOnboardingData({ gender });

        if (!hasShownSuccessRef.current) {
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success,
          );
          hasShownSuccessRef.current = true;
        }
      } catch (error) {
        console.error("Failed to update gender:", error);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    };

    saveGender();
  }, [gender]);

  const handlePress = useCallback(async (selectedGender: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setGender(selectedGender);
  }, []);

  return (
    <View style={s.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.backgroundGradientTop}
      />

      {/* Peach → cream → white gradient — matches every other screen */}
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
      >
        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={s.title}>{CONTENT.header.title}</Text>
          <Text style={s.subtitle}>{CONTENT.header.subtitle}</Text>
        </View>

        {/* ── Gender Options ── */}
        <View style={s.optionsContainer}>
          {CONTENT.options.map((option) => {
            const isSelected = gender === option.label;

            return (
              <TouchableOpacity
                key={option.label}
                onPress={() => handlePress(option.label)}
                style={[
                  s.optionCard,
                  isSelected && {
                    borderColor: option.accent,
                    backgroundColor: option.accentLight,
                    shadowColor: option.accent,
                    shadowOpacity: 0.18,
                  },
                ]}
                activeOpacity={0.75}
              >
                {/*
                 * Left orange accent bar — same brand detail used on
                 * meal cards (Home) and nutrient rows (MealDetails).
                 * Changes to the option's accent color when selected.
                 */}
                <View
                  style={[
                    s.accentBar,
                    {
                      backgroundColor: isSelected
                        ? option.accent
                        : COLORS.border,
                    },
                  ]}
                />

                {/*
                 * PNG icon in a coloured tile — same 3D icon tile
                 * treatment used on Home nutrient cards and Settings icons.
                 */}
                <Image
                  source={option.icon}
                  style={s.iconImage}
                  resizeMode="contain"
                />

                {/* Text content */}
                <View style={s.optionText}>
                  <Text
                    style={[
                      s.optionLabel,
                      isSelected && {
                        color: COLORS.textDark,
                        fontWeight: "600",
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </View>

                {/* Checkmark — only visible when selected */}
                {isSelected && (
                  <View
                    style={[s.checkmark, { backgroundColor: option.accent }]}
                  >
                    <Text style={s.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
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

  // ─── Header ──────────────────────────────────────────────────────
  header: {
    alignItems: "center",
    marginTop: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  badge: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: COLORS.textDark,
    textAlign: "center",
    letterSpacing: -0.8,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },

  // ─── Options ─────────────────────────────────────────────────────
  optionsContainer: {
    gap: SPACING.lg,
    marginTop: 180,
  },

  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFAF6", // warm off-white — matches app cards
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#F0DED0", // warm peach border
    minHeight: 84,
    overflow: "hidden",
    // Orange-tinted shadow — same as all cards in the app
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.09,
    shadowRadius: 14,
    elevation: 4,
  },

  // Left accent bar — changes color to option accent when selected
  accentBar: {
    width: 4,
    alignSelf: "stretch",
    borderRadius: 4,
  },

  iconImage: {
    width: 64,
    height: 64,
    marginHorizontal: SPACING.sm,
  },

  optionText: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  optionLabel: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  optionDescription: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textSecondary,
    lineHeight: 18,
  },

  // Checkmark pill — uses option's accent color
  checkmark: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  checkmarkText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  // ─── Hint ────────────────────────────────────────────────────────
  hint: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: SPACING.xl,
  },
});
