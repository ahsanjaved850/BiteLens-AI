import { AIFeatureShowcase } from "@/src/components/OnboardingFeatures/AIFeatureShowcase";
import { AIScannerComparison } from "@/src/components/OnboardingFeatures/AIScannerComparison";
import { AppIntro } from "@/src/components/OnboardingFeatures/AppIntro";
import { AppearanceGoals } from "@/src/components/OnboardingFeatures/AppearanceGoals";
import { BirthYearPicker } from "@/src/components/OnboardingFeatures/BirthYearPicker";
import { CalorieKnowledge } from "@/src/components/OnboardingFeatures/CalorieKnowledge";
import { Completion } from "@/src/components/OnboardingFeatures/Completion";
import { CurrentWeight } from "@/src/components/OnboardingFeatures/CurrentWeight";
import { EatingHabits } from "@/src/components/OnboardingFeatures/EatingHabits";
import { EatingStyle } from "@/src/components/OnboardingFeatures/EatingStyle";
import { FitnessGoal } from "@/src/components/OnboardingFeatures/FitnessGoal";
import { FoodComparison } from "@/src/components/OnboardingFeatures/FoodComparison";
import { FoodRecordHabit } from "@/src/components/OnboardingFeatures/FoodRecordHabit";
import { GenderSelection } from "@/src/components/OnboardingFeatures/GenderSelection";
import { HealthConcerns } from "@/src/components/OnboardingFeatures/HealthConcerns";
import { HeightPicker } from "@/src/components/OnboardingFeatures/HeightPicker";
import { LongTermResults } from "@/src/components/OnboardingFeatures/LongTermResults";
import { MacroTracker } from "@/src/components/OnboardingFeatures/MacroTracker";
import { MotivationQuestion } from "@/src/components/OnboardingFeatures/MotivationQuestion";
import { MotivationalSlide } from "@/src/components/OnboardingFeatures/MotivationSlide";
import { NameAdding } from "@/src/components/OnboardingFeatures/NameAdding";
import { NutrientAwareness } from "@/src/components/OnboardingFeatures/NutrientAwareness";
import { OtherApps } from "@/src/components/OnboardingFeatures/OtherApps";
import { PainPointSlide } from "@/src/components/OnboardingFeatures/PainPointSlide";
import { PersonalizedPlan } from "@/src/components/OnboardingFeatures/PersonalizedPlan";
import { RelateStatements } from "@/src/components/OnboardingFeatures/RelateStatements";
import { SnackTriggers } from "@/src/components/OnboardingFeatures/SnackTriggers";
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
// Pages — 31-slide flow (BiteLens)
//
// Flow logic:
//   0–2   → Hook: Brand intro, validate pain, show AI magic
//   3–6   → Relate: Emotional connection via relatable statements
//   7–12  → Understand: Behavior profiling & knowledge assessment
//   13–18 → Educate & Trust: Show features, comparisons, social proof
//   19–27 → Personalize: Data collection (user understands WHY)
//   28    → Personalized payoff (the reward for sharing data)
//   29    → Completion animation + transition to home
//
// Psychology:
//   • Hook fast (0–2) → user decides in 8 seconds
//   • Relate before asking (3–6) → build empathy & emotional investment
//   • Assess knowledge (7–12) → tailor later messaging
//   • Educate with proof (13–18) → trust before data collection
//   • Collect data last (19–27) → invested user = willing sharer
//   • Reward immediately (28) → personalized plan = dopamine hit
// ────────────────────────────────────────────────────────────────────
export const PAGES: OnboardingPage[] = [
  // ── Phase 1: Hook & Wow (0–2) ──
  { key: "1",  component: AppIntro,              requiresValidation: false },  //  0 — BiteLens intro: "Track in seconds, not minutes"
  { key: "2",  component: PainPointSlide,        requiresValidation: false },  //  1 — "Sound familiar?" — validate past pain
  { key: "3",  component: AIFeatureShowcase,     requiresValidation: false },  //  2 — AI scanning magic: snap → instant macros

  // ── Phase 2: Relate & Empathize (3–6) ──
  { key: "4",  component: RelateStatements,      requiresValidation: true },   //  3 — "Do you relate?" — 4 swipeable yes/no cards
  { key: "5",  component: MotivationQuestion,    requiresValidation: true },   //  4 — "What motivates you most?"
  { key: "6",  component: AppearanceGoals,       requiresValidation: true },   //  5 — "What's most important to you?"
  { key: "7",  component: OtherApps,             requiresValidation: true },   //  6 — "Have you tracked before?"

  // ── Phase 3: Behavior & Knowledge Assessment (7–12) ──
  { key: "8",  component: FoodRecordHabit,       requiresValidation: true },   //  7 — "Do you keep a record of what you eat?"
  { key: "9",  component: NutrientAwareness,     requiresValidation: true },   //  8 — "Do you know what nutrients you've consumed?"
  { key: "10", component: CalorieKnowledge,      requiresValidation: true },   //  9 — "Calories & weight relationship?"
  { key: "11", component: EatingStyle,           requiresValidation: true },   // 10 — "Preferred eating style?" (Vegan, Keto, etc.)
  { key: "12", component: EatingHabits,          requiresValidation: true },   // 11 — "Any eating habits to change?" (multi-select)
  { key: "13", component: SnackTriggers,         requiresValidation: true },   // 12 — "What triggers your snacking?" (multi-select)

  // ── Phase 4: Educate & Build Trust (13–18) ──
  { key: "14", component: AIScannerComparison,   requiresValidation: false },  // 14 — Traditional vs BiteLens AI (portions variant)
  { key: "15", component: FoodComparison,        requiresValidation: false },  // 15 — Same calories, different results
  { key: "16", component: MacroTracker,          requiresValidation: false },  // 16 — Master your macros
  { key: "17", component: LongTermResults,       requiresValidation: false },  // 17 — Restricted Diet vs BiteLens Meal Plan
  { key: "18", component: SocialProof,           requiresValidation: false },  // 18 — Real people, real results

  // ── Phase 5: Personalize — Data Collection (19–27) ──
  { key: "19", component: NameAdding,            requiresValidation: true },   // 19 — "What should we call you?"
  { key: "20", component: GenderSelection,       requiresValidation: true },   // 20 — Gender
  { key: "21", component: FitnessGoal,           requiresValidation: true },   // 21 — Gain / Maintain / Lose
  { key: "22", component: BirthYearPicker,       requiresValidation: false },  // 22 — Birth year (has default: 2000)
  { key: "23", component: HeightPicker,          requiresValidation: false },  // 23 — Height (has default: 170cm)
  { key: "24", component: CurrentWeight,         requiresValidation: false },  // 24 — Current weight (has default: 78kg)
  { key: "25", component: TargetWeight,          requiresValidation: false },  // 25 — Target weight (has default: current - 3)
  { key: "26", component: HealthConcerns,        requiresValidation: true },   // 26 — Health concerns (multi-select)

  // ── Phase 6: Payoff & Emotional Close (27–29) ──
  { key: "27", component: WeeklyInsight,         requiresValidation: false },  // 27 — "One bad meal won't ruin your week"
  { key: "28", component: MotivationalSlide,     requiresValidation: false },  // 28 — "Flexible beats rigid. Always."
  { key: "29", component: PersonalizedPlan,      requiresValidation: false },  // 29 — "Your personalized daily plan"
  { key: "30", component: Completion,            requiresValidation: false },  // 30 — Loading → done → navigate home
];

// ────────────────────────────────────────────────────────────────────
// Initial validation state
// true  = page is passable immediately (no user input required)
// false = user must interact before "Continue" is enabled
// ────────────────────────────────────────────────────────────────────
export const INITIAL_PAGE_VALIDATION: PageValidationState = {
  // Phase 1: Hook & Wow
  0:  true,   // AppIntro — static, no input
  1:  true,   // PainPointSlide — static, no input
  2:  true,   // AIFeatureShowcase — static, no input

  // Phase 2: Relate & Empathize
  3:  false,  // RelateStatements — needs to answer all 4 cards
  4:  false,  // MotivationQuestion — needs selection
  5:  false,  // AppearanceGoals — needs selection
  6:  false,  // OtherApps — needs selection

  // Phase 3: Behavior & Knowledge Assessment
  7:  false,  // FoodRecordHabit — needs selection
  8:  false,  // NutrientAwareness — needs selection
  9:  false,  // CalorieKnowledge — needs selection
  10: false,  // EatingStyle — needs selection
  11: false,  // EatingHabits — needs selection (multi-select)
  12: false,  // SnackTriggers — needs selection (multi-select)

  // Phase 4: Educate & Build Trust
  13: true,   // AIScannerComparison — static, no input
  14: true,   // FoodComparison — static, no input
  15: true,   // MacroTracker — static, no input
  16: true,   // LongTermResults — static, no input
  17: true,   // SocialProof — static, no input

  // Phase 5: Personalize — Data Collection
  18: false,  // NameAdding — needs name input
  19: false,  // GenderSelection — needs selection
  20: false,  // FitnessGoal — needs selection
  21: true,   // BirthYearPicker — has default (2000)
  22: true,   // HeightPicker — has default (170cm)
  23: true,   // CurrentWeight — has default (78kg)
  24: true,   // TargetWeight — has default (current - 3)
  25: false,  // HealthConcerns — needs selection

  // Phase 6: Payoff & Emotional Close
  26: true,   // WeeklyInsight — static, no input
  27: true,   // MotivationalSlide — static, no input
  28: true,   // PersonalizedPlan — static display
  29: true,   // Completion — auto-animates
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