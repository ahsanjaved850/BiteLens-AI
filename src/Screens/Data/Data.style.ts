import { StyleSheet } from "react-native";

export const GRADIENT = {
  top: "#FFE0C2",
  mid: "#FFF0E4",
  bottom: "#FFFFFF",
};

const C = {
  bg: "#FFFFFF",
  bgCard: "#FFFAF6",
  bgCardAlt: "#FFF5EC",
  bgGray: "#F5EDE0",
  bgPeach: "#FFE0C2",

  textDark: "#0F1A22",
  text: "#1C2B36",
  textSec: "#7A8A98",
  textLight: "#B0BECA",
  textOnDark: "#FFFFFF",

  primary: "#F47B20",
  primaryDark: "#D96A12",
  primaryLight: "#FFF3E8",
  primaryMuted: "#FFE0C2",

  secondary: "#1C2B36",

  border: "#F0DED0",
  borderLight: "#FAF0E8",
  divider: "#F5E8DC",

  success: "#2ECC71",
  error: "#EF4444",
  blue: "#3B82F6",
  yellow: "#F59E0B",
};

export const dataStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bgPeach,
  },
  body: {
    flex: 1,
    backgroundColor: C.bg,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 110,
    paddingTop: 8,
  },

  // ─── Header
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    backgroundColor: C.bgPeach,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: C.textDark,
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: C.textSec,
    marginTop: 4,
    fontWeight: "500",
  },

  //  Section Card
  section: {
    backgroundColor: C.bgCard,
    borderRadius: 28,
    padding: 22,
    marginTop: 12,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    borderWidth: 1,
    borderColor: C.border,
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
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: C.textSec,
    marginTop: 2,
  },

  // ─── Data Cards
  dataCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 18,
    padding: 12,
    elevation: 2,
  },
  dataCardLeft: {
    flex: 1,
  },
  dataCardLabel: {
    fontSize: 11,
    color: C.primary,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  dataCardValue: {
    fontSize: 28,
    fontWeight: "800",
    color: C.textDark,
    letterSpacing: -0.5,
  },
  dataCardUnit: {
    fontSize: 14,
    color: C.textLight,
    fontWeight: "500",
  },
  updateButton: {
    backgroundColor: C.primary,
    paddingHorizontal: 22,
    width: "30%",
    paddingVertical: 11,
    borderRadius: 50,
    minWidth: 80,
    alignItems: "center",
    shadowColor: "#e27c29",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  updateButtonText: {
    color: C.textOnDark,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  // ─── BMI Card
  bmiCard: {
    borderRadius: 18,
    padding: 18,
    elevation: 2,
  },
  bmiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  bmiScore: {
    fontSize: 35,
    fontWeight: "700",
    color: C.textDark,
    letterSpacing: -1,
  },
  bmiCategory: {
    fontSize: 15,
    fontWeight: "700",
    paddingHorizontal: 22,
    width: "40%",
    paddingVertical: 11,
    borderRadius: 50,
    overflow: "hidden",
  },
  // bmiDescription: {
  //   fontSize: 13,
  //   color: C.textSec,
  //   lineHeight: 20,
  //   marginTop: 8,
  // },
  bmiScale: {
    flexDirection: "row",
    height: 8,
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 6,
    gap: 3,
  },
  bmiScaleSegment: {
    flex: 1,
    borderRadius: 6,
  },

  // ─── Weight Progress Card
  weightProgressCard: {
    backgroundColor: C.bgCard,
    borderRadius: 28,
    marginTop: 12,
    padding: 22,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    borderWidth: 1,
    borderColor: C.border,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.textDark,
    letterSpacing: -0.3,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8FBF2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#B8F0D8",
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
    letterSpacing: -0.5,
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
    height: 10,
    backgroundColor: C.borderLight,
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: C.primary,
    borderRadius: 6,
  },
  progressPercentage: {
    fontSize: 12,
    color: C.primary,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
  },

  // ─── Note Card ───────────────────────────────────────────────────────────
  noteCard: {
    borderRadius: 16,
    padding: 8,
    marginTop: 16,
  },
  noteText: {
    fontSize: 9,
    color: "black",
    lineHeight: 20,
    fontWeight: "500",
  },

  // ─── Nutrition Overview Card
  nutritionOverviewCard: {
    backgroundColor: C.bgCard,
    borderRadius: 28,
    padding: 22,
    marginTop: 12,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    borderWidth: 1,
    borderColor: C.border,
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  nutritionItem: {
    flex: 1,
    minWidth: "48%",
    backgroundColor: C.bgCardAlt,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  nutritionIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  nutritionLabel: {
    fontSize: 11,
    color: C.textSec,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  nutritionValue: {
    fontSize: 24,
    fontWeight: "800",
    color: C.textDark,
    letterSpacing: -0.5,
  },
  nutritionUnit: {
    fontSize: 12,
    color: C.textLight,
    fontWeight: "500",
  },

  // ─── Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(15, 26, 34, 0.55)",
  },
  modalContent: {
    backgroundColor: C.bgCard,
    borderRadius: 28,
    padding: 26,
    width: "85%",
    maxWidth: 360,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
    color: C.textDark,
    letterSpacing: -0.5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: C.textSec,
    marginBottom: 22,
    lineHeight: 21,
  },
  inputContainer: {
    marginBottom: 22,
  },
  inputLabel: {
    fontSize: 11,
    color: C.primary,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 16,
    padding: 16,
    fontSize: 18,
    color: C.textDark,
    fontWeight: "700",
    backgroundColor: C.bgCardAlt,
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
    fontWeight: "700",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: C.primary,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: "center",
    shadowColor: "#D96A12",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 7,
  },
  confirmButtonText: {
    color: C.textOnDark,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // ─── Loading
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

  // ─── Citation / Disclaimer (moved from inline in Data.tsx)
  citationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
    gap: 8,
  },
  citationText: {
    fontSize: 12,
    color: C.textSec,
    fontWeight: "500",
    textDecorationLine: "underline",
    flex: 1,
  },

  // Disclaimer card — collapsible dropdown
  disclaimerCard: {
    backgroundColor: C.bgCardAlt,
    borderRadius: 24,
    marginTop: 12,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
    overflow: "hidden",
  },
  // Tappable header row that toggles the dropdown
  disclaimerTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
  },
  disclaimerTriggerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: C.textDark,
  },
  // Expanded content area — only visible when open
  disclaimerBody: {
    paddingHorizontal: 18,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  disclaimerText: {
    fontSize: 12,
    color: C.textSec,
    lineHeight: 19,
    marginTop: 14,
    marginBottom: 12,
  },
  sourcesContainer: {
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 8,
    gap: 2,
  },
  // ─── Weight Tracker Graph Card
  weightTrendCard: {
    backgroundColor: C.bgCard,
    borderRadius: 28,
    padding: 22,
    marginTop: 12,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    borderWidth: 1,
    borderColor: C.border,
  },
  weightTrackerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 12,
  },
  weightTrackerLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: C.textSec,
    marginBottom: 4,
  },
  weightTrackerValue: {
    fontSize: 38, // was 42 — slightly smaller looks cleaner
    fontWeight: "900",
    color: C.textDark,
    letterSpacing: -1.2,
  },

  weightTrackerUnit: {
    fontSize: 24,
    fontWeight: "800",
    color: C.textDark,
  },
  weightTrackerDateBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: C.bgCardAlt, // add this
    paddingHorizontal: 10, // add this
    paddingVertical: 6, // add this
    borderRadius: 20, // add this
    borderWidth: 1, // add this
    borderColor: C.border, // add this
    flexShrink: 1,
  },
  weightTrackerDateText: {
    fontSize: 12,
    fontWeight: "700",
    color: "black",
    textAlign: "right",
  },
  weightTrackerDivider: {
    height: 1.3,
    backgroundColor: C.divider,
    marginTop: 18,
    marginBottom: 16,
  },
  weightTrackerChartContainer: {
    backgroundColor: C.bgCard,
    borderRadius: 20,
    overflow: "hidden",
  },
});
