import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const COLORS = {
  primary: "#F5A623",
  primaryDark: "#E8951A",
  primaryLight: "#FFF8EC",
  secondary: "#1B2838",
  background: "#FFFDF7",
  backgroundLight: "#FFF9ED",
  text: "#1B2838",
  textLight: "#9CA8B7",
  textDark: "#0F1923",
  border: "#EDE8DF",
  error: "#EF4444",
  success: "#2ECC71",
  white: "#FFFFFF",
  overlay: "rgba(15, 25, 35, 0.5)",
};

export const SHADOWS = {
  small: {
    shadowColor: "#1B2838",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: "#1B2838",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
};

export const loginStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 74,
  },

  // Logo
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoWrapper: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.background,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  appTagline: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },

  // Form
  formContainer: {
    flex: 1,
    justifyContent: "center",
  },
  formTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 8,
    letterSpacing: -0.5,
    minHeight: 40,
  },
  formSubtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 18,
    lineHeight: 24,
    minHeight: 48,
  },

  // Inputs
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: COLORS.textDark,
    backgroundColor: COLORS.white,
    minHeight: 58,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputIcon: {
    position: "absolute",
    right: 16,
    top: 18,
  },
  passwordToggle: {
    padding: 4,
  },
  passwordToggleText: {
    fontSize: 24,
  },

  // Error
  errorText: {
    fontSize: 13,
    color: COLORS.error,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: "500",
  },

  // Forgot
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginTop: 8,
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },

  // Submit
  submitButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    minHeight: 58,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  submitButtonTextDisabled: {
    color: COLORS.textLight,
  },

  // Divider
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: "500",
  },

  // Social
  socialButtonsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 50,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    minHeight: 58,
  },
  socialButtonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
  },

  // Toggle
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
    minHeight: 70,
  },
  toggleText: {
    fontSize: 15,
    color: COLORS.textLight,
    marginRight: 6,
  },
  toggleLink: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
  },

  // Terms
  termsContainer: {
    paddingTop: 16,
    paddingBottom: 8,
    minHeight: 60,
  },
  termsText: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 20,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});