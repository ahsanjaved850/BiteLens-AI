import { StyleSheet } from "react-native";

export const dataStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  body: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  // Header
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    fontWeight: "500",
  },

  // Weight Progress Card
  weightProgressCard: {
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
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#16A34A",
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
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  weightValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  weightUnit: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  progressBarContainer: {
    flex: 2,
    paddingHorizontal: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 13,
    color: "#3B82F6",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },

  // Section Styles
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },

  // Card Styles
  dataCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  dataCardLeft: {
    flex: 1,
  },
  dataCardLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
    marginBottom: 4,
  },
  dataCardValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  dataCardUnit: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  updateButton: {
    backgroundColor: "#000000",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },

  // BMI Card
  bmiCard: {
    borderRadius: 12,
    padding: 16,
  },
  bmiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  bmiScore: {
    fontSize: 36,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  bmiCategory: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  bmiDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
    marginTop: 8,
  },
  bmiScale: {
    flexDirection: "row",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 12,
  },
  bmiScaleSegment: {
    flex: 1,
  },

  // Nutrition Overview Card
  nutritionOverviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  nutritionItem: {
    flex: 1,
    minWidth: "48%",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  nutritionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  nutritionLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  nutritionUnit: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },

  // Note Card - Updated to match white card background for classic look
  noteCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 0,
  },
  noteText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 20,
    fontWeight: "500",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: "85%",
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: "#1A1A1A",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#1A1A1A",
    fontWeight: "600",
  },
  textInputFocused: {
    borderColor: "#3B82F6",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 15,
    fontWeight: "600",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#000000",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  // Loading State
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
});
