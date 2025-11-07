import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const COLORS = {
  primary: "#4CAF50",
  primaryDark: "#45a049",
  primaryLight: "#E8F5E9",
  secondary: "#8BC34A",
  background: "#FFFFFF",
  backgroundLight: "#F8F9FA",
  text: "#2C3E50",
  textLight: "#95A5A6",
  textDark: "#1A1A1A",
  border: "#E8E8E8",
  error: "#FF6B6B",
  success: "#4CAF50",
  white: "#FFFFFF",
  overlay: "rgba(0, 0, 0, 0.5)",
};

export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
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

  // Logo Section
  logoContainer: {
    alignItems: "center",
    marginBottom: 32, // ← Gap between logo and form
  },
  logoWrapper: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    ...SHADOWS.medium,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  appTagline: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },

  // Form Section
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
    minHeight: 40, // ← Fixed height to prevent jumping
  },
  formSubtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 18,
    lineHeight: 24,
    minHeight: 48, // ← Fixed height to prevent jumping (2 lines)
  },

  // Input Fields
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 8,
    letterSpacing: 0.2,
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
    backgroundColor: COLORS.background,
    minHeight: 56,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
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

  // Error Message
  errorText: {
    fontSize: 13,
    color: COLORS.error,
    marginTop: 6,
    marginLeft: 4,
  },

  // Forgot Password
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

  // Submit Button
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    minHeight: 56,
    ...SHADOWS.medium,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
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

  // Social Buttons
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
    borderRadius: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.background,
    minHeight: 56,
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

  // Toggle Section
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
    minHeight: 70, // ← Fixed height to prevent jumping
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

  // Terms & Privacy
  termsContainer: {
    paddingTop: 16,
    paddingBottom: 8,
    minHeight: 60, // ← Fixed height to prevent jumping when showing/hiding
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
