import { COLORS, SPACING } from "@/src/Screens/Onboarding/Onboarding.style";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

// ─── Stats data ────────────────────────────────────────────────────────────
const STATS = [
  { value: 97, label: "of users feel more in control\nof their eating habits" },
  { value: 91, label: "of users achieved noticeable\nhealth gains in 30 days" },
  { value: 89, label: "of users saw real progress\nin their very first month" },
] as const;

// ─── Animated counter ──────────────────────────────────────────────────────
const useCountUp = (target: number, duration: number, delay: number) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, []);
  return val;
};

// ─── Single stat row ───────────────────────────────────────────────────────
const StatRow: React.FC<{
  value: number;
  label: string;
  delay: number;
  rowAnim: Animated.Value;
  isLast?: boolean;
}> = ({ value, label, delay, rowAnim, isLast }) => {
  const displayed = useCountUp(value, 1200, delay);

  return (
    <Animated.View
      style={[
        s.statRow,
        !isLast && s.statRowBorder,
        {
          opacity: rowAnim,
          transform: [
            {
              translateX: rowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-30, 0],
              }),
            },
          ],
        },
      ]}
    >
      {/* Big percentage number */}
      <View style={s.statNumWrap}>
        <Text style={s.statNum}>{displayed}</Text>
        <Text style={s.statPct}>%</Text>
      </View>

      {/* Description */}
      <Text style={s.statLabel}>{label}</Text>
    </Animated.View>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────
export const SocialProofStats: React.FC = () => {
  const titleAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const footerAnim = useRef(new Animated.Value(0)).current;
  const rowAnims = useRef(STATS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // UI entrance — native driver
    Animated.stagger(140, [
      Animated.spring(titleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(cardAnim, {
        toValue: 1,
        tension: 44,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(footerAnim, {
        toValue: 1,
        tension: 48,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Row slide-ins — staggered, native driver
    const t = setTimeout(() => {
      Animated.stagger(
        200,
        rowAnims.map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ),
      ).start();
    }, 400);

    return () => clearTimeout(t);
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

      <View style={s.content}>
        {/* ── Title ── */}
        <Animated.Text
          style={[
            s.title,
            {
              opacity: titleAnim,
              transform: [
                {
                  translateY: titleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          Orca was made for people{"\n"}just like you!
        </Animated.Text>

        {/* ── Stats card ── */}
        <Animated.View
          style={[
            s.card,
            {
              opacity: cardAnim,
              transform: [
                {
                  scale: cardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.94, 1],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Thumbs up badge — top right */}
          <View style={s.thumbBadge}>
            <Text style={s.thumbEmoji}>👍</Text>
          </View>

          {STATS.map((stat, i) => (
            <StatRow
              key={i}
              value={stat.value}
              label={stat.label}
              delay={500 + i * 200}
              rowAnim={rowAnims[i]}
              isLast={i === STATS.length - 1}
            />
          ))}
        </Animated.View>

        {/* ── Validation note ── */}
        <Animated.Text style={[s.footnote, { opacity: footerAnim }]}>
          Validated by independent surveys and real user testimonials
        </Animated.Text>

        {/* ── People illustration / image ── */}
        <Animated.View
          style={[
            s.peopleWrap,
            {
              opacity: footerAnim,
              transform: [
                {
                  translateY: footerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Diverse avatars rendered as emoji crowd — replace with your image if available */}
          <View style={s.avatarRow}>
            {["👩🏿", "👨🏻‍🦱", "👩🏽", "👩🏾", "👨🏽‍🦳", "👩🏻‍🦰", "👨🏾"].map((em, i) => (
              <View
                key={i}
                style={[
                  s.avatar,
                  { zIndex: 10 - i, marginLeft: i > 0 ? -14 : 0 },
                ]}
              >
                <Text style={s.avatarEmoji}>{em}</Text>
              </View>
            ))}
          </View>
          <Text style={s.avatarLabel}>500K+ people tracking smarter</Text>
        </Animated.View>
      </View>
    </View>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.backgroundGradientTop,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },

  // Title
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -0.8,
    lineHeight: 38,
    marginBottom: SPACING.xl,
    textAlign: "center",
  },

  // Stats card
  card: {
    backgroundColor: "#FFFAF6",
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: "#F0DED0",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    overflow: "visible",
  },

  // Thumbs up badge — top right corner of card
  thumbBadge: {
    position: "absolute",
    top: -20,
    right: SPACING.lg,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFF3E8",
    borderWidth: 2,
    borderColor: "#F0DED0",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  thumbEmoji: {
    fontSize: 26,
  },

  // Stat row
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
  },
  statRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0DED0",
  },
  statNumWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    minWidth: 88,
  },
  statNum: {
    fontSize: 52,
    fontWeight: "700",
    color: COLORS.primary, // brand orange — replaces reference's green
    letterSpacing: -2,
    lineHeight: 58,
  },
  statPct: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 8,
    marginLeft: 2,
  },
  statLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
    lineHeight: 21,
  },

  // Footnote
  footnote: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },

  // Avatar crowd
  peopleWrap: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: SPACING.lg,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF5EC",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: {
    fontSize: 28,
  },
  avatarLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
});
