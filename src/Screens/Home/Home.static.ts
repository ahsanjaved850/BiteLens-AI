export interface DailyNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  sodium: number;
  fiber: number;
}

export interface MacroCardConfig {
  label: string;
  value: number;
  goal: number;
  iconName: string;
  iconColor: string;
  iconBgColor: string;
}

export const INITIAL_NUTRITION_STATE: DailyNutrition = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  sugar: 0,
  sodium: 0,
  fiber: 0,
};

export const MACRO_CARDS_CONFIG = {
  PROTEIN: {
    label: "Protein",
    iconName: "fitness",
    iconColor: "#EF4444",
    iconBgColor: "#FEE2E2",
  },
  CARBS: {
    label: "Carbs",
    iconName: "flame",
    iconColor: "#3B82F6",
    iconBgColor: "#DBEAFE",
  },
  FATS: {
    label: "Fats",
    iconName: "water",
    iconColor: "#F59E0B",
    iconBgColor: "#FEF3C7",
  },
  SUGAR: {
    label: "Sugar",
    iconName: "sparkles",
    iconColor: "#E11D48",
    iconBgColor: "#FDE2E4",
  },
  SODIUM: {
    label: "Sodium",
    iconName: "diamond",
    iconColor: "#8B5CF6",
    iconBgColor: "#E9D5FF",
  },
  FIBER: {
    label: "Fiber",
    iconName: "leaf",
    iconColor: "#059669",
    iconBgColor: "#D1FAE5",
  },
} as const;

export const PROGRESS_COLORS = {
  LOW: "#10B981",
  MEDIUM: "#F59E0B",
  HIGH: "#3B82F6",
  EXCEEDED: "#EF4444",
} as const;

export const PROGRESS_THRESHOLDS = {
  LOW: 50,
  MEDIUM: 80,
  HIGH: 100,
} as const;
