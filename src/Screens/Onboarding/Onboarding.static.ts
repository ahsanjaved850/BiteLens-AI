import { Approach } from "@/src/components/OnboardingFeatures/EatingHabits/Approach";
import { CheatDiet } from "@/src/components/OnboardingFeatures/EatingHabits/CheatDiet";
import { Distraction } from "@/src/components/OnboardingFeatures/EatingHabits/Distraction";
import { EatingPlace } from "@/src/components/OnboardingFeatures/EatingHabits/EatingPlace";
import { EatingStyle } from "@/src/components/OnboardingFeatures/EatingHabits/EatingStyle";
import { Eatout } from "@/src/components/OnboardingFeatures/EatingHabits/Eatout";
import { Exercise } from "@/src/components/OnboardingFeatures/EatingHabits/Exercise";
import { FoodComparison } from "@/src/components/OnboardingFeatures/EatingHabits/FoodComparison";
import { GuiltSnacking } from "@/src/components/OnboardingFeatures/EatingHabits/GuiltSnacking";
import { HabitsInfo } from "@/src/components/OnboardingFeatures/EatingHabits/HabitsInfo";
import { MealsPerDay } from "@/src/components/OnboardingFeatures/EatingHabits/MealsPerDay";
import { Snacks } from "@/src/components/OnboardingFeatures/EatingHabits/Snacks";
import { Completion } from "@/src/components/OnboardingFeatures/FinalStep/Completion";
import { FinalYes } from "@/src/components/OnboardingFeatures/FinalStep/FinalYes";
import { BirthYearPicker } from "@/src/components/OnboardingFeatures/GoalInfo/BirthYearPicker";
import { CurrentWeight } from "@/src/components/OnboardingFeatures/GoalInfo/CurrentWeight";
import { FitnessGoal } from "@/src/components/OnboardingFeatures/GoalInfo/FitnessGoal";
import { GenderSelection } from "@/src/components/OnboardingFeatures/GoalInfo/GenderSelection";
import { HealthConcerns } from "@/src/components/OnboardingFeatures/GoalInfo/HealthConcerns";
import { HeightPicker } from "@/src/components/OnboardingFeatures/GoalInfo/HeightPicker";
import { LongTermResults } from "@/src/components/OnboardingFeatures/GoalInfo/LongTermResults";
import { NameAdding } from "@/src/components/OnboardingFeatures/GoalInfo/NameAdding";
import { TargetWeight } from "@/src/components/OnboardingFeatures/GoalInfo/TargetWeight";
import { WeightGoalCelebration } from "@/src/components/OnboardingFeatures/GoalInfo/WeightGoalCelebration";
import { AppIntro } from "@/src/components/OnboardingFeatures/Intro/AppIntro";
import { AppIntro2 } from "@/src/components/OnboardingFeatures/Intro/AppIntro2";
import { AppIntro3 } from "@/src/components/OnboardingFeatures/Intro/AppIntro3";
import { BodyTransformationSlide } from "@/src/components/OnboardingFeatures/Intro/BodyTransformationSlide";
import { Achieved } from "@/src/components/OnboardingFeatures/Motive/Achieved";
import { Motivation } from "@/src/components/OnboardingFeatures/Motive/Motivation";
import { MotiveIntro } from "@/src/components/OnboardingFeatures/Motive/MotiveIntro";
import { RelateStatements } from "@/src/components/OnboardingFeatures/Motive/RelateStatements";
import { SocialProofStats } from "@/src/components/OnboardingFeatures/Motive/SocialProofStats";
import { Treat } from "@/src/components/OnboardingFeatures/Motive/Treat";
import { BasicUnderstanding } from "@/src/components/OnboardingFeatures/Nutrition/BasicUnderstanding";
import { CarbsSource } from "@/src/components/OnboardingFeatures/Nutrition/CarbsSource";
import { FoodLabel } from "@/src/components/OnboardingFeatures/Nutrition/FoodLabel";
import { Graph } from "@/src/components/OnboardingFeatures/Nutrition/Graph";
import { ManualTrack } from "@/src/components/OnboardingFeatures/Nutrition/ManualTrack";
import { Nutrients } from "@/src/components/OnboardingFeatures/Nutrition/Nutrients";
import { NutritionIntro } from "@/src/components/OnboardingFeatures/Nutrition/NutritionIntro";
import { PastExperience } from "@/src/components/OnboardingFeatures/Nutrition/PastExperience";
import { ProteinSource } from "@/src/components/OnboardingFeatures/Nutrition/ProteinSource";
import { Tracking } from "@/src/components/OnboardingFeatures/Nutrition/Tracking";
import { YoyoEffect } from "@/src/components/OnboardingFeatures/Nutrition/YoyoEffect";
import { ComponentType } from "react";
import { BodyChange } from "../../components/OnboardingFeatures/GoalInfo/BodyChange";
import { FaceChange } from "../../components/OnboardingFeatures/GoalInfo/FaceChange";
import { GoalInfo } from "../../components/OnboardingFeatures/GoalInfo/GoalInfo";
import { TransformationReviews } from "../../components/OnboardingFeatures/GoalInfo/TransformationReviews";

export interface PageValidationState {
  [key: number]: boolean;
}

export interface OnboardingPage {
  key: string;
  component: ComponentType<any>;
  requiresValidation: boolean;
  skipOnBack?: boolean;
  triggerReview?: boolean;
}

export const PAGES: OnboardingPage[] = [
  // Chapter 0: Orca 1-2-3 Approach (0–2)
  { key: "1", component: AppIntro, requiresValidation: false }, //  0 : Scan meal with AI (ImageReel)
  { key: "2", component: AppIntro2, requiresValidation: false }, //  1 : Second intro slide (ImageReel)
  { key: "3", component: AppIntro3, requiresValidation: false }, //  2 : Third intro slide (ImageReel)
  { key: "4", component: BodyTransformationSlide, requiresValidation: false }, //  3 : Body transformation preview

  // Chapter 1: Goal & Info

  { key: "5", component: GoalInfo, requiresValidation: false }, //  4 : Goal info + image
  { key: "6", component: FitnessGoal, requiresValidation: true }, // 23 : Gain / Maintain / Lose
  { key: "7", component: LongTermResults, requiresValidation: false }, // 19 : Restricted Diet vs Orca Meal Plan
  { key: "8", component: NameAdding, requiresValidation: true }, // 21 : "What should we call you?"
  { key: "9", component: GenderSelection, requiresValidation: true }, // 22 : Gender
  { key: "10", component: BirthYearPicker, requiresValidation: false }, // 24 : Birth year (default: 2000)
  { key: "11", component: TransformationReviews, requiresValidation: false }, // 24 : Transformation reviews (default: 2000)
  { key: "12", component: HeightPicker, requiresValidation: false }, // 25 : Height (default: 170cm)
  { key: "13", component: CurrentWeight, requiresValidation: false }, // 26 : Current weight (default: 78kg)
  { key: "14", component: TargetWeight, requiresValidation: false }, // 27 : Target weight (default: current - 3)
  { key: "15", component: WeightGoalCelebration, requiresValidation: false }, // 28 : Celebrate goal + show expected transformation
  { key: "16", component: BodyChange, requiresValidation: false }, // 26 : Body change image + text
  { key: "17", component: FaceChange, requiresValidation: false }, // 27 : face change image + text
  { key: "18", component: HealthConcerns, requiresValidation: true }, // 28 : Health concerns (multi-select)

  // Chapter 2: Habits & Info

  { key: "19", component: HabitsInfo, requiresValidation: false }, //  4 : Habits info + image
  { key: "20", component: MealsPerDay, requiresValidation: true }, //  4 : Habits info + image
  { key: "21", component: FoodComparison, requiresValidation: false }, // 17 : Same calories, different results
  { key: "22", component: Exercise, requiresValidation: false }, // 17 : Same calories, different results
  { key: "23", component: Eatout, requiresValidation: true }, // 17 : Same calories, different results
  {
    key: "24",
    component: EatingPlace,
    requiresValidation: true,
    triggerReview: true,
  },
  { key: "25", component: Approach, requiresValidation: false },
  { key: "26", component: Distraction, requiresValidation: false }, // 17 : Same calories, different results
  { key: "27", component: Snacks, requiresValidation: false }, // 18 : What triggers your snacking?
  { key: "28", component: GuiltSnacking, requiresValidation: false }, // 18 : What triggers your snacking?
  { key: "29", component: CheatDiet, requiresValidation: true }, // 18 : What triggers your snacking?
  { key: "30", component: EatingStyle, requiresValidation: true }, // 13 : "Preferred eating style?"

  // Chapter 3: Nutrition & Info

  { key: "31", component: NutritionIntro, requiresValidation: false }, //  4 : Nutrition info + image
  { key: "32", component: BasicUnderstanding, requiresValidation: false }, //  4 : Basic understanding of nutrition
  { key: "33", component: PastExperience, requiresValidation: false }, //  4 : Past experience with nutrition-related challenges
  { key: "34", component: YoyoEffect, requiresValidation: true }, //  4 : Past experience with nutrition-related challenges
  { key: "35", component: FoodLabel, requiresValidation: true }, //  4 : Past experience with nutrition-related challenges
  { key: "36", component: ManualTrack, requiresValidation: true }, //  4 : Past experience with nutrition-related challenges
  { key: "37", component: Tracking, requiresValidation: false }, //  4 : Past experience with nutrition-related challenges
  { key: "38", component: ProteinSource, requiresValidation: true }, //  4 : Past experience with nutrition-related challenges
  { key: "39", component: CarbsSource, requiresValidation: true }, //  4 : Past experience with nutrition-related challenges
  { key: "40", component: Nutrients, requiresValidation: true }, //  4 : Past experience with nutrition-related challenges
  { key: "41", component: Graph, requiresValidation: false }, //  4 : Past experience with nutrition-related challenges

  // Chapter 4: Motive & Relate
  { key: "42", component: MotiveIntro, requiresValidation: false }, //  4 : "Sound familiar?" : validate past pain
  { key: "43", component: Motivation, requiresValidation: true }, //  4 : "Sound familiar?" : validate past pain
  {
    key: "44",
    component: RelateStatements,
    requiresValidation: true,
    skipOnBack: true,
  },
  { key: "45", component: SocialProofStats, requiresValidation: false }, //  4 : "Sound familiar?" : validate past pain
  { key: "46", component: Treat, requiresValidation: true }, //  4 : "Sound familiar?" : validate past pain
  { key: "47", component: Achieved, requiresValidation: true }, //  4 : "Sound familiar?" : validate past pain

  {
    key: "48",
    component: FinalYes,
    requiresValidation: false,
    skipOnBack: true,
  },
  { key: "49", component: Completion, requiresValidation: false }, // 32 : Loading → done → navigate home
];

export const INITIAL_PAGE_VALIDATION: PageValidationState = {
  // Chapter 0: Orca 1-2-3 Approach
  0: true, // AppIntro1 : static
  1: true, // AppIntro2 : static
  2: true, // AppIntro3 : static
  3: true, // trans : static

  // Chapter 1: Goal & Info
  4: true, // GoalInfo : static
  5: false, // FitnessGoal : needs selection
  6: true, // LongTermResults : static
  7: false, // NameAdding : needs name input
  8: false, // GenderSelection : needs selection
  9: true, // BirthYearPicker : has default (2000)
  10: true, // TransformationReview
  11: true, // HeightPicker : has default (170cm)
  12: true, // CurrentWeight : has default (78kg)
  13: true, // TargetWeight : has default (current - 3)
  14: true, // TargetWeight : has default (current - 3)
  15: true, // body change : static
  16: true, // face change : static
  17: false, // HealthConcerns : needs selection

  // Chapter 2: Habits & info
  18: true, // HabitsInfo : static
  19: false, // MealsPerDay : needs selection
  20: true, // FoodComparison : static
  21: true, // Exercise : static
  22: false, // Eatout : needs selection
  23: false, // EatingPlace : needs selection
  24: true, // EatingPlace : needs selection
  25: false, // EatingPlace : needs selection
  26: false, // EatingPlace : needs selection
  27: false, // EatingPlace : needs selection
  28: true, // PainPointSlide : static
  29: false, // EatingPlace : needs selection

  // Chapter 3: Nutrition & Info
  30: true, // NutritionInfo : static
  31: false,
  32: false,
  33: true,
  34: true,
  35: true,
  36: true,
  37: false,
  38: false,
  39: false,
  40: true,

  // Chapter 4: Motive & Relate
  41: true,
  42: false,
  43: false,
  44: true,
  45: false,
  46: false,

  47: true, // FinalYes : static display
  48: true, // Completion : auto-animates
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
  SIGNUP: "/auth/signup", // post-onboarding signup screen
} as const;
