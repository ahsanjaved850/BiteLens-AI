import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  SHADOWS,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React from "react";
import { StatusBar, Text, View, StyleSheet } from "react-native";

const CONTENT = {
  title: "NutriTrack was made for\npeople just like you!",
  stats: [
    { value: "99", unit: "%", description: "of users feel more\nsupported with NutriTrack" },
    { value: "93", unit: "%", description: "of users achieved\nnoticeable health gains" },
    { value: "87", unit: "%", description: "of users saw progress in\nthe first month" },
  ],
  footnote: "Validated by independent surveys and real user testimonials",
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
          {/* Thumbs up */}
          <View style={styles.thumbsContainer}>
            <Text style={styles.thumbsEmoji}>👍✨</Text>
          </View>

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

        {/* Footnote */}
        <Text style={styles.footnote}>{CONTENT.footnote}</Text>

        {/* Avatars row */}
        <View style={styles.avatarsRow}>
          {["👩‍💼", "🧔", "👩‍🦰", "👨‍🎓", "👩‍🔬", "🧑‍💻", "👩‍🎨"].map((emoji, index) => (
            <View
              key={index}
              style={[
                styles.avatarCircle,
                { marginLeft: index > 0 ? -8 : 0 },
              ]}
            >
              <Text style={styles.avatarEmoji}>{emoji}</Text>
            </View>
          ))}
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
  thumbsContainer: {
    alignItems: "flex-end",
    marginBottom: SPACING.sm,
  },
  thumbsEmoji: {
    fontSize: 32,
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
    fontSize: 42,
    fontWeight: "800",
    color: COLORS.success,
    letterSpacing: -1,
  },
  statUnit: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.success,
  },
  statDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    flex: 1,
    marginLeft: SPACING.md,
    lineHeight: 22,
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
    marginTop: SPACING.xl,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.backgroundCard,
  },
  avatarEmoji: {
    fontSize: 22,
  },
});
