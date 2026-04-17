import { AIFeatureShowcase } from "@/src/components/OnboardingFeatures/AIFeatureShowcase";
import { AppIntro } from "@/src/components/OnboardingFeatures/AppIntro";
import { BirthYearPicker } from "@/src/components/OnboardingFeatures/BirthYearPicker";
import { Completion } from "@/src/components/OnboardingFeatures/Completion";
import { CurrentWeight } from "@/src/components/OnboardingFeatures/CurrentWeight";
import { FitnessGoal } from "@/src/components/OnboardingFeatures/FitnessGoal";
import { FoodComparison } from "@/src/components/OnboardingFeatures/FoodComparison";
import { GenderSelection } from "@/src/components/OnboardingFeatures/GenderSelection";
import { HealthConcerns } from "@/src/components/OnboardingFeatures/HealthConcerns";
import { HeightPicker } from "@/src/components/OnboardingFeatures/HeightPicker";
import { MacroTracker } from "@/src/components/OnboardingFeatures/MacroTracker";
import { MotivationalSlide } from "@/src/components/OnboardingFeatures/MotivationSlide";
import { NameAdding } from "@/src/components/OnboardingFeatures/NameAdding";
import { OtherApps } from "@/src/components/OnboardingFeatures/OtherApps";
import { PainPointSlide } from "@/src/components/OnboardingFeatures/PainPointSlide";
import { PersonalizedPlan } from "@/src/components/OnboardingFeatures/PersonalizedPlan";
import { SocialProof } from "@/src/components/OnboardingFeatures/SocialProof";
import { TargetWeight } from "@/src/components/OnboardingFeatures/TargetWeight";
import { WeeklyInsight } from "@/src/components/OnboardingFeatures/WeeklyInsight";
import { ComponentType } from "react";

// ────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────
export interface PageValidationState {
  [key: number]: boolean;
}

export interface OnboardingPage {
  key: string;
  component: ComponentType<any>;
  requiresValidation: boolean;
}

// ────────────────────────────────────────────────────────────────────
// Pages — 19-slide flow
//
// Flow logic:
//   0–2  → Hook, validate pain, show AI magic (emotional buy-in)
//   3–8  → Education & trust building (user is now invested)
//   9–16 → Data collection (user understands WHY we need this)
//   17   → Personalized payoff (the reward for sharing data)
//   18   → Completion animation + transition to home
// ────────────────────────────────────────────────────────────────────
export const PAGES: OnboardingPage[] = [
  // ── Hook & Wow ──
  { key: "1",  component: AppIntro,         requiresValidation: false },  //  0 — "Track in seconds, not minutes"
  { key: "2",  component: PainPointSlide,   requiresValidation: false },  //  1 — "Sound familiar?"
  { key: "3",  component: AIFeatureShowcase, requiresValidation: false }, //  2 — AI scanning magic

  // ── Educate & Trust ──
  { key: "4",  component: OtherApps,        requiresValidation: true },   //  3 — "Have you tracked before?"
  { key: "5",  component: FoodComparison,   requiresValidation: false },  //  4 — Same calories, different results
  { key: "6",  component: MacroTracker,     requiresValidation: false },  //  5 — Master your macros
  { key: "7",  component: WeeklyInsight,    requiresValidation: false },  //  6 — Weekly trends > daily guilt
  { key: "8",  component: MotivationalSlide, requiresValidation: false }, //  7 — Flexible beats rigid
  { key: "9",  component: SocialProof,      requiresValidation: false },  //  8 — Real people, real results

  // ── Personalize (Data Collection) ──
  { key: "10", component: NameAdding,       requiresValidation: true },   //  9 — "What should we call you?"
  { key: "11", component: GenderSelection,  requiresValidation: true },   // 10 — Gender
  { key: "12", component: BirthYearPicker,  requiresValidation: false },  // 11 — Birth year (has default)
  { key: "13", component: HeightPicker,     requiresValidation: false },  // 12 — Height (has default)
  { key: "14", component: CurrentWeight,    requiresValidation: false },  // 13 — Current weight (has default)
  { key: "15", component: TargetWeight,     requiresValidation: false },  // 14 — Target weight (has default)
  { key: "16", component: FitnessGoal,      requiresValidation: true },   // 15 — Gain / Maintain / Lose
  { key: "17", component: HealthConcerns,   requiresValidation: true },   // 16 — Health concerns

  // ── Payoff & Finish ──
  { key: "18", component: PersonalizedPlan, requiresValidation: false },  // 17 — "Your personalized daily plan"
  { key: "19", component: Completion,       requiresValidation: false },  // 18 — Loading → done
];

// ────────────────────────────────────────────────────────────────────
// Initial validation state
// true  = page is passable immediately (no user input required)
// false = user must interact before "Continue" is enabled
// ────────────────────────────────────────────────────────────────────
export const INITIAL_PAGE_VALIDATION: PageValidationState = {
  0:  true,   // AppIntro — static, no input
  1:  true,   // PainPointSlide — static, no input
  2:  true,   // AIFeatureShowcase — static, no input
  3:  false,  // OtherApps — needs selection
  4:  true,   // FoodComparison — static, no input
  5:  true,   // MacroTracker — static, no input
  6:  true,   // WeeklyInsight — static, no input
  7:  true,   // MotivationalSlide — static, no input
  8:  true,   // SocialProof — static, no input
  9:  false,  // NameAdding — needs name input
  10: false,  // GenderSelection — needs selection
  11: true,   // BirthYearPicker — has default (2000)
  12: true,   // HeightPicker — has default (170cm)
  13: true,   // CurrentWeight — has default (78kg)
  14: true,   // TargetWeight — has default (current - 3)
  15: false,  // FitnessGoal — needs selection
  16: false,  // HealthConcerns — needs selection
  17: true,   // PersonalizedPlan — static display
  18: true,   // Completion — auto-animates
};

// ────────────────────────────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────────────────────────────
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