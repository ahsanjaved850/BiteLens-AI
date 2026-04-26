import {
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

// ────────────────────────────────────────────────────────────────────
// AI Scanner Comparison — Shows Traditional Method vs BiteLens AI
// Two variants controlled by `variant` prop:
//   "portions" → "Log food portion manually takes forever" vs instant scan
//   "identify" → "Only a limited number of food groups" vs identifies all
// ────────────────────────────────────────────────────────────────────

interface AIScannerComparisonProps {
  variant?: "portions" | "identify";
}

const VARIANTS = {
  portions: {
    subtitle: "Say goodbye to manual input, AI recognition is faster",
    traditional: {
      title: "Log food portion\nmanually takes\nforever",
      icon: "📝",
    },
    ai: {
      title: "A simple scan\ninstantly reveals\nyour food portions",
      icon: "📱",
    },
  },
  identify: {
    subtitle: "Can't find your meal? AI tracker identifies every meal",
    traditional: {
      title: "Only a limited\nnumber of food\ngroups can be\nrecognized",
      icon: "🔍",
    },
    ai: {
      title: "Accurately identifies\nall food components",
      icon: "✅",
    },
  },
} as const;

export const AIScannerComparison: React.FC<AIScannerComparisonProps> = ({
  variant = "portions",
}) => {
  const content = VARIANTS[variant];
  const oldAnim = useRef(new Animated.Value(0)).current;
  const newAnim = useRef(new Animated.Value(0)).current;
  const badgeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(300, [
      Animated.spring(oldAnim, {
        toValue: 1,
        tension: 50,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.spring(newAnim, {
        toValue: 1,
        tension: 50,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.spring(badgeAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.screenContainer}>
        {/* Subtitle */}
        <View style={styles.headerSection}>
          <Text style={styles.subtitle}>{content.subtitle}</Text>
        </View>

        {/* Comparison Cards */}
        <View style={styles.comparisonArea}>
          {/* Traditional Method Card (behind, faded) */}
          <Animated.View
            style={[
              styles.traditionalCard,
              {
                opacity: oldAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.7],
                }),
                transform: [
                  {
                    translateX: oldAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-40, 0],
                    }),
                  },
                  {
                    scale: oldAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.traditionalBadge}>
              <Text style={styles.traditionalBadgeText}>Traditional Method:</Text>
            </View>
            <Text style={styles.traditionalTitle}>{content.traditional.title}</Text>
            <Text style={styles.traditionalIcon}>{content.traditional.icon}</Text>
          </Animated.View>

          {/* BiteLens AI Card (front, prominent) */}
          <Animated.View
            style={[
              styles.aiCard,
              {
                opacity: newAnim,
                transform: [
                  {
                    translateX: newAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [40, 0],
                    }),
                  },
                  {
                    scale: newAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Verified badge */}
            <Animated.View
              style={[
                styles.verifiedBadge,
                {
                  opacity: badgeAnim,
                  transform: [
                    {
                      scale: badgeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.verifiedText}>✓</Text>
            </Animated.View>

            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>BiteLens AI Scanner:</Text>
            </View>
            <Text style={styles.aiTitle}>{content.ai.title}</Text>
            <Text style={styles.aiIcon}>{content.ai.icon}</Text>
          </Animated.View>
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
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },

  // Comparison
  comparisonArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: SPACING.xxxl,
  },

  // Traditional (old) card
  traditionalCard: {
    width: "48%",
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 20,
    padding: SPACING.lg,
    minHeight: 320,
    justifyContent: "flex-start",
    position: "absolute",
    left: 0,
    zIndex: 1,
    ...SHADOWS.small,
  },
  traditionalBadge: {
    backgroundColor: COLORS.textLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginBottom: SPACING.md,
  },
  traditionalBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.white,
  },
  traditionalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textLight,
    lineHeight: 24,
  },
  traditionalIcon: {
    fontSize: 48,
    marginTop: "auto",
    alignSelf: "center",
  },

  // AI (new) card
  aiCard: {
    width: "58%",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    padding: SPACING.lg,
    minHeight: 340,
    justifyContent: "flex-start",
    position: "absolute",
    right: 0,
    zIndex: 2,
    borderWidth: 2,
    borderColor: COLORS.primary,
    ...SHADOWS.medium,
  },
  aiBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginBottom: SPACING.md,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.white,
  },
  aiTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.textDark,
    lineHeight: 26,
  },
  aiIcon: {
    fontSize: 48,
    marginTop: "auto",
    alignSelf: "center",
  },

  // Verified badge
  verifiedBadge: {
    position: "absolute",
    top: -12,
    right: -6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.success,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
    ...SHADOWS.small,
  },
  verifiedText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "800",
  },
});
