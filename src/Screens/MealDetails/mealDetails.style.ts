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
};

export const mealDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: C.bg,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: C.bgGray,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: C.textDark,
    letterSpacing: -0.3,
  },
  deleteButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },

  // Image
  imageContainer: {
    width: "100%",
    height: 260,
    backgroundColor: C.bgGray,
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
    backgroundColor: C.bgGray,
  },

  // Info Card
  infoCard: {
    backgroundColor: C.bgCard,
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 24,
    marginTop: -28,
    marginBottom: 12,
    shadowColor: "#1B2838",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  mealName: {
    fontSize: 24,
    fontWeight: "800",
    color: C.textDark,
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    fontSize: 13,
    color: C.textLight,
    fontWeight: "500",
  },

  // Calories Card
  caloriesCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.primaryLight,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.primaryMuted,
  },
  caloriesIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: C.bgCard,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  caloriesInfo: {
    flex: 1,
  },
  caloriesLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: C.textSec,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  caloriesValue: {
    fontSize: 30,
    fontWeight: "800",
    color: C.textDark,
    letterSpacing: -0.8,
  },

  // Section
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.textDark,
    marginBottom: 12,
    letterSpacing: -0.2,
  },

  // Macro Grid
  macroGrid: {
    flexDirection: "row",
    gap: 10,
  },
  macroCard: {
    flex: 1,
    backgroundColor: C.bgCard,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    shadowColor: "#1B2838",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  macroIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  macroLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: C.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 22,
    fontWeight: "800",
    color: C.textDark,
  },

  // Nutrients List
  nutrientsList: {
    backgroundColor: C.bgCard,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#1B2838",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  nutrientRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
  },
  nutrientLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  nutrientIconSmall: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  nutrientLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: C.textDark,
  },
  nutrientValue: {
    fontSize: 16,
    fontWeight: "700",
    color: C.textSec,
  },

  // Ingredients (kept for compatibility but not used)
  ingredientsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  ingredientsContainer: {
    backgroundColor: C.bgCard,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#1B2838",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    paddingLeft: 4,
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.primary,
    marginRight: 10,
    marginTop: 7,
  },
  ingredientText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: C.text,
    lineHeight: 21,
  },
  noIngredientsText: {
    fontSize: 14,
    color: C.textLight,
    fontStyle: "italic",
    textAlign: "center",
  },

  // AI Notice
  aiNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.primaryLight,
    marginHorizontal: 16,
    marginTop: 20,
    padding: 14,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: C.primaryMuted,
  },
  aiNoticeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
    color: C.primary,
    lineHeight: 17,
  },

  // Error
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600",
    color: C.textLight,
  },
});