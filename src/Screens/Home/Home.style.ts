import { Dimensions, StyleSheet } from "react-native";

const { width: SW } = Dimensions.get("window");

// ─── Warm Theme Colors ─────────────────────────────────────────────
const C = {
  bg: "#FFFDF7",
  bgWarm: "#FFF9ED",
  bgCard: "#FFFFFF",
  bgGray: "#F5F3EE",

  textDark: "#0F1923",
  text: "#1B2838",
  textSec: "#5A6B7E",
  textLight: "#9CA8B7",
  textOnDark: "#FFFFFF",

  primary: "#F5A623",
  primaryLight: "#FFF8EC",
  primaryMuted: "#FFE8C2",

  secondary: "#1B2838",
  accent: "#FF6B35",

  border: "#EDE8DF",
  borderLight: "#F5F0E8",
  divider: "#F0EBE3",

  success: "#2ECC71",
  error: "#EF4444",
};

export const homeStyles = StyleSheet.create({
  // ─── Shell ─────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  body: {
    flex: 1,
    backgroundColor: C.bg,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },

  // ─── Header ────────────────────────────────────────────────────
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: C.bg,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {},
  logoName: {
    fontWeight: "800",
    fontSize: 22,
    color: C.textDark,
    letterSpacing: -0.5,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.bgGray,
    alignItems: "center",
    justifyContent: "center",
  },

  // Kept for compatibility
  greetingContainer: { marginTop: 4 },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: C.textDark,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  dateText: {
    fontSize: 14,
    color: C.textSec,
    fontWeight: "500",
  },

  // ─── Daily Summary Card ────────────────────────────────────────
  dailySummaryCard: {
    backgroundColor: C.bgCard,
    borderRadius: 24,
    marginTop: 12,
    padding: 20,
    shadowColor: "#1B2838",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: C.primary,
  },
  summaryTitleEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakText: {
    fontSize: 13,
    fontWeight: "600",
    color: C.primary,
    marginLeft: 4,
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.bgGray,
    alignItems: "center",
    justifyContent: "center",
  },
  moreButtonText: {
    fontSize: 16,
    color: C.textSec,
    fontWeight: "800",
    letterSpacing: 2,
  },

  // ─── Calorie Ring (centered) ───────────────────────────────────
  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 8,
  },
  calorieRingOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 10,
    borderColor: C.borderLight,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: C.bgCard,
  },
  calorieRingInner: {
    alignItems: "center",
  },
  calorieCount: {
    fontSize: 40,
    fontWeight: "800",
    color: C.textDark,
    letterSpacing: -1.5,
  },
  calorieCanEatLabel: {
    fontSize: 13,
    color: C.textLight,
    fontWeight: "500",
    marginTop: 2,
  },
  calorieTarget: {
    fontSize: 12,
    color: C.textLight,
    fontWeight: "500",
    marginTop: 2,
  },
  progressLabel: {
    fontSize: 12,
    color: C.textLight,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 4,
  },

  // Consumed / Goal row under ring
  calorieSubRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 24,
  },
  calorieSubItem: {
    alignItems: "center",
  },
  calorieSubValue: {
    fontSize: 20,
    fontWeight: "800",
    color: C.textDark,
    letterSpacing: -0.5,
  },
  calorieSubLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: C.textLight,
    marginTop: 2,
  },
  calorieSubDivider: {
    width: 1,
    height: 28,
    backgroundColor: C.border,
  },

  // ─── Macro Summary Row ─────────────────────────────────────────
  macroSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: C.borderLight,
  },
  macroSummaryItem: {
    alignItems: "flex-start",
    flex: 1,
  },
  macroSummaryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: C.textDark,
    marginBottom: 6,
  },
  macroSummaryDotRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  macroSummaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  macroSummaryBar: {
    height: 5,
    backgroundColor: C.borderLight,
    borderRadius: 3,
    width: "90%",
    overflow: "hidden",
  },
  macroSummaryBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  macroSummaryValue: {
    fontSize: 12,
    color: C.textLight,
    fontWeight: "500",
  },

  // ─── Macronutrients Grid (Sugar, Sodium, Fiber) ────────────────
  macroSection: {
    marginTop: 0,
  },
  macroHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: C.textDark,
    marginBottom: 14,
  },
  macroNutrients: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  nutrientsCard: {
    flex: 1,
    minWidth: "30%",
    backgroundColor: C.bgWarm,
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  nutrientIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  proteinIcon: { backgroundColor: "#FEE2E2" },
  carbsIcon: { backgroundColor: "#DBEAFE" },
  fatsIcon: { backgroundColor: "#FEF3C7" },
  sugarIcon: { backgroundColor: "#FDE2E4" },
  sodiumIcon: { backgroundColor: "#E9D5FF" },
  fiberIcon: { backgroundColor: "#D1FAE5" },
  nutrientsLabel: {
    fontSize: 11,
    color: C.textSec,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  nutrientsValue: {
    fontSize: 22,
    fontWeight: "800",
    color: C.textDark,
    marginBottom: 2,
  },
  nutrientsTotal: {
    fontSize: 11,
    color: C.textLight,
    fontWeight: "500",
  },
  nutrientsProgress: {
    marginTop: 8,
    width: "100%",
    height: 5,
    backgroundColor: C.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  nutrientsProgressBar: {
    height: "100%",
    borderRadius: 3,
  },

  // ─── Floating AI Scan Button ───────────────────────────────────
  floatingButtonWrap: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
    pointerEvents: "box-none",
  },
  floatingAiButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.secondary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    gap: 10,
    shadowColor: C.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  floatingAiIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingAiText: {
    fontSize: 17,
    fontWeight: "700",
    color: C.textOnDark,
    letterSpacing: 0.2,
  },

  // ─── Legacy Add Meal (kept for compatibility) ──────────────────
  addMealContainer: {
    alignItems: "center",
    marginVertical: 12,
  },
  addMealButton: {
    backgroundColor: C.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  addMealButtonPressed: {
    backgroundColor: C.accent,
    transform: [{ scale: 0.95 }],
  },
  addMealIcon: {
    color: C.textOnDark,
    fontSize: 28,
    fontWeight: "300",
  },
  addMealText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: C.textSec,
  },

  // ─── Meal History ──────────────────────────────────────────────
  mealHistorySection: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: C.textDark,
    letterSpacing: -0.5,
  },
  viewAllButton: {
    fontSize: 14,
    fontWeight: "600",
    color: C.primary,
  },

  // Meal Card
  mealItem: {
    backgroundColor: C.bgCard,
    borderRadius: 20,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#1B2838",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  mealItemContent: {
    flexDirection: "row",
    padding: 14,
  },
  mealImageContainer: {
    width: 76,
    height: 76,
    borderRadius: 16,
    marginRight: 14,
    overflow: "hidden",
    backgroundColor: C.bgGray,
  },
  mealImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  mealPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: C.bgGray,
    alignItems: "center",
    justifyContent: "center",
  },
  mealInfo: {
    flex: 1,
    justifyContent: "center",
  },
  mealTime: {
    fontSize: 11,
    color: C.textLight,
    fontWeight: "500",
    marginBottom: 3,
  },
  mealName: {
    fontSize: 16,
    color: C.textDark,
    fontWeight: "700",
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: "700",
    color: C.accent,
    marginBottom: 6,
  },
  macrosInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  macroInlineItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  macroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  macroInlineText: {
    fontSize: 12,
    color: C.textSec,
    fontWeight: "500",
  },

  // ─── Empty State ───────────────────────────────────────────────
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 44,
    paddingHorizontal: 32,
    backgroundColor: C.primaryLight,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.primaryMuted,
    borderStyle: "dashed",
  },
  emptyStateIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  emptyStateTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: C.textDark,
    marginBottom: 6,
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: C.textSec,
    textAlign: "center",
    lineHeight: 20,
  },

  // ─── Modal ─────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 25, 35, 0.5)",
  },
  modalContent: {
    backgroundColor: C.bgCard,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 4,
    paddingBottom: 34,
    paddingHorizontal: 20,
    maxHeight: "90%",
  },
  modalHandle: {
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 12,
  },
  modalHandleBar: {
    width: 40,
    height: 5,
    backgroundColor: C.border,
    borderRadius: 3,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
    textAlign: "center",
    color: C.textDark,
    letterSpacing: -0.5,
  },
  modalButtonContainer: {
    marginTop: 16,
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 50,
    backgroundColor: C.bgGray,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: C.textSec,
  },

  // ─── Loading ───────────────────────────────────────────────────
  loadingOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(15, 25, 35, 0.8)",
  },
  loadingContainer: {
    backgroundColor: C.bgCard,
    padding: 32,
    borderRadius: 24,
    alignItems: "center",
    minWidth: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 17,
    color: C.textDark,
    fontWeight: "700",
  },
  loadingSubtext: {
    marginTop: 6,
    fontSize: 13,
    color: C.textLight,
    textAlign: "center",
  },
  refreshText: {
    fontSize: 13,
    color: C.textLight,
    marginTop: 8,
  },
});