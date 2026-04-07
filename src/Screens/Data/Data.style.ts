import { StyleSheet } from "react-native";

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
  blue: "#3B82F6",
  yellow: "#F59E0B",
};

export const dataStyles = StyleSheet.create({
  // ─── Shell ─────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  body: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },

  // ─── Header ────────────────────────────────────────────────────
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: C.textDark,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: C.textSec,
    marginTop: 4,
    fontWeight: "500",
  },

  // ─── Weight Progress Card ──────────────────────────────────────
  weightProgressCard: {
    backgroundColor: C.bgCard,
    borderRadius: 24,
    marginTop: 16,
    padding: 20,
    shadowColor: "#1B2838",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: C.textDark,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${C.success}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  trendText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.success,
    marginLeft: 4,
  },
  weightVisualization: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  weightBox: {
    alignItems: "center",
    flex: 1,
  },
  weightLabel: {
    fontSize: 11,
    color: C.textLight,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  weightValue: {
    fontSize: 28,
    fontWeight: "800",
    color: C.textDark,
  },
  weightUnit: {
    fontSize: 14,
    color: C.textSec,
    fontWeight: "600",
  },
  progressBarContainer: {
    flex: 2,
    paddingHorizontal: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: C.borderLight,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: C.primary,
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 13,
    color: C.primary,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
  },

  // ─── Section Styles ────────────────────────────────────────────
  section: {
    backgroundColor: C.bgCard,
    borderRadius: 24,
    padding: 20,
    marginTop: 16,
    shadowColor: "#1B2838",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.textDark,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: C.textSec,
    marginTop: 2,
  },

  // ─── Data Cards ────────────────────────────────────────────────
  dataCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    backgroundColor: C.bgWarm,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  dataCardLeft: {
    flex: 1,
  },
  dataCardLabel: {
    fontSize: 12,
    color: C.textSec,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dataCardValue: {
    fontSize: 26,
    fontWeight: "800",
    color: C.textDark,
  },
  dataCardUnit: {
    fontSize: 14,
    color: C.textLight,
    fontWeight: "500",
  },
  updateButton: {
    backgroundColor: C.secondary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    minWidth: 80,
    alignItems: "center",
    shadowColor: C.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  updateButtonText: {
    color: C.textOnDark,
    fontSize: 13,
    fontWeight: "700",
  },

  // ─── BMI Card ──────────────────────────────────────────────────
  bmiCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: C.bgWarm,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  bmiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  bmiScore: {
    fontSize: 38,
    fontWeight: "800",
    color: C.textDark,
    letterSpacing: -0.5,
  },
  bmiCategory: {
    fontSize: 13,
    fontWeight: "700",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    overflow: "hidden",
  },
  bmiDescription: {
    fontSize: 13,
    color: C.textSec,
    lineHeight: 20,
    marginTop: 8,
  },
  bmiScale: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 14,
    gap: 3,
  },
  bmiScaleSegment: {
    flex: 1,
    borderRadius: 4,
  },

  // ─── Nutrition Overview ────────────────────────────────────────
  nutritionOverviewCard: {
    backgroundColor: C.bgCard,
    borderRadius: 24,
    padding: 20,
    marginTop: 16,
    shadowColor: "#1B2838",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  nutritionItem: {
    flex: 1,
    minWidth: "48%",
    backgroundColor: C.bgWarm,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  nutritionIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  nutritionLabel: {
    fontSize: 12,
    color: C.textSec,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  nutritionValue: {
    fontSize: 22,
    fontWeight: "800",
    color: C.textDark,
  },
  nutritionUnit: {
    fontSize: 12,
    color: C.textLight,
    fontWeight: "500",
  },

  // ─── Note Card ─────────────────────────────────────────────────
  noteCard: {
    backgroundColor: C.primaryLight,
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: C.primaryMuted,
  },
  noteText: {
    fontSize: 13,
    color: C.textSec,
    lineHeight: 20,
    fontWeight: "500",
  },

  // ─── Modal ─────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(15, 25, 35, 0.5)",
  },
  modalContent: {
    backgroundColor: C.bgCard,
    borderRadius: 28,
    padding: 24,
    width: "85%",
    maxWidth: 360,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
    color: C.textDark,
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 14,
    color: C.textSec,
    marginBottom: 20,
    lineHeight: 21,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    color: C.textSec,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  textInput: {
    borderWidth: 2,
    borderColor: C.border,
    borderRadius: 16,
    padding: 16,
    fontSize: 18,
    color: C.textDark,
    fontWeight: "700",
    backgroundColor: C.bgWarm,
    textAlign: "center",
  },
  textInputFocused: {
    borderColor: C.primary,
    backgroundColor: C.primaryLight,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 50,
    backgroundColor: C.bgGray,
    alignItems: "center",
  },
  cancelButtonText: {
    color: C.textSec,
    fontSize: 15,
    fontWeight: "600",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: C.secondary,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: "center",
    shadowColor: C.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    color: C.textOnDark,
    fontSize: 15,
    fontWeight: "700",
  },

  // ─── Loading ───────────────────────────────────────────────────
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: C.textSec,
    fontWeight: "600",
  },
});