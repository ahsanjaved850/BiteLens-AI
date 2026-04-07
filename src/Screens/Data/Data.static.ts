export type ModalType = "current" | "goal" | null;

export interface ProfileData {
  weight?: string;
  target_weight?: string;
  height?: string;
  age?: string;
  gender?: string;
  goal?: string;
}

export interface InitialDetailsData {
  bmi?: string;
  bmi_category?: string;
}

export const BMI_CATEGORIES = {
  UNDERWEIGHT: "underweight",
  NORMAL: "normal",
  OVERWEIGHT: "overweight",
  OBESE: "obese",
} as const;

export const BMI_CATEGORY_COLORS = {
  [BMI_CATEGORIES.UNDERWEIGHT]: "#3B82F6",
  [BMI_CATEGORIES.NORMAL]: "#10B981",
  [BMI_CATEGORIES.OVERWEIGHT]: "#F59E0B",
  [BMI_CATEGORIES.OBESE]: "#EF4444",
  DEFAULT: "#6B7280",
} as const;

export const MODAL_TITLES = {
  CURRENT: "Log Current Weight",
  GOAL: "Update Goal Weight",
} as const;

export const MODAL_SUBTITLES = {
  CURRENT: "Enter your current weight to track your progress",
  GOAL: "Set a new target weight for your fitness journey",
} as const;

export const WEIGHT_UNIT = "kg";