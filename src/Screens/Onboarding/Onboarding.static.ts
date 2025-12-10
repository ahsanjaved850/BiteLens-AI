import { AppIntro } from "@/src/components/OnboardingFeatures/AppIntro";
import { BodyStatInput } from "@/src/components/OnboardingFeatures/BodyStatInput";
import { Completion } from "@/src/components/OnboardingFeatures/Completion";
import { Demo } from "@/src/components/OnboardingFeatures/Demo";
import { FitnessGoal } from "@/src/components/OnboardingFeatures/FitnessGoal";
import { GenderSelection } from "@/src/components/OnboardingFeatures/GenderSelection";
import { LifeStyle } from "@/src/components/OnboardingFeatures/LifeStyle";
import { MotivationalSlide } from "@/src/components/OnboardingFeatures/MotivationSlide";
import { NameAdding } from "@/src/components/OnboardingFeatures/NameAdding";
import { OtherApps } from "@/src/components/OnboardingFeatures/OtherApps";
import { PhysiqueInput } from "@/src/components/OnboardingFeatures/PhysiqueInput";
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
  { key: "1", component: AppIntro, requiresValidation: false },
  { key: "2", component: Demo, requiresValidation: false },
  { key: "3", component: NameAdding, requiresValidation: true },
  { key: "4", component: MotivationalSlide, requiresValidation: false },
  { key: "5", component: GenderSelection, requiresValidation: true },
  { key: "6", component: OtherApps, requiresValidation: true },
  { key: "7", component: BodyStatInput, requiresValidation: false },
  { key: "8", component: PhysiqueInput, requiresValidation: true },
  { key: "9", component: FitnessGoal, requiresValidation: true },
  { key: "10", component: LifeStyle, requiresValidation: true },
  { key: "11", component: Completion, requiresValidation: false },
];

export const INITIAL_PAGE_VALIDATION: PageValidationState = {
  0: true, // AppIntro - no validation needed
  1: true, // Demo - no validation needed
  2: false, // NameAdding - needs name
  3: true, // MotivationalSlide - no validation needed
  4: false, // GenderSelection - needs gender
  5: false, // OtherApps - needs selection
  6: true, // BodyStatInput - no validation needed
  7: false, // PhysiqueInput - needs all fields
  8: false, // FitnessGoal - needs goal
  9: false, // LifeStyle - needs lifestyle
  10: true, // Completion - no validation needed
};

export const BUTTON_TEXT = {
  NEXT: "Next",
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
