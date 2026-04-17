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
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

// ────────────────────────────────────────────────────────────────────
// Content
// Validates user's past pain with calorie tracking apps.
// Research context:
//   • 73% of quitters cite "too time-consuming" as primary reason
//   • 80% abandon tracking apps within weeks
//   • 71% of trainers see clients anxious after missing a single day
//   • 27% of users quit an app specifically for mental health reasons
// ────────────────────────────────────────────────────────────────────
const CONTENT = {
  header: {
    subtitle: "Sound familiar?",
    title: "Tracking shouldn't\nfeel like homework",
  },
  painPoints: [
    {
      emoji: "⏱️",
      title: "Endless logging",
      description: "Spending 10+ minutes typing every meal into a database",
    },
    {
      emoji: "🔍",
      title: "Wrong search results",
      description: "Scrolling through 50 entries for one chicken breast",
    },
    {
      emoji: "😔",
      title: "Guilt & shame",
      description: "Feeling terrible when you go over or miss a day",
    },
    {
      emoji: "📉",
      title: "Unrealistic targets",
      description: "Calorie goals so low they set you up to fail",
    },
  ],
  reframe: {
    emoji: "💡",
    title: "It wasn't you — it was the app.",
    description: "NutriTrack was built to fix every single one of these.",
  },
} as const;

// ────────────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────────────
export const PainPointSlide: React.FC = () => {
  // Header fade
  const headerAnim = useRef(new Animated.Value(0)).current;

  // Individual pain point animations
  const painAnims = CONTENT.painPoints.map(
    () => useRef(new Animated.Value(0)).current
  );

  // Reframe card
  const reframeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Header fades in first
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // 2. Pain points stagger in
    Animated.stagger(
      150,
      painAnims.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 420,
          delay: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      )
    ).start();

    // 3. Reframe card springs in last
    Animated.spring(reframeAnim, {
      toValue: 1,
      tension: 50,
      friction: 9,
      delay: 300 + 150 * CONTENT.painPoints.length + 400,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.screenContainer}>
        {/* ── Header ── */}
        <Animated.View
          style={[
            styles.headerSection,
            {
              opacity: headerAnim,
              transform: [
                {
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [18, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.subtitle}>{CONTENT.header.subtitle}</Text>
          <Text style={styles.headerTitle}>{CONTENT.header.title}</Text>
        </Animated.View>

        {/* ── Pain Point Cards ── */}
        <View style={styles.painContainer}>
          {CONTENT.painPoints.map((point, index) => (
            <Animated.View
              key={index}
              style={[
                styles.painCard,
                {
                  opacity: painAnims[index],
                  transform: [
                    {
                      translateX: painAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [-24, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.painEmoji}>{point.emoji}</Text>
              <View style={styles.painContent}>
                <Text style={styles.painTitle}>{point.title}</Text>
                <Text style={styles.painDescription}>{point.description}</Text>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* ── Reframe Card ── */}
        <Animated.View
          style={[
            styles.reframeCard,
            {
              opacity: reframeAnim,
              transform: [
                {
                  translateY: reframeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                  }),
                },
                {
                  scale: reframeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.reframeEmoji}>{CONTENT.reframe.emoji}</Text>
          <View style={styles.reframeContent}>
            <Text style={styles.reframeTitle}>{CONTENT.reframe.title}</Text>
            <Text style={styles.reframeDescription}>
              {CONTENT.reframe.description}
            </Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

// ────────────────────────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  /* ── Layout ── */
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: "center",
  },

  /* ── Header ── */
  headerSection: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  subtitle: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.xs,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textDark,
    textAlign: "center",
    lineHeight: 36,
  },

  /* ── Pain Cards ── */
  painContainer: {
    gap: 10,
    marginBottom: SPACING.xl,
  },
  painCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
  },
  painEmoji: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  painContent: {
    flex: 1,
  },
  painTitle: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.textDark,
    marginBottom: 2,
  },
  painDescription: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  /* ── Reframe Card ── */
  reframeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.primary,
    ...SHADOWS.small,
  },
  reframeEmoji: {
    fontSize: 36,
    marginRight: SPACING.md,
  },
  reframeContent: {
    flex: 1,
  },
  reframeTitle: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.textDark,
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 4,
  },
  reframeDescription: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
