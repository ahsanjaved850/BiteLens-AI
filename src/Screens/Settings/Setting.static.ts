export interface ProfileData {
  full_name?: string;
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  target_weight?: number;
}

export const APP_VERSION = "Orca v1.1.5";

export const WEIGHT_UNIT = "kg";
export const HEIGHT_UNIT = "cm";

export const SECTION_TITLES = {
  PERSONAL_INFO: "Personal Information",
  PHYSICAL_DETAILS: "Physical Details",
  SUPPORT_LEGAL: "Health Sources",
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
  HEALTH_DISCLAIMER: {
    icon: "medical-outline",
    label: "Health Disclaimer",
    description: "Sources & medical information",
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

// Health Information Sources (Apple Guideline 1.4.1 compliance)

export const HEALTH_SOURCES = [
  {
    title: "BMI Classification",
    source: "World Health Organization (WHO)",
    url: "https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/body-mass-index",
  },
  {
    title: "Calorie Target Calculation",
    source: "Mifflin-St Jeor Equation — PubMed",
    url: "https://pubmed.ncbi.nlm.nih.gov/15883556/",
  },
  {
    title: "Macronutrient Recommendations",
    source: "Dietary Reference Intakes — National Academies of Sciences",
    url: "https://nap.nationalacademies.org/catalog/10490/dietary-reference-intakes-for-energy-carbohydrate-fiber-fat-fatty-acids-cholesterol-protein-and-amino-acids",
  },
  {
    title: "Weight Management Guidelines",
    source:
      "National Institute of Diabetes and Digestive and Kidney Diseases (NIH)",
    url: "https://www.niddk.nih.gov/health-information/weight-management",
  },
] as const;

export const HEALTH_DISCLAIMER_TEXT =
  "Orca provides health and nutrition information for general wellness purposes only. All calculations are based on established scientific formulas and published research (see sources below). This app does not provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional before making significant changes to your diet, exercise routine, or health plan.";
