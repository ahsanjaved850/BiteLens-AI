export interface ProfileData {
  full_name?: string;
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  target_weight?: number;
}

export const APP_VERSION = "NutriTrack AI v1.0.0";

export const WEIGHT_UNIT = "kg";
export const HEIGHT_UNIT = "cm";

export const SECTION_TITLES = {
  PERSONAL_INFO: "Personal Information",
  PHYSICAL_DETAILS: "Physical Details",
  SUPPORT_LEGAL: "Support & Legal",
  DANGER_ZONE: "Danger Zone",
} as const;

export const SETTINGS_ITEMS = {
  FULL_NAME: {
    icon: "person-outline",
    label: "Full Name",
    placeholder: "Not set",
  },
  AGE: {
    icon: "calendar-outline",
    label: "Age",
    placeholder: "Not set",
    suffix: "years",
  },
  GENDER: {
    icon: "male-female-outline",
    label: "Gender",
    placeholder: "Not set",
  },
  WEIGHT: {
    icon: "scale-outline",
    label: "Weight",
    placeholder: "--",
  },
  HEIGHT: {
    icon: "resize-outline",
    label: "Height",
    placeholder: "--",
  },
  GOAL_WEIGHT: {
    icon: "flag-outline",
    label: "Goal Weight",
    placeholder: "--",
  },
  HELP_CENTER: {
    icon: "help-circle-outline",
    label: "Help Center",
    description: "Get support and FAQs",
  },
  TERMS: {
    icon: "document-text-outline",
    label: "Terms & Conditions",
    description: "Legal agreements",
  },
  DELETE_ACCOUNT: {
    icon: "trash-outline",
    label: "Delete Account",
  },
} as const;

export const DELETE_ACCOUNT_ALERT = {
  title: "Delete Account",
  message:
    "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.",
  cancelText: "Cancel",
  confirmText: "Yes, Delete",
} as const;