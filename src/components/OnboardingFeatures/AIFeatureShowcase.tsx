import {
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

// ────────────────────────────────────────────────────────────────────
// Content — Showcases the AI scanning experience
// Research: Photo-based tracking boosts adherence from 23% to 87%
//           Users want logging in under 5 seconds
//           "Snap. Done." is the core value proposition
// ────────────────────────────────────────────────────────────────────
const CONTENT = {
  header: {
    preTitle: "No more manual logging",
    title: "Snap a photo.\nGet instant macros.",
  },
  image: require("@/assets/images/vegan.jpg"),
  scanResults: [
    { label: "Calories", value: "324", unit: "kcal", color: "#FF6B6B", delay: 800 },
    { label: "Protein", value: "28", unit: "g", color: "#2196F3", delay: 1000 },
    { label: "Carbs", value: "38", unit: "g", color: "#8BC34A", delay: 1200 },
    { label: "Fat", value: "12", unit: "g", color: "#F5A623", delay: 1400 },
  ],
  timing: {
    value: "< 3 sec",
    label: "Average scan time",
  },
  features: [
    { emoji: "🍕", text: "Restaurant meals" },
    { emoji: "🍳", text: "Homemade food" },
    { emoji: "🌮", text: "Any cuisine" },
  ],
} as const;

// ────────────────────────────────────────────────────────────────────
// Animated Scan Line
// ────────────────────────────────────────────────────────────────────
const ScanLine: React.FC = () => {
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.scanLine,
        {
          transform: [
            {
              translateY: scanAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 150],
              }),
            },
          ],
        },
      ]}
    />
  );
};

// ────────────────────────────────────────────────────────────────────
// Animated Result Row
// ────────────────────────────────────────────────────────────────────
const ResultRow: React.FC<{
  label: string;
  value: string;
  unit: string;
  color: string;
  delay: number;
}> = ({ label, value, unit, color, delay }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      tension: 60,
      friction: 8,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.resultRow,
        {
          opacity: anim,
          transform: [
            {
              translateX: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [40, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={[styles.resultDot, { backgroundColor: color }]} />
      <Text style={styles.resultLabel}>{label}</Text>
      <View style={styles.resultValueWrap}>
        <Text style={styles.resultValue}>{value}</Text>
        <Text style={styles.resultUnit}>{unit}</Text>
      </View>
    </Animated.View>
  );
};

// ────────────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────────────
export const AIFeatureShowcase: React.FC = () => {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(0)).current;
  const badgeAnim = useRef(new Animated.Value(0)).current;
  const featureAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(imageAnim, {
        toValue: 1,
        tension: 45,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(badgeAnim, {
        toValue: 1,
        duration: 400,
        delay: 1600,
        useNativeDriver: true,
      }),
      Animated.timing(featureAnim, {
        toValue: 1,
        duration: 400,
        delay: 1800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.screenContainer}>
        {/* Header */}
        <Animated.View
          style={[
            styles.headerSection,
            {
              opacity: headerAnim,
              transform: [
                {
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.preTitle}>{CONTENT.header.preTitle}</Text>
          <Text style={styles.headerTitle}>{CONTENT.header.title}</Text>
        </Animated.View>

        {/* Scan Area — Image + Results side by side */}
        <Animated.View
          style={[
            styles.scanArea,
            {
              opacity: imageAnim,
              transform: [
                {
                  scale: imageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.92, 1],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Food Image with Scan Effect */}
          <View style={styles.imageSection}>
            <View style={styles.imageWrapper}>
              <Image
                source={CONTENT.image}
                style={styles.image}
                resizeMode="cover"
              />
              <ScanLine />
              {/* Corner brackets for scan effect */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
          </View>

          {/* Results Card */}
          <View style={styles.resultsCard}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>AI Analysis</Text>
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>LIVE</Text>
              </View>
            </View>
            {CONTENT.scanResults.map((item) => (
              <ResultRow
                key={item.label}
                label={item.label}
                value={item.value}
                unit={item.unit}
                color={item.color}
                delay={item.delay}
              />
            ))}
          </View>
        </Animated.View>

        {/* Speed Badge */}
        <Animated.View style={[styles.speedBadge, { opacity: badgeAnim }]}>
          <Text style={styles.speedIcon}>⚡</Text>
          <Text style={styles.speedValue}>{CONTENT.timing.value}</Text>
          <Text style={styles.speedLabel}>{CONTENT.timing.label}</Text>
        </Animated.View>

        {/* Feature Tags */}
        <Animated.View style={[styles.featureRow, { opacity: featureAnim }]}>
          {CONTENT.features.map((feat, i) => (
            <View key={i} style={styles.featureTag}>
              <Text style={styles.featureEmoji}>{feat.emoji}</Text>
              <Text style={styles.featureText}>{feat.text}</Text>
            </View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
};

// ────────────────────────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────────────────────────
const CORNER_SIZE = 20;
const CORNER_THICK = 3;

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
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  preTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: "700",
    marginBottom: SPACING.xs,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textDark,
    textAlign: "center",
    lineHeight: 36,
  },

  // Scan Area
  scanArea: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 24,
    padding: SPACING.md,
    ...SHADOWS.medium,
  },
  imageSection: {
    marginBottom: SPACING.md,
  },
  imageWrapper: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  scanLine: {
    position: "absolute",
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 3,
  },

  // Corner brackets
  corner: {
    position: "absolute",
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  },
  cornerTL: {
    top: 8,
    left: 8,
    borderTopWidth: CORNER_THICK,
    borderLeftWidth: CORNER_THICK,
    borderColor: COLORS.primary,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 8,
    right: 8,
    borderTopWidth: CORNER_THICK,
    borderRightWidth: CORNER_THICK,
    borderColor: COLORS.primary,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 8,
    left: 8,
    borderBottomWidth: CORNER_THICK,
    borderLeftWidth: CORNER_THICK,
    borderColor: COLORS.primary,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 8,
    right: 8,
    borderBottomWidth: CORNER_THICK,
    borderRightWidth: CORNER_THICK,
    borderColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },

  // Results Card
  resultsCard: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: SPACING.md,
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  resultsTitle: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.textDark,
    fontWeight: "800",
  },
  aiBadge: {
    backgroundColor: COLORS.success,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: 1,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  resultDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.sm,
  },
  resultLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    flex: 1,
  },
  resultValueWrap: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  resultValue: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  resultUnit: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textLight,
    marginLeft: 3,
  },

  // Speed badge
  speedBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    padding: SPACING.md,
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  speedIcon: {
    fontSize: 20,
  },
  speedValue: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.primary,
  },
  speedLabel: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
  },

  // Feature tags
  featureRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  featureTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  featureEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  featureText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
});
