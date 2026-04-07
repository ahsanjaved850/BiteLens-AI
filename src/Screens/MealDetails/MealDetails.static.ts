export interface NutrientConfig {
  label: string;
  value: string;
  icon: string;
  iconColor: string;
  iconBgColor: string;
}

export const NUTRIENTS_CONFIG: Omit<NutrientConfig, "value">[] = [
  {
    label: "Sugar",
    icon: "ice-cream-outline",
    iconColor: "#E11D48",
    iconBgColor: "#FDE2E4",
  },
  {
    label: "Sodium",
    icon: "diamond",
    iconColor: "#4F46E5",
    iconBgColor: "#E0E7FF",
  },
  {
    label: "Fiber",
    icon: "leaf",
    iconColor: "#059669",
    iconBgColor: "#D1FAE5",
  },
];

export const MACROS_CONFIG = [
  {
    label: "Protein",
    icon: "barbell-outline",
    iconColor: "#EF4444",
    iconBgColor: "#FEE2E2",
    key: "protein",
  },
  {
    label: "Carbs",
    icon: "nutrition-outline",
    iconColor: "#3B82F6",
    iconBgColor: "#DBEAFE",
    key: "carbs",
  },
  {
    label: "Fats",
    icon: "water",
    iconColor: "#F59E0B",
    iconBgColor: "#FEF3C7",
    key: "fat",
  },
] as const;

export const ALERT_MESSAGES = {
  DELETE_CONFIRM: {
    title: "Delete Meal",
    message:
      "Are you sure you want to delete this meal? This action cannot be undone.",
    cancelText: "Cancel",
    confirmText: "Delete",
  },
  DELETE_SUCCESS: {
    title: "Deleted",
    message: "Meal has been deleted successfully.",
    buttonText: "OK",
  },
  DELETE_ERROR: {
    title: "Error",
    message: "Failed to delete meal. Please try again.",
    buttonText: "OK",
  },
} as const;

export const SECTION_TITLES = {
  MEAL_DETAILS: "Meal Details",
  MACRONUTRIENTS: "Macronutrients",
  ADDITIONAL_NUTRIENTS: "Additional Nutrients",
  INGREDIENTS: "Ingredients",
} as const;

export const UI_TEXT = {
  TOTAL_CALORIES: "Total Calories",
  NO_INGREDIENTS: "No ingredients available",
  AI_NOTICE:
    "Nutritional information and ingredients are AI-generated estimates",
  ERROR_NOT_FOUND: "Meal not found",
} as const;

export const UNIT_SUFFIX = {
  GRAMS: "g",
  MILLIGRAMS: "mg",
} as const;