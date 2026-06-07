import { COLORS, SPACING } from "@/src/Screens/Onboarding/Onboarding.style";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PastExperienceProps {
  onValidationChange?: (isValid: boolean) => void;
}

const BEHIND_TEXT =
  "Past Experience: Understanding your previous experiences with dieting and weight loss can help us tailor our approach to better support your unique journey and avoid past pitfalls.";

export const PastExperience: React.FC<PastExperienceProps> = ({
  onValidationChange,
}) => {
  const [selected, setSelected] = useState<"yes" | "no" | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    onValidationChange?.(selected !== null);
  }, [selected]);

  const handlePress = useCallback(async (value: "yes" | "no") => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelected(value);
  }, []);

  return (
    <View style={s.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.backgroundGradientTop}
      />

      <LinearGradient
        colors={[
          COLORS.backgroundGradientTop,
          COLORS.backgroundGradientMid,
          COLORS.backgroundGradientBottom,
        ]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* ── Top section: title + behind card ── */}
      <View style={s.topSection}>
        <Text style={s.title}>
          Have you tried weight loss method involving a restricted diet before?
        </Text>

        {/* Behind the question card */}
        <TouchableOpacity
          style={s.behindCard}
          onPress={() => setExpanded((v) => !v)}
          activeOpacity={0.75}
        >
          <Text style={s.behindEmoji}>🧐</Text>
          <View style={s.behindBody}>
            <Text style={s.behindTitle}>Behind the question</Text>
            <Text style={s.behindText}>
              {expanded ? BEHIND_TEXT : BEHIND_TEXT.slice(0, 38) + "..."}
              {!expanded && <Text style={s.moreLink}> More</Text>}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* ── Yes / No — centered lower on screen ── */}
      <View style={s.optionsWrap}>
        {/* Yes */}
        <TouchableOpacity
          style={[s.optionRow, selected === "yes" && s.optionRowSelected]}
          onPress={() => handlePress("yes")}
          activeOpacity={0.75}
        >
          <View style={[s.iconCircle, s.iconCircleYes]}>
            <Text style={s.iconText}>✓</Text>
          </View>
          <Text
            style={[s.optionLabel, selected === "yes" && s.optionLabelSelected]}
          >
            Yes
          </Text>
          {selected === "yes" && (
            <View style={s.checkmark}>
              <Text style={s.checkmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* No */}
        <TouchableOpacity
          style={[s.optionRow, selected === "no" && s.optionRowSelected]}
          onPress={() => handlePress("no")}
          activeOpacity={0.75}
        >
          <View style={[s.iconCircle, s.iconCircleNo]}>
            <Text style={s.iconText}>✕</Text>
          </View>
          <Text
            style={[s.optionLabel, selected === "no" && s.optionLabelSelected]}
          >
            No
          </Text>
          {selected === "no" && (
            <View style={s.checkmark}>
              <Text style={s.checkmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.backgroundGradientTop,
    paddingHorizontal: SPACING.lg,
  },

  // ─── Top: title + behind card ───────────────────────────────────
  topSection: {
    marginTop: SPACING.xl,
    gap: SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -0.8,
    lineHeight: 40,
    textAlign: "center",
  },

  // Behind the question card
  behindCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fffaf600",
    borderRadius: 20,
    padding: SPACING.md,
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
  moreLink: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  // ─── Options — lower center ──────────────────────────────────────
  optionsWrap: {
    position: "absolute",
    bottom: SPACING.xxxl,
    left: SPACING.lg,
    right: SPACING.lg,
    gap: 16,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFAF6",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#F0DED0",
    minHeight: 72,
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
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

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  iconCircleYes: {
    backgroundColor: "#2ECC71",
  },
  iconCircleNo: {
    backgroundColor: "#EF4444",
  },
  iconText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  optionLabel: {
    flex: 1,
    fontSize: 17,
    fontWeight: "500",
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  optionLabelSelected: {
    fontWeight: "600",
  },

  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});

// Have you tried weight loss method involing a restricted diet before?
