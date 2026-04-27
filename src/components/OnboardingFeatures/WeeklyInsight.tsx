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

const CONTENT = {
  preTitle: "Progress, not perfection",
  title: "One bad meal won't\nruin your week",
  subtitle: "We track weekly trends — so you stay motivated\neven on imperfect days.",
  weekData: [
    { day: "Mon", percent: 95, status: "good" },
    { day: "Tue", percent: 82, status: "good" },
    { day: "Wed", percent: 110, status: "over" },
    { day: "Thu", percent: 88, status: "good" },
    { day: "Fri", percent: 78, status: "good" },
    { day: "Sat", percent: 120, status: "over" },
    { day: "Sun", percent: 90, status: "good" },
  ],
  weeklyAverage: {
    value: "94%",
    label: "Weekly average — right on track!",
    emoji: "🎯",
  },
  principles: [
    {
      emoji: "📊",
      title: "Weekly averages",
      desc: "Your week matters more than any single day",
    },
    {
      emoji: "🎉",
      title: "Celebrate wins",
      desc: "We highlight what you did well, not what went wrong",
    },
    {
      emoji: "🧠",
      title: "Smart insights",
      desc: "AI spots patterns and gives gentle, useful nudges",
    },
  ],
} as const;

const DayBar: React.FC<{
  day: string;
  percent: number;
  status: string;
  index: number;
}> = ({ day, percent, status, index }) => {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const maxBarHeight = 100;
  const barHeight = Math.min((percent / 120) * maxBarHeight, maxBarHeight);
  const isOver = status === "over";

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: barHeight,
      duration: 600,
      delay: 400 + index * 100,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={barStyles.container}>
      <View style={barStyles.barTrack}>
        <View style={barStyles.targetLine} />
        <Animated.View
          style={[
            barStyles.bar,
            {
              height: heightAnim,
              backgroundColor: isOver
                ? "rgba(245, 166, 35, 0.3)"
                : COLORS.primary,
              borderColor: isOver ? COLORS.primary : "transparent",
              borderWidth: isOver ? 1.5 : 0,
              borderStyle: isOver ? "dashed" : "solid",
            },
          ]}
        />
      </View>
      <Text style={[barStyles.dayLabel, isOver && barStyles.dayLabelOver]}>
        {day}
      </Text>
    </View>
  );
};

const barStyles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  barTrack: {
    width: "70%",
    height: 100,
    justifyContent: "flex-end",
    alignItems: "stretch",
    position: "relative",
  },
  targetLine: {
    position: "absolute",
    top: 100 - (100 / 120) * 100,
    left: -4,
    right: -4,
    height: 1.5,
    backgroundColor: COLORS.border,
    zIndex: 1,
  },
  bar: {
    borderRadius: 6,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    minHeight: 4,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textLight,
    marginTop: 6,
  },
  dayLabelOver: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});

export const WeeklyInsight: React.FC = () => {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const chartAnim = useRef(new Animated.Value(0)).current;
  const avgAnim = useRef(new Animated.Value(0)).current;
  const principleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(headerAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(chartAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(avgAnim, { toValue: 1, duration: 400, delay: 1200, useNativeDriver: true }),
      Animated.timing(principleAnim, { toValue: 1, duration: 400, delay: 1600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.screenContainer}>
        <Animated.View
          style={[styles.headerSection, {
            opacity: headerAnim,
            transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
          }]}
        >
          <Text style={styles.preTitle}>{CONTENT.preTitle}</Text>
          <Text style={styles.headerTitle}>{CONTENT.title}</Text>
          <Text style={styles.subtitle}>{CONTENT.subtitle}</Text>
        </Animated.View>

        <Animated.View style={[styles.chartCard, { opacity: chartAnim }]}>
          <Text style={styles.chartLabel}>This Week</Text>
          <View style={styles.barsRow}>
            {CONTENT.weekData.map((d, i) => (
              <DayBar key={d.day} day={d.day} percent={d.percent} status={d.status} index={i} />
            ))}
          </View>
        </Animated.View>

        <Animated.View
          style={[styles.avgCard, {
            opacity: avgAnim,
            transform: [{ scale: avgAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }],
          }]}
        >
          <Text style={styles.avgEmoji}>{CONTENT.weeklyAverage.emoji}</Text>
          <Text style={styles.avgValue}>{CONTENT.weeklyAverage.value}</Text>
          <Text style={styles.avgLabel}>{CONTENT.weeklyAverage.label}</Text>
        </Animated.View>

        <Animated.View style={[styles.principlesContainer, { opacity: principleAnim }]}>
          {CONTENT.principles.map((p, i) => (
            <View key={i} style={styles.principleRow}>
              <Text style={styles.principleEmoji}>{p.emoji}</Text>
              <View style={styles.principleContent}>
                <Text style={styles.principleTitle}>{p.title}</Text>
                <Text style={styles.principleDesc}>{p.desc}</Text>
              </View>
            </View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  screenContainer: { flex: 1, paddingHorizontal: SPACING.lg },
  headerSection: { alignItems: "center", marginTop: SPACING.md, marginBottom: SPACING.lg },
  preTitle: { ...TYPOGRAPHY.body, color: COLORS.success, fontWeight: "700", marginBottom: SPACING.xs },
  headerTitle: { ...TYPOGRAPHY.h1, color: COLORS.textDark, textAlign: "center", lineHeight: 36 },
  subtitle: { ...TYPOGRAPHY.small, color: COLORS.textSecondary, textAlign: "center", marginTop: SPACING.sm, lineHeight: 20 },
  chartCard: { backgroundColor: COLORS.backgroundCard, borderRadius: 20, padding: SPACING.lg, ...SHADOWS.small },
  chartLabel: { ...TYPOGRAPHY.bodySemibold, color: COLORS.textDark, marginBottom: SPACING.md },
  barsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", height: 130, paddingBottom: SPACING.xs },
  avgCard: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.primaryLight, borderRadius: 16, padding: SPACING.md, marginTop: SPACING.md, gap: SPACING.sm },
  avgEmoji: { fontSize: 24 },
  avgValue: { fontSize: 24, fontWeight: "800", color: COLORS.primary },
  avgLabel: { ...TYPOGRAPHY.small, color: COLORS.textSecondary, flex: 1 },
  principlesContainer: { marginTop: SPACING.lg, gap: SPACING.sm },
  principleRow: { flexDirection: "row", alignItems: "center", paddingVertical: 6 },
  principleEmoji: { fontSize: 22, marginRight: SPACING.md },
  principleContent: { flex: 1 },
  principleTitle: { ...TYPOGRAPHY.bodySemibold, color: COLORS.textDark, fontSize: 14 },
  principleDesc: { ...TYPOGRAPHY.small, color: COLORS.textSecondary, lineHeight: 18 },
});
