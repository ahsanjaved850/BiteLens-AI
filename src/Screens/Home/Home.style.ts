import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  body: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  // Header Styles
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
   
  },
  logoName: {
    fontWeight: "700",
    fontSize: 28,
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  greetingContainer: {
    marginTop: 4,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  dateText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },

  // Daily Summary Card
  dailySummaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginTop: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF4E6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#F59E0B",
    marginLeft: 4,
  },

  // Progress Circle Container
  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 14,
  },
  progressLabel: {
    marginTop: 16,
    fontSize: 15,
    color: "#666",
    fontWeight: "700",
  },
  calorieCount: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  calorieTarget: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },

  // Macro Nutrients Section
  macroSection: {
    marginTop: 0,
  },
  macroHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  macroNutrients: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap", // ADDED: Allow wrapping to next row
  },
  nutrientsCard: {
    flex: 1,
    minWidth: "30%", // ADDED: Ensure 3 cards per row
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  nutrientIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  proteinIcon: {
    backgroundColor: "#FEE2E2",
  },
  carbsIcon: {
    backgroundColor: "#DBEAFE",
  },
  fatsIcon: {
    backgroundColor: "#FEF3C7",
  },
  // ============ ADDED: 3 new nutrient icon styles ============
  sugarIcon: {
    backgroundColor: "#FDE2E4",
  },
  sodiumIcon: {
    backgroundColor: "#E9D5FF",
  },
  fiberIcon: {
    backgroundColor: "#D1FAE5",
  },
  // ==========================================================
  nutrientsLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  nutrientsValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  nutrientsTotal: {
    fontSize: 11,
    color: "#999",
    fontWeight: "500",
  },
  nutrientsProgress: {
    marginTop: 8,
    width: "100%",
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    overflow: "hidden",
  },
  nutrientsProgressBar: {
    height: "100%",
    borderRadius: 2,
  },

  // Add Meal Button
  addMealContainer: {
    alignItems: "center",
    marginVertical: 12,
  },
  addMealButton: {
    backgroundColor: "#000000",
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  addMealButtonPressed: {
    backgroundColor: "#333333",
    transform: [{ scale: 0.95 }],
  },
  addMealIcon: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "300",
  },
  addMealText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },

  // Meal History Section
  mealHistorySection: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  viewAllButton: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
  },

  // Meal Item Card - Compact with Small Image on Left
  mealItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  mealItemContent: {
    flexDirection: "row",
    padding: 14,
  },

  // Small Image on Left
  mealImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 14,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
  },
  mealImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  mealPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  // Content on Right
  mealInfo: {
    flex: 1,
    justifyContent: "center",
  },
  mealTime: {
    fontSize: 11,
    color: "#999",
    fontWeight: "500",
    marginBottom: 4,
  },
  mealName: {
    fontSize: 16,
    color: "#1A1A1A",
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EF4444",
    marginBottom: 8,
  },

  // Macros in Horizontal Line
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
    color: "#666",
    fontWeight: "500",
  },

  // Empty State
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 4,
    paddingBottom: 34,
    paddingHorizontal: 20,
    maxHeight: "90%",
  },
  modalHandle: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalHandleBar: {
    width: 36,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  modalButtonContainer: {
    marginTop: 16,
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },

  // Loading States
  loadingOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  loadingContainer: {
    backgroundColor: "#FFFFFF",
    padding: 32,
    borderRadius: 16,
    alignItems: "center",
    minWidth: 200,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#1A1A1A",
    fontWeight: "600",
  },
  loadingSubtext: {
    marginTop: 6,
    fontSize: 13,
    color: "#999",
    textAlign: "center",
  },

  // Refresh Control
  refreshText: {
    fontSize: 13,
    color: "#999",
    marginTop: 8,
  },
});
