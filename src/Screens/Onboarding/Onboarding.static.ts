import { AppIntro } from "@/src/components/OnboardingFeatures/AppIntro";
import { BirthYearPicker } from "@/src/components/OnboardingFeatures/BirthYearPicker";
import { Completion } from "@/src/components/OnboardingFeatures/Completion";
import { CurrentWeight } from "@/src/components/OnboardingFeatures/CurrentWeight";
import { Demo } from "@/src/components/OnboardingFeatures/Demo";
import { FitnessGoal } from "@/src/components/OnboardingFeatures/FitnessGoal";
import { FoodComparison } from "@/src/components/OnboardingFeatures/FoodComparison";
import { GenderSelection } from "@/src/components/OnboardingFeatures/GenderSelection";
import { HealthConcerns } from "@/src/components/OnboardingFeatures/HealthConcerns";
import { HeightPicker } from "@/src/components/OnboardingFeatures/HeightPicker";
import { MacroTracker } from "@/src/components/OnboardingFeatures/MacroTracker";
import { MotivationalSlide } from "@/src/components/OnboardingFeatures/MotivationSlide";
import { NameAdding } from "@/src/components/OnboardingFeatures/NameAdding";
import { OtherApps } from "@/src/components/OnboardingFeatures/OtherApps";
import { SocialProof } from "@/src/components/OnboardingFeatures/SocialProof";
import { TargetWeight } from "@/src/components/OnboardingFeatures/TargetWeight";
import { ComponentType } from "react";

export interface PageValidationState {
  [key: number]: boolean;
}

export interface OnboardingPage {
  key: string;
  component: ComponentType<any>;
  requiresValidation: boolean;
}

export const PAGES: OnboardingPage[] = [
  { key: "1", component: AppIntro, requiresValidation: false },       // 0
  { key: "2", component: Demo, requiresValidation: false },           // 1
  { key: "3", component: MacroTracker, requiresValidation: false },   // 2
  { key: "4", component: MotivationalSlide, requiresValidation: false }, // 3
  { key: "5", component: NameAdding, requiresValidation: true },      // 4
  { key: "6", component: GenderSelection, requiresValidation: true }, // 5
  { key: "7", component: BirthYearPicker, requiresValidation: false },// 6  ← NEW separate screen
  { key: "8", component: HeightPicker, requiresValidation: false },   // 7  ← NEW separate screen
  { key: "9", component: CurrentWeight, requiresValidation: false },  // 8  ← NEW separate screen
  { key: "10", component: TargetWeight, requiresValidation: false },  // 9  ← NEW separate screen
  { key: "11", component: HealthConcerns, requiresValidation: true }, // 10
  { key: "12", component: FoodComparison, requiresValidation: false },// 11
  { key: "13", component: OtherApps, requiresValidation: true },      // 12
  { key: "14", component: FitnessGoal, requiresValidation: true },    // 13
  { key: "15", component: SocialProof, requiresValidation: false },   // 14
  { key: "16", component: Completion, requiresValidation: false },    // 15
];

export const INITIAL_PAGE_VALIDATION: PageValidationState = {
  0: true,   // AppIntro
  1: true,   // Demo
  2: true,   // MacroTracker
  3: true,   // MotivationalSlide
  4: false,  // NameAdding — needs name input
  5: false,  // GenderSelection — needs selection
  6: true,   // BirthYearPicker — has default (2000)
  7: true,   // HeightPicker — has default (170cm)
  8: true,   // CurrentWeight — has default (78kg)
  9: true,   // TargetWeight — has default (75kg)
  10: false, // HealthConcerns — needs selection
  11: true,  // FoodComparison
  12: true, // OtherApps — needs selection
  13: false, // FitnessGoal — needs selection
  14: true,  // SocialProof
  15: true,  // Completion
};

export const BUTTON_TEXT = {
  NEXT: "Continue",
  GET_STARTED: "Get Started 🚀",
  BACK: "←",
} as const;

export const STORAGE_KEYS = {
  ONBOARDING_SEEN: "onboarding_seen",
} as const;

export const VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 50,
} as const;

export const NAVIGATION_ROUTES = {
  HOME: "/tabs/home",
} as const;