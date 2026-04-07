import {
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React from "react";
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: SW, height: SH } = Dimensions.get("window");

const CONTENT = {
  subtitle: "This time is different",
  title: "Let's make your\ngoal a reality",
  chartTitle: "NutriTrack delivers long-term results",
  chartDescription:
    "Avoid the 80% rebound risk of traditional diets with NutriTrack's sustainable solution",
  image: require("@/assets/images/motivation.png"),
} as const;

export const MotivationalSlide: React.FC = () => {
  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.screenContainer}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.subtitle}>{CONTENT.subtitle}</Text>
          <Text style={styles.headerTitle}>{CONTENT.title}</Text>
        </View>

        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={CONTENT.image}
            style={styles.image}
            resizeMode="contain"
          />
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
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.lg,
  },

  headerSection: {
    alignItems: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },

  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },

  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textDark,
    textAlign: "center",
    lineHeight: 36,
  },

  imageContainer: {
    width: "100%",
    height: SH * 0.5,
    maxHeight: 420,
    minHeight: 260,
    borderRadius: 24,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.backgroundCard,
    ...SHADOWS.small,
  },

  image: {
    width: "100%",
    height: "100%",
  },
});