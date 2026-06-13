import { COLORS, SPACING } from "@/src/Screens/Onboarding/Onboarding.style";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: SW } = Dimensions.get("window");

// Review data
const REVIEWS = [
  {
    image: require("@/assets/images/Onboarding/review1.png"),
    name: "James K.",
    quote:
      "I never thought tracking could be this easy. Orca changed everything for me!",
    stars: 5,
  },
  {
    image: require("@/assets/images/Onboarding/review2.png"),
    name: "Natalie R.",
    quote:
      "The AI scan is insane. I just snap my meal and it does the rest. Game changer.",
    stars: 5,
  },
  {
    image: require("@/assets/images/Onboarding/review3.png"),
    name: "Tom W.",
    quote:
      "Finally an app that actually works. I feel confident in my body again.",
    stars: 5,
  },
  {
    image: require("@/assets/images/Onboarding/review4.png"),
    name: "Sarah M.",
    quote:
      "Simple, fast, and accurate. My macros have never been this on point.",
    stars: 5,
  },
] as const;

const CARD_W = SW * 0.72;
const CARD_GAP = 14;
const SCROLL_INTERVAL_MS = 2500;

type TransformationReviewsProps = {
  /**
   * Pass true only when this onboarding slide is currently visible.
   * Example:
   * <TransformationReviews isActive={currentSlideIndex === 3} />
   */
  isActive?: boolean;
};

// Star Row
const Stars: React.FC<{ count: number }> = ({ count }) => (
  <View style={s.starsRow}>
    {Array.from({ length: count }).map((_, i) => (
      <Text key={i} style={s.star}>
        ★
      </Text>
    ))}
  </View>
);

// Main Component
export const TransformationReviews: React.FC<TransformationReviewsProps> = ({
  isActive = true,
}) => {
  const scrollRef = useRef<ScrollView>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const dotsAnim = useRef(new Animated.Value(0)).current;

  const cardAnims = useRef(REVIEWS.map(() => new Animated.Value(0))).current;

  const resetAnimations = () => {
    headerAnim.setValue(0);
    dotsAnim.setValue(0);

    cardAnims.forEach((anim) => {
      anim.setValue(0);
    });

    setActiveIndex(0);

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        x: 0,
        animated: false,
      });
    });
  };

  // Entrance animation: content shows one by one when this slide becomes active
  useEffect(() => {
    if (!isActive) {
      resetAnimations();
      return;
    }

    const animation = Animated.sequence([
      Animated.spring(headerAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),

      Animated.stagger(
        160,
        cardAnims.map((anim) =>
          Animated.spring(anim, {
            toValue: 1,
            tension: 45,
            friction: 8,
            useNativeDriver: true,
          }),
        ),
      ),

      Animated.timing(dotsAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [isActive]);

  // Auto-scroll only when this slide is active
  useEffect(() => {
    if (!isActive) return;

    let interval: ReturnType<typeof setInterval>;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setActiveIndex((prev) => {
          const next = (prev + 1) % REVIEWS.length;

          scrollRef.current?.scrollTo({
            x: next * (CARD_W + CARD_GAP),
            animated: true,
          });

          return next;
        });
      }, SCROLL_INTERVAL_MS);
    }, 1800);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

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

      {/* Header */}
      <Animated.View
        style={[
          s.header,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [24, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={s.headline}>
          They did it,{"\n"}
          <Text style={s.headlineAccent}>So can You.</Text>
        </Text>

        <Text style={s.subtitle}>
          Join a community of users who transformed their health with Us
        </Text>
      </Animated.View>

      {/* Scrolling Review Cards */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={CARD_W + CARD_GAP}
        contentContainerStyle={s.scrollContent}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(
            e.nativeEvent.contentOffset.x / (CARD_W + CARD_GAP),
          );

          const safeIndex = Math.max(0, Math.min(idx, REVIEWS.length - 1));
          setActiveIndex(safeIndex);
        }}
      >
        {REVIEWS.map((review, i) => {
          const isCardActive = i === activeIndex;

          return (
            <Animated.View
              key={i}
              style={[
                s.card,
                isCardActive && s.cardActive,
                {
                  opacity: cardAnims[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, isCardActive ? 1 : 0.75],
                  }),
                  transform: [
                    {
                      translateY: cardAnims[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [36, 0],
                      }),
                    },
                    {
                      scale: cardAnims[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.94, isCardActive ? 1 : 0.96],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={s.imageWrap}>
                <Image
                  source={review.image}
                  style={s.image}
                  resizeMode="cover"
                />
              </View>

              <View style={s.reviewBody}>
                <Stars count={review.stars} />

                <Text style={s.quote}>"{review.quote}"</Text>

                <View style={s.reviewer}>
                  <View style={s.reviewerDot} />
                  <Text style={s.reviewerName}>{review.name}</Text>
                </View>
              </View>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Dot indicators */}
      <Animated.View
        style={[
          s.dots,
          {
            opacity: dotsAnim,
            transform: [
              {
                translateY: dotsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [12, 0],
                }),
              },
            ],
          },
        ]}
      >
        {REVIEWS.map((_, i) => (
          <View
            key={i}
            style={[s.dot, i === activeIndex ? s.dotActive : s.dotInactive]}
          />
        ))}
      </Animated.View>
    </View>
  );
};

// Styles
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.backgroundGradientTop,
  },

  header: {
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },

  headline: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.textDark,
    textAlign: "center",
    letterSpacing: -1,
    lineHeight: 42,
  },

  headlineAccent: {
    color: COLORS.primary,
  },

  subtitle: {
    fontSize: 14,
    fontWeight: "300",
    color: "black",
    textAlign: "center",
    lineHeight: 20,
    marginTop: SPACING.sm,
  },

  scrollContent: {
    paddingLeft: (SW - CARD_W) / 2,
    paddingRight: (SW - CARD_W) / 2,
    gap: CARD_GAP,
    alignItems: "flex-start",
  },

  card: {
    width: CARD_W,
    backgroundColor: "#FFFAF6",
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: "#F0DED0",
    overflow: "hidden",
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.09,
    shadowRadius: 16,
    elevation: 5,
  },

  cardActive: {
    borderColor: COLORS.primary,
    shadowOpacity: 0.16,
  },

  imageWrap: {
    width: "100%",
    height: CARD_W * 0.9,
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  reviewBody: {
    padding: 16,
    gap: 8,
  },

  starsRow: {
    flexDirection: "row",
    gap: 2,
  },

  star: {
    fontSize: 14,
    color: COLORS.primary,
  },

  quote: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontStyle: "italic",
  },

  reviewer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },

  reviewerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },

  reviewerName: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },

  dot: {
    height: 8,
    borderRadius: 4,
  },

  dotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
  },

  dotInactive: {
    width: 8,
    backgroundColor: "#F0DED0",
  },
});
