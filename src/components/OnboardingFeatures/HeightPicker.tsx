import { updateBodyStats } from "@/backend/sendData";
import {
  COLORS,
  SHADOWS,
  SPACING,
} from "@/src/Screens/Onboarding/Onboarding.style";
import { getSelectedBirthYear } from "@/src/components/OnboardingFeatures/BirthYearPicker";
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

const { width: SW, height: SH } = Dimensions.get("window");

interface HeightPickerProps {
  onValidationChange?: (isValid: boolean) => void;
}

// ── Config ─────────────────────────────────────────────────────────
const ITEM_H = 68;
const VISIBLE = 7;
const PICKER_H = ITEM_H * VISIBLE;
const PAD = ITEM_H * 3;
const HEIGHTS = Array.from({ length: 121 }, (_, i) => 100 + i); // 100–220 cm
const DEFAULT_H = 170;
const SAVE_DEBOUNCE = 1000;

export const HeightPicker: React.FC<HeightPickerProps> = ({
  onValidationChange,
}) => {
  const [selected, setSelected] = useState(DEFAULT_H);
  const [unit, setUnit] = useState<"cm" | "ft">("cm");
  const listRef = useRef<FlatList>(null);
  const savedRef = useRef(false);

  useEffect(() => {
    onValidationChange?.(true);
  }, []);

  // Scroll to default
  useEffect(() => {
    const t = setTimeout(() => {
      const idx = HEIGHTS.indexOf(selected);
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
        const birthYear = getSelectedBirthYear();
        const age = new Date().getFullYear() - birthYear;
        updateBodyStats(String(age), String(selected));
        if (!savedRef.current) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          savedRef.current = true;
        }
      } catch (e) {
        console.error("Error saving body stats:", e);
      }
    }, SAVE_DEBOUNCE);
    return () => clearTimeout(timer);
  }, [selected]);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
      const clamped = Math.max(0, Math.min(idx, HEIGHTS.length - 1));
      if (HEIGHTS[clamped] !== selected) {
        setSelected(HEIGHTS[clamped]);
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

  const cmToFt = (cm: number): string => {
    const inches = cm / 2.54;
    const ft = Math.floor(inches / 12);
    const rem = Math.round(inches % 12);
    return `${ft}'${rem}"`;
  };

  const displayVal = unit === "cm" ? `${selected}` : cmToFt(selected);

  // Generate ruler marks for left side decoration
  const rulerMarks = [];
  for (let h = 150; h <= 220; h += 10) {
    rulerMarks.push(h);
  }

  const renderItem = ({ item }: { item: number }) => {
    const isSel = item === selected;
    const dist = Math.abs(item - selected);
    const opacity = dist === 0 ? 1 : dist === 1 ? 0.45 : dist === 2 ? 0.25 : 0.12;

    return (
      <View style={s.item}>
        <Text style={[s.itemText, isSel && s.itemTextSel, { opacity }]}>
          {unit === "cm" ? item : cmToFt(item)}
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
        <Text style={s.title}>Your height</Text>
      </View>

      {/* Unit Toggle */}
      <View style={s.toggleWrap}>
        <TouchableOpacity
          style={[s.toggleBtn, unit === "cm" && s.toggleBtnActive]}
          onPress={() => setUnit("cm")}
        >
          <Text style={[s.toggleText, unit === "cm" && s.toggleTextActive]}>
            Cm
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.toggleBtn, unit === "ft" && s.toggleBtnActive]}
          onPress={() => setUnit("ft")}
        >
          <Text style={[s.toggleText, unit === "ft" && s.toggleTextActive]}>
            Ft
          </Text>
        </TouchableOpacity>
      </View>

      <View style={s.mainArea}>
        <View style={s.centerCol}>
          {/* Scroll Picker */}
          <View style={s.pickerWrap}>
            <View style={s.selectionBand} />
            <FlatList
              ref={listRef}
              data={HEIGHTS}
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
      </View>
    </View>
  );
};

// ── Styles ─────────────────────────────────────────────────────────
const SILHOUETTE_COLOR = COLORS.primaryMuted;

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
  },
  header: {
    alignItems: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textDark,
    textAlign: "center",
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

  // Main layout
  mainArea: {
    flex: 1,
    flexDirection: "row",
  },

  // Left ruler
  rulerCol: {
    width: 50,
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingVertical: SPACING.xl,
  },
  rulerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  rulerLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textLight,
    marginRight: 4,
  },
  rulerLine: {
    width: 14,
    height: 1.5,
    backgroundColor: COLORS.border,
  },
  rulerTick: {
    width: 7,
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginLeft: 2,
  },

  // Center column
  centerCol: {
    flex: 1,
    alignItems: "center",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },
  valueBig: {
    fontSize: 64,
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
  selectionLine: {
    width: "80%",
    height: 2,
    backgroundColor: COLORS.textDark,
    marginBottom: SPACING.sm,
  },

  // Picker
  pickerWrap: {
    flex: 1,
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  selectionBand: {
    position: "absolute",
    top: PAD,
    left: SPACING.sm,
    right: SPACING.sm,
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

  // Silhouette (right side)
  silhouetteCol: {
    width: 55,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: SPACING.xxl,
    opacity: 0.35,
  },
  silhouetteHead: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: SILHOUETTE_COLOR,
    marginBottom: 4,
  },
  silhouetteNeck: {
    width: 10,
    height: 10,
    backgroundColor: SILHOUETTE_COLOR,
    marginBottom: 2,
  },
  silhouetteTorso: {
    width: 36,
    height: 70,
    borderRadius: 8,
    backgroundColor: SILHOUETTE_COLOR,
    marginBottom: 4,
  },
  silhouetteHips: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: SILHOUETTE_COLOR,
    marginBottom: 4,
  },
  silhouetteLegL: {
    width: 14,
    height: 75,
    borderRadius: 7,
    backgroundColor: SILHOUETTE_COLOR,
    position: "absolute",
    bottom: SPACING.xxl,
    left: 10,
  },
  silhouetteLegR: {
    width: 14,
    height: 75,
    borderRadius: 7,
    backgroundColor: SILHOUETTE_COLOR,
    position: "absolute",
    bottom: SPACING.xxl,
    right: 10,
  },
});
