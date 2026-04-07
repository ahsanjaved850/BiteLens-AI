import { updateWeightStats } from "@/backend/sendData";
import {
  COLORS,
  SHADOWS,
  SPACING,
} from "@/src/Screens/Onboarding/Onboarding.style";
import { getGlobalCurrentWeight } from "@/src/components/OnboardingFeatures/CurrentWeight";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SW } = Dimensions.get("window");

interface TargetWeightProps {
  onValidationChange?: (isValid: boolean) => void;
}

// ── Config ─────────────────────────────────────────────────────────
const ITEM_H = 68;
const PAD = ITEM_H * 3;
const WEIGHTS = Array.from({ length: 171 }, (_, i) => 30 + i); // 30–200 kg
const SAVE_DEBOUNCE = 1000;

export const TargetWeight: React.FC<TargetWeightProps> = ({
  onValidationChange,
}) => {
  const currentW = getGlobalCurrentWeight();
  const [selected, setSelected] = useState(currentW > 30 ? currentW - 3 : 70);
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const listRef = useRef<FlatList>(null);
  const savedRef = useRef(false);

  useEffect(() => {
    onValidationChange?.(true);
  }, []);

  // Scroll to default
  useEffect(() => {
    const t = setTimeout(() => {
      const idx = WEIGHTS.indexOf(selected);
      if (idx >= 0) {
        listRef.current?.scrollToOffset({ offset: idx * ITEM_H, animated: false });
      }
    }, 150);
    return () => clearTimeout(t);
  }, []);

  // Save to backend
  useEffect(() => {
    savedRef.current = false;
    const timer = setTimeout(() => {
      try {
        updateWeightStats(String(currentW), String(selected));
        if (!savedRef.current) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          savedRef.current = true;
        }
      } catch (e) {
        console.error("Error saving weight stats:", e);
      }
    }, SAVE_DEBOUNCE);
    return () => clearTimeout(timer);
  }, [selected]);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
      const clamped = Math.max(0, Math.min(idx, WEIGHTS.length - 1));
      if (WEIGHTS[clamped] !== selected) {
        setSelected(WEIGHTS[clamped]);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    [selected]
  );

  const onMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
      listRef.current?.scrollToOffset({ offset: idx * ITEM_H, animated: true });
    },
    []
  );

  const kgToLbs = (kg: number) => Math.round(kg * 2.20462);
  const displayW = (kg: number) => (unit === "kg" ? `${kg}` : `${kgToLbs(kg)}`);
  const unitLabel = unit === "kg" ? "kg" : "lbs";

  // Diff message
  const diff = selected - currentW;
  const diffAbs = Math.abs(diff);
  const diffMsg =
    diff < 0
      ? { badge: "Let's go", text: `You will lose ${diffAbs}${unitLabel}`, color: COLORS.success }
      : diff > 0
      ? { badge: "Let's go", text: `You will gain ${diffAbs}${unitLabel}`, color: COLORS.primary }
      : { badge: "Maintain", text: "Keep your current weight", color: COLORS.info };

  // Highlight range on picker between current and target
  const highlightStart = Math.min(currentW, selected);
  const highlightEnd = Math.max(currentW, selected);

  const renderItem = ({ item }: { item: number }) => {
    const isSel = item === selected;
    const dist = Math.abs(item - selected);
    const opacity = dist === 0 ? 1 : dist === 1 ? 0.45 : dist === 2 ? 0.25 : 0.12;
    const inRange = item >= highlightStart && item <= highlightEnd;

    return (
      <View
        style={[
          s.item,
          inRange && !isSel && s.itemInRange,
        ]}
      >
        <Text style={[s.itemText, isSel && s.itemTextSel, { opacity: isSel ? 1 : opacity }]}>
          {displayW(item)}
        </Text>
      </View>
    );
  };

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_H,
    offset: ITEM_H * index,
    index,
  });

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>What's your{"\n"}target weight?</Text>
      </View>

      {/* Unit Toggle */}
      <View style={s.toggleWrap}>
        <TouchableOpacity
          style={[s.toggleBtn, unit === "kg" && s.toggleBtnActive]}
          onPress={() => setUnit("kg")}
        >
          <Text style={[s.toggleText, unit === "kg" && s.toggleTextActive]}>Kg</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.toggleBtn, unit === "lbs" && s.toggleBtnActive]}
          onPress={() => setUnit("lbs")}
        >
          <Text style={[s.toggleText, unit === "lbs" && s.toggleTextActive]}>Lbs</Text>
        </TouchableOpacity>
      </View>
      {/* Picker */}
      <View style={s.pickerWrap}>
        <View style={s.selectionBand} />
        <FlatList
          ref={listRef}
          data={WEIGHTS}
          renderItem={renderItem}
          keyExtractor={(item) => String(item)}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_H}
          decelerationRate="fast"
          onScroll={onScroll}
          onMomentumScrollEnd={onMomentumEnd}
          scrollEventThrottle={16}
          getItemLayout={getItemLayout}
          contentContainerStyle={{ paddingVertical: PAD }}
        />
      </View>
    </View>
  );
};

// ── Styles ─────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    alignItems: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textDark,
    textAlign: "center",
    lineHeight: 36,
    letterSpacing: -0.4,
  },

  // Toggle
  toggleWrap: {
    flexDirection: "row",
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 26,
    padding: 4,
    alignSelf: "center",
    marginBottom: SPACING.md,
  },
  toggleBtn: {
    paddingVertical: 9,
    paddingHorizontal: 30,
    borderRadius: 22,
  },
  toggleBtnActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.small,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textLight,
  },
  toggleTextActive: {
    color: COLORS.white,
    fontWeight: "700",
  },

  // Value
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginBottom: SPACING.xs,
  },
  valueBig: {
    fontSize: 56,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -2,
  },
  valueUnit: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  prevContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: SPACING.md,
  },
  prevArrow: {
    fontSize: 12,
    color: COLORS.primary,
    marginRight: 4,
  },
  prevValue: {
    fontSize: 18,
    fontWeight: "500",
    color: COLORS.textLight,
  },

  // Picker
  pickerWrap: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  selectionBand: {
    position: "absolute",
    top: ITEM_H * 3,
    left: SPACING.md,
    right: SPACING.md,
    height: ITEM_H,
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    zIndex: -1,
  },
  item: {
    height: ITEM_H,
    justifyContent: "center",
    alignItems: "center",
  },
  itemInRange: {
    backgroundColor: `${COLORS.primaryMuted}40`,
  },
  itemText: {
    fontSize: 24,
    fontWeight: "500",
    color: COLORS.textLight,
  },
  itemTextSel: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },

  // Motivational card
  motivCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 16,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  motivBadge: {
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: SPACING.sm,
  },
  motivBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  motivTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  motivDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
});
