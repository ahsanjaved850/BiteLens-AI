export interface LoadingProps {
  message?: string;
  type?: LoadingType;
  overlay?: boolean;
}

export type LoadingType = "onboarding" | "analysis" | "setup" | "default";

export const LOADING_MESSAGES: Record<LoadingType, string[]> = {
  onboarding: [
    "Setting up your profile...",
    "Calculating your nutrition plan...",
    "Creating your personalized goals...",
    "Almost done!",
  ],
  analysis: [
    "Analyzing your meal...",
    "Identifying ingredients...",
    "Calculating nutrition...",
    "Done!",
  ],
  setup: [
    "Preparing your vegan journey...",
    "Loading your meal database...",
    "Syncing with your goals...",
    "Ready to go!",
  ],
  default: ["Loading..."],
};

export const SUBMESSAGES: Record<LoadingType, string> = {
  onboarding: "This helps us understand your dietary needs",
  analysis: "Using AI to ensure accuracy",
  setup: "Customizing for your vegan lifestyle",
  default: "",
};

export const APP_NAME = "GreenBite AI";

export const MESSAGE_ROTATION_INTERVAL = 2000;

export const LOADER_COLOR = "#2ecc71";
