import { NUTRITION_ICONS } from "@/src/Screens/Home/Home.static";

export interface NutrientConfig {
  label: string;
  value: string;
  icon: string;
  iconColor: string;
  iconBgColor: string;
  iconKey: keyof typeof NUTRITION_ICONS;
}

export const NUTRIENTS_CONFIG: Omit<NutrientConfig, "value">[] = [
  {
    label: "Sugar",
    icon: "ice-cream-outline",
    iconColor: "#E11D48",
    iconBgColor: "#FDE2E4",
    iconKey: "sugar",
  },
  {
    label: "Sodium",
    icon: "diamond",
    iconColor: "#4F46E5",
    iconBgColor: "#E0E7FF",
    iconKey: "sodium",
  },
  {
    label: "Fiber",
    icon: "leaf",
    iconColor: "#059669",
    iconBgColor: "#D1FAE5",
    iconKey: "fiber",
  },
];

export const MACROS_CONFIG = [
  {
    label: "Protein",
    icon: "barbell-outline",
    iconColor: "#EF4444",
    iconBgColor: "#FEE2E2",
    key: "protein",
    iconKey: "protein" as keyof typeof NUTRITION_ICONS,
  },
  {
    label: "Carbs",
    icon: "nutrition-outline",
    iconColor: "#3B82F6",
    iconBgColor: "#DBEAFE",
    key: "carbs",
    iconKey: "carbs" as keyof typeof NUTRITION_ICONS,
  },
  {
    label: "Fats",
    icon: "water",
    iconColor: "#F59E0B",
    iconBgColor: "#FEF3C7",
    key: "fat",
    iconKey: "fat" as keyof typeof NUTRITION_ICONS,
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
  RECALC_ERROR: {
    title: "Recalculation Failed",
    message:
      "Could not recalculate the portion. Please check your connection and try again.",
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
  ERROR_NOT_FOUND: "Meal not found",
  EDIT_PORTION: "Edit Portion",
} as const;

export const INGREDIENT_MODAL_TEXT = {
  ADD_TITLE: "Add Ingredient",
  ADD_SUBTITLE: "Add an item that's part of this meal.",
  EDIT_TITLE: "Edit Ingredient",
  EDIT_SUBTITLE: "Update this ingredient's name or amount.",
  NAME_LABEL: "Ingredient Name",
  NAME_PLACEHOLDER: "e.g. Grilled chicken",
  GRAMS_LABEL: "Amount (grams)",
  GRAMS_PLACEHOLDER: "Enter grams",
} as const;

export const INGREDIENT_ALERTS = {
  DELETE_CONFIRM: {
    title: "Remove Ingredient",
    message: "Remove this ingredient from the meal?",
    cancelText: "Cancel",
    confirmText: "Remove",
  },
  SAVE_ERROR: {
    title: "Error",
    message: "Failed to save ingredient. Please try again.",
    buttonText: "OK",
  },
  DELETE_ERROR: {
    title: "Error",
    message: "Failed to remove ingredient. Please try again.",
    buttonText: "OK",
  },
  NAME_REQUIRED: "Please enter an ingredient name",
} as const;

export const UNIT_SUFFIX = {
  GRAMS: "g",
  MILLIGRAMS: "mg",
} as const;
