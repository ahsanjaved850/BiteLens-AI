export interface LoginScreenProps {
  onLogin: () => void;
  // Called when Apple Sign-In succeeds at the Apple/Supabase level but the
  // user has no matching profile in our DB (i.e. they never signed up).
  onNoAccount?: () => void;
  // "signin" — shows only login form, no signup toggle
  // "signup" — shows only signup form, no signin toggle
  mode?: "signin" | "signup";
}

export interface ValidationErrors {
  email?: string;
  password?: string;
}

export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_PASSWORD_LENGTH: 6,
} as const;

export const ERROR_MESSAGES = {
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Please enter a valid email",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_TOO_SHORT: "Password must be at least 6 characters",
} as const;

export const FORM_LABELS = {
  EMAIL: "Email",
  PASSWORD: "Password",
} as const;

export const PLACEHOLDERS = {
  EMAIL: "your@email.com",
  PASSWORD_LOGIN: "Enter password",
  PASSWORD_SIGNUP: "Min. 6 characters",
} as const;

export const FORM_TITLES = {
  SIGN_IN: "Log In",
  SIGN_UP: "Create Account",
} as const;

export const FORM_SUBTITLES = {
  SIGN_IN: "",
  SIGN_UP: "Sign up to start your wellness journey",
} as const;

export const BUTTON_LABELS = {
  SIGN_IN: "Log In",
  SIGN_UP: "Create Account",
} as const;

export const TOGGLE_TEXTS = {
  TO_SIGN_IN: "Already have an account?",
  TO_SIGN_UP: "New to Orca?",
} as const;

export const TOGGLE_LINKS = {
  SIGN_IN: "Sign In",
  SIGN_UP: "Sign Up",
} as const;

export const ALERT_MESSAGES = {
  SIGNUP_SUCCESS: {
    title: "Success! 🎉",
    message: "Account created! Please verify your email to continue.",
    button: "OK",
  },
  SIGNUP_FAILED: {
    title: "Signup Failed",
    fallback: "Something went wrong. Please try again.",
    button: "OK",
  },
  LOGIN_FAILED: {
    title: "Login Failed",
    fallback: "Something went wrong. Please try again.",
    button: "OK",
  },
} as const;

export const APP_INFO = {
  NAME: "Orca",
  TAGLINE: "Your AI Nutrition Assistant",
} as const;

export const SIGNUP_PROGRESS = {
  TITLE: "Setting things up",
  CAPTION: "This only takes a moment",
  STEPS: [
    "Creating your account",
    "Saving your personalized plan",
    "Preparing your dashboard",
  ],
} as const;

export const PASSWORD_TOGGLE_ICONS = {
  SHOW: "👁️",
  HIDE: "👁️‍🗨️",
} as const;

export const KEYBOARD_CONFIG = {
  IOS_OFFSET: 0,
  ANDROID_OFFSET: 20,
} as const;
