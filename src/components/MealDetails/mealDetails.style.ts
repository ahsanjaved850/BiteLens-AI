import { StyleSheet } from "react-native";

export const mealDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },

  // Image Section
  imageContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#E2E8F0",
  },
  mealImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E2E8F0",
  },

  // Info Card
  infoCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  mealName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "600",
  },

  // Calories Card
  caloriesCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E7FF",
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
  },
  caloriesIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  caloriesInfo: {
    flex: 1,
  },
  caloriesLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4F46E5",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  caloriesValue: {
    fontSize: 36,
    fontWeight: "800",
    color: "#1E293B",
    letterSpacing: -0.5,
  },

  // Section
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 16,
    letterSpacing: -0.3,
  },

  // Macro Grid
  macroGrid: {
    flexDirection: "row",
    gap: 12,
  },
  macroCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  macroIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  macroLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  macroValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1E293B",
  },

  // Nutrients List
  nutrientsList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  nutrientRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  nutrientLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  nutrientIconSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  nutrientLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  nutrientValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#64748B",
  },

  // Ingredients Section
  ingredientsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  ingredientsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingLeft: 4,
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#6366F1",
    marginRight: 12,
    marginTop: 8,
  },
  ingredientText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#1E293B",
    lineHeight: 22,
  },
  noIngredientsText: {
    fontSize: 15,
    color: "#94A3B8",
    fontStyle: "italic",
    textAlign: "center",
  },

  // AI Notice
  aiNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E7FF",
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    gap: 10,
  },
  aiNoticeText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#4F46E5",
    lineHeight: 18,
  },

  // Error State
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748B",
  },
});
