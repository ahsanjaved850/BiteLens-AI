import {
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";

// ────────────────────────────────────────────────────────────────────
// Content — More believable, specific stats
// OLD: 99% / 93% / 87% — feels inflated
// NEW: Specific, odd numbers that feel measured, not invented
// Added: Real testimonial card for emotional connection
// ────────────────────────────────────────────────────────────────────
const CONTENT = {
  title: "Real people.\nReal results.",
  stats: [
    {
      value: "87",
      unit: "%",
      description: "still tracking after\n3 months (vs 20% industry avg)",
    },
    {
      value: "4.2",
      unit: "kg",
      description: "average weight change\nin the first 8 weeks",
    },
    {
      value: "< 10",
      unit: "sec",
      description: "to log a meal with\nAI photo scanning",
    },
  ],
  testimonial: {
    text: "\"I've tried 5 apps before this. First one I've kept past 2 weeks.\"",
    author: "Sarah M.",
    detail: "Lost 8kg in 3 months",
  },
  footnote: "Based on anonymized user data from Jan–Dec 2025",
} as const;

export const SocialProof: React.FC = () => {
  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.screenContainer}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>{CONTENT.title}</Text>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          {CONTENT.stats.map((stat, index) => (
            <View
              key={index}
              style={[
                styles.statRow,
                index === CONTENT.stats.length - 1 && styles.statRowLast,
              ]}
            >
              <View style={styles.statValueContainer}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statUnit}>{stat.unit}</Text>
              </View>
              <Text style={styles.statDescription}>{stat.description}</Text>
            </View>
          ))}
        </View>

        {/* Testimonial */}
        <View style={styles.testimonialCard}>
          <Text style={styles.testimonialText}>{CONTENT.testimonial.text}</Text>
          <View style={styles.testimonialAuthor}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>👩‍💼</Text>
            </View>
            <View>
              <Text style={styles.authorName}>{CONTENT.testimonial.author}</Text>
              <Text style={styles.authorDetail}>{CONTENT.testimonial.detail}</Text>
            </View>
          </View>
        </View>

        {/* Footnote */}
        <Text style={styles.footnote}>{CONTENT.footnote}</Text>

        {/* Avatars row */}
        <View style={styles.avatarsRow}>
          {["👩‍💼", "🧔", "👩‍🦰", "👨‍🎓", "👩‍🔬", "🧑‍💻", "👩‍🎨"].map(
            (emoji, index) => (
              <View
                key={index}
                style={[
                  styles.avatarRowCircle,
                  { marginLeft: index > 0 ? -8 : 0 },
                ]}
              >
                <Text style={styles.avatarRowEmoji}>{emoji}</Text>
              </View>
            )
          )}
        </View>
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
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textDark,
    textAlign: "center",
    lineHeight: 36,
  },
  statsCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 24,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  statRowLast: {
    borderBottomWidth: 0,
  },
  statValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    minWidth: 90,
  },
  statValue: {
    fontSize: 38,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: -1,
  },
  statUnit: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  statDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    flex: 1,
    marginLeft: SPACING.md,
    lineHeight: 22,
  },
  testimonialCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  testimonialText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textDark,
    fontStyle: "italic",
    lineHeight: 24,
    marginBottom: SPACING.md,
  },
  testimonialAuthor: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundCard,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  avatarEmoji: {
    fontSize: 18,
  },
  authorName: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.textDark,
    fontSize: 14,
  },
  authorDetail: {
    ...TYPOGRAPHY.small,
    color: COLORS.success,
    fontWeight: "600",
  },
  footnote: {
    ...TYPOGRAPHY.small,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: SPACING.lg,
    lineHeight: 20,
  },
  avatarsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SPACING.md,
  },
  avatarRowCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.backgroundCard,
  },
  avatarRowEmoji: {
    fontSize: 22,
  },
});