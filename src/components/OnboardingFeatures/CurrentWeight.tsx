import {
  COLORS,
  SHADOWS,
  SPACING,
} from "@/src/Screens/Onboarding/Onboarding.style";
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

interface CurrentWeightProps {
  onValidationChange?: (isValid: boolean) => void;
}

// ── Config ─────────────────────────────────────────────────────────
const ITEM_H = 68;
const VISIBLE = 7;
const PICKER_H = ITEM_H * VISIBLE;
const PAD = ITEM_H * 3;
const WEIGHTS = Array.from({ length: 171 }, (_, i) => 30 + i); // 30–200 kg
const DEFAULT_W = 78;

export const CurrentWeight: React.FC<CurrentWeightProps> = ({
  onValidationChange,
}) => {
  const [selected, setSelected] = useState(DEFAULT_W);
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    onValidationChange?.(true);
  }, []);

  // Update shared store
  useEffect(() => {
    setGlobalCurrentWeight(selected);
  }, [selected]);

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
  const displayW = unit === "kg" ? `${selected}` : `${kgToLbs(selected)}`;

  // BMI (assumes 170cm default — in production use actual height from HeightPicker)
  const bmi = parseFloat((selected / ((170 / 100) ** 2)).toFixed(1));
  const bmiCat =
    bmi < 18.5
      ? { label: "Underweight", color: "#2196F3" }
      : bmi < 25
      ? { label: "Normal", color: "#2ECC71" }
      : bmi < 30
      ? { label: "Overweight", color: "#F5A623" }
      : { label: "Obese", color: "#FF4757" };

  const renderItem = ({ item }: { item: number }) => {
    const isSel = item === selected;
    const dist = Math.abs(item - selected);
    const opacity = dist === 0 ? 1 : dist === 1 ? 0.45 : dist === 2 ? 0.25 : 0.12;

    return (
      <View style={s.item}>
        <Text style={[s.itemText, isSel && s.itemTextSel, { opacity }]}>
          {unit === "kg" ? item : kgToLbs(item)}
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
        <Text style={s.title}>What's your{"\n"}current weight?</Text>
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

// ── Shared current weight for TargetWeight screen ──────────────────
let _currentWeight = DEFAULT_W;
export const getGlobalCurrentWeight = () => _currentWeight;
export const setGlobalCurrentWeight = (w: number) => {
  _currentWeight = w;
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
    fontSize: 60,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -2,
  },
  valueUnit: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginLeft: 6,
  },

  // Picker
  pickerWrap: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  selectionBand: {
    position: "absolute",
    top: PAD,
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

  // BMI
  bmiCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 16,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    ...SHADOWS.small,
  },
  bmiTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  bmiLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  bmiValue: {
    fontSize: 16,
    fontWeight: "800",
  },
  bmiBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: SPACING.sm,
  },
  bmiBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  bmiDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    lineHeight: 19,
  },
  sourceLink: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
});
