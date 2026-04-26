import {
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { height: SH } = Dimensions.get("window");

const CONTENT = {
  preTitle: "Why this time works",
  title: "Flexible beats rigid.\nAlways.",
  image: require("@/assets/images/motivation.png"),
  comparison: [
    {
      label: "Rigid diets",
      points: ["All-or-nothing mindset", "One bad day = give up", "Generic targets"],
      emoji: "😤",
    },
    {
      label: "BiteLens",
      points: ["Progress over perfection", "Weekly trends matter", "AI adapts to you"],
      emoji: "😊",
    },
  ],
  bottomLine: "80% of rigid dieters regain weight.\nBiteLens's flexible approach keeps you going.",
} as const;

export const MotivationalSlide: React.FC = () => {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(0)).current;
  const compAnim = useRef(new Animated.Value(0)).current;
  const bottomAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(200, [
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
      Animated.timing(compAnim, {
        toValue: 1,
        duration: 500,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(bottomAnim, {
        toValue: 1,
        duration: 400,
        delay: 600,
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
          <Text style={styles.preTitle}>{CONTENT.preTitle}</Text>
          <Text style={styles.headerTitle}>{CONTENT.title}</Text>
        </Animated.View>

        {/* Image */}
        <Animated.View
          style={[
            styles.imageContainer,
            {
              opacity: imageAnim,
              transform: [
                {
                  scale: imageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Image
            source={CONTENT.image}
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Comparison Row */}
        <Animated.View style={[styles.compRow, { opacity: compAnim }]}>
          <View style={styles.compCardOld}>
            <Text style={styles.compEmoji}>{CONTENT.comparison[0].emoji}</Text>
            <Text style={styles.compLabelOld}>{CONTENT.comparison[0].label}</Text>
            {CONTENT.comparison[0].points.map((p, i) => (
              <View key={i} style={styles.compPoint}>
                <Text style={styles.compX}>✕</Text>
                <Text style={styles.compPointText}>{p}</Text>
              </View>
            ))}
          </View>

          <View style={styles.compCardNew}>
            <Text style={styles.compEmoji}>{CONTENT.comparison[1].emoji}</Text>
            <Text style={styles.compLabelNew}>{CONTENT.comparison[1].label}</Text>
            {CONTENT.comparison[1].points.map((p, i) => (
              <View key={i} style={styles.compPoint}>
                <Text style={styles.compCheck}>✓</Text>
                <Text style={styles.compPointTextNew}>{p}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Bottom line */}
        <Animated.View style={[styles.bottomSection, { opacity: bottomAnim }]}>
          <Text style={styles.bottomText}>{CONTENT.bottomLine}</Text>
        </Animated.View>
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
  },
  headerSection: {
    alignItems: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  preTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.success,
    fontWeight: "700",
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
    height: SH * 0.22,
    maxHeight: 200,
    minHeight: 140,
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.backgroundCard,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  compRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  compCardOld: {
    flex: 1,
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 16,
    padding: SPACING.md,
    alignItems: "center",
  },
  compCardNew: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    padding: SPACING.md,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  compEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  compLabelOld: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
    fontSize: 13,
  },
  compLabelNew: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    fontSize: 13,
    fontWeight: "800",
  },
  compPoint: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 5,
  },
  compX: {
    fontSize: 12,
    color: COLORS.textLight,
    marginRight: 6,
    fontWeight: "700",
  },
  compCheck: {
    fontSize: 12,
    color: COLORS.success,
    marginRight: 6,
    fontWeight: "700",
  },
  compPointText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  compPointTextNew: {
    ...TYPOGRAPHY.small,
    color: COLORS.textDark,
    lineHeight: 18,
    fontWeight: "500",
  },
  bottomSection: {
    marginTop: SPACING.lg,
    alignItems: "center",
  },
  bottomText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
