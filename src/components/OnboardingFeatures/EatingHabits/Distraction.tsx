import { COLORS, SPACING } from "@/src/Screens/Onboarding/Onboarding.style";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DistractionProps {
  onValidationChange?: (isValid: boolean) => void;
}

const OPTIONS = [
  {
    label: "Yes, I'm often distracted",
    value: "2",
    icon: require("@/assets/images/icons/distract1.png"),
  },
  {
    label: "Sometimes, not always",
    value: "3",
    icon: require("@/assets/images/icons/distract2.png"),
  },
  {
    label: "Rarely, but usually stay focused",
    value: "4",
    icon: require("@/assets/images/icons/distract3.png"),
  },
  {
    label: "Nope, always focused",
    value: "5",
    icon: require("@/assets/images/icons/distract4.png"),
  },
] as const;

const BEHIND_TEXT =
  "Distraction Patterns: Being distracted while eating can lead to overconsumption and reduced satisfaction. Understanding your eating habits helps us tailor recommendations to support mindful consumption.";

export const Distraction: React.FC<DistractionProps> = ({
  onValidationChange,
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    onValidationChange?.(selected !== null);
  }, [selected]);

  const handlePress = useCallback(async (value: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelected(value);
  }, []);

  const previewText = BEHIND_TEXT.slice(0, 38) + "...";

  return (
    <View style={s.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.backgroundGradientTop}
      />

      {/* Peach → cream → white gradient */}
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
        {/*  Title  */}
        <Text style={s.title}>
          How often are you distracted {"\n"}while eating?
        </Text>

        {/*  Behind the question card  */}
        <TouchableOpacity
          style={s.behindCard}
          onPress={() => setExpanded((v) => !v)}
          activeOpacity={0.75}
        >
          <Text style={s.behindEmoji}>🧐</Text>
          <View style={s.behindBody}>
            <Text style={s.behindTitle}>Behind the question</Text>
            <Text style={s.behindText}>
              {expanded ? BEHIND_TEXT : previewText}
              {!expanded && <Text style={s.behindMore}> More</Text>}
            </Text>
          </View>
        </TouchableOpacity>

        {/*  Options  */}
        <View style={s.options}>
          {OPTIONS.map((opt) => {
            const isSelected = selected === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[s.optionRow, isSelected && s.optionRowSelected]}
                onPress={() => handlePress(opt.value)}
                activeOpacity={0.75}
              >
                {/* Left orange accent bar — appears on selection */}
                <View
                  style={[
                    s.accentBar,
                    {
                      backgroundColor: isSelected
                        ? COLORS.primary
                        : "transparent",
                    },
                  ]}
                />
                <Image
                  source={opt.icon}
                  style={s.iconImage}
                  resizeMode="contain"
                />
                <Text
                  style={[s.optionLabel, isSelected && s.optionLabelSelected]}
                >
                  {opt.label}
                </Text>
                {isSelected && (
                  <View style={s.checkmark}>
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
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },

  //  Title
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -0.8,
    lineHeight: 38,
    marginBottom: SPACING.lg,
    textAlign: "center",
  },

  //  Behind the question card
  behindCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fffaf600",
    borderRadius: 20,
    padding: SPACING.md,
    marginBottom: SPACING.xxxl,
    borderWidth: 2,
    borderColor: "#fafafa",
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
    gap: 12,
  },
  behindEmoji: {
    fontSize: 36,
  },
  behindBody: {
    flex: 1,
  },
  behindTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  behindText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
  behindMore: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  //  Options
  options: {
    gap: 16,
    marginTop: SPACING.xxxl,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFAF6",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#F0DED0",
    minHeight: 70,
    overflow: "hidden",
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  optionRowSelected: {
    borderColor: COLORS.primary,
    backgroundColor: "#FFF3E8",
    shadowOpacity: 0.14,
  },

  // Left orange accent bar — same as meal cards on Home
  accentBar: {
    width: 4,
    alignSelf: "stretch",
    borderRadius: 4,
  },

  iconImage: {
    width: 60,
    height: 60,
    marginHorizontal: SPACING.sm,
  },

  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.textDark,
    paddingRight: SPACING.md,
    letterSpacing: -0.2,
  },
  optionLabelSelected: {
    fontWeight: "600",
    color: COLORS.textDark,
  },

  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  checkmarkText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
