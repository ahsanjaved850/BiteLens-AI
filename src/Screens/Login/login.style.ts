import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const COLORS = {
  // Gradient endpoints — pass these into <LinearGradient colors={[...]}>
  gradientTop: "#FFE0C2",
  gradientMid: "#FFF0E4",
  gradientBottom: "#FFFFFF",

  // Brand
  primary: "#F47B20",
  primaryDark: "#D96A12",
  primaryLight: "#FFF3E8",

  // Neutrals
  secondary: "#1C2B36",
  background: "#FFFAF6",
  text: "#1C2B36",
  textLight: "#A89888",
  textDark: "#0F1A22",
  border: "#F0DED0",
  borderFocus: "#F47B20",

  // Status
  error: "#E53935",
  success: "#43A047",

  // Base
  white: "#FFFFFF",
  overlay: "rgba(15, 26, 34, 0.45)",
};

export const SHADOWS = {
  small: {
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  medium: {
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 6,
  },
};

export const loginStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.gradientTop, // fallback before gradient renders
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 24,
    paddingBottom: 24,
  },

  // ── Back button
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 8,
    padding: 4,
  },
  backButtonText: {
    fontSize: 28,
    color: COLORS.textDark,
    lineHeight: 32,
  },

  // ── Logo wordmark
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  // "orca" text rendered in heavy weight — matches the brand logo style
  wordmark: {
    fontSize: 52,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -2,
    includeFontPadding: false,
    lineHeight: 60,
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
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 8,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    borderWidth: 1.5,
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
    backgroundColor: "#FFFAF6",
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: "#FFF5F5",
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
    fontSize: 22,
  },

  // ─── Error
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: "500",
  },

  // ─── Forgot
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
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    minHeight: 58,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 18,
    elevation: 9,
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
    letterSpacing: 0.4,
  },
  submitButtonTextDisabled: {
    color: COLORS.textLight,
  },

  // ─── Divider
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: "500",
  },

  // ─── Social Buttons
  socialButtonsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
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

  // ── Apple Sign In button wrapper
  // Apple mandates black button — we make it full-width pill to match
  // the submit button height and shape for visual consistency.
  appleButtonContainer: {
    width: "100%",
    marginBottom: 8,
    borderRadius: 50,
    overflow: "hidden",
  },

  // ─── Toggle
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

  // ─── Terms
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
export const ols = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    backgroundColor: COLORS.gradientTop,
  },
  wordmark: {
    fontSize: 48,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -1.5,
    marginBottom: 36,
  },
  ringWrap: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  ringGlow: {
    position: "absolute",
    width: 96 + 40,
    height: 96 + 40,
    borderRadius: (96 + 40) / 2,
    backgroundColor: "rgba(244,123,32,0.12)",
  },
  ringTrack: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 96 / 2,
    borderWidth: 4.5,
    borderColor: "rgba(244,123,32,0.14)",
  },
  ringArc: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 96 / 2,
    borderWidth: 4.5,
    borderTopColor: COLORS.primary,
    borderRightColor: "rgba(244,123,32,0.45)",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.6,
    marginBottom: 10,
  },
  step: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 18,
    minHeight: 20,
    textAlign: "center",
  },
  dotsRow: { flexDirection: "row", gap: 7, marginBottom: 22 },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "rgba(244,123,32,0.18)",
  },
  dotActive: { backgroundColor: COLORS.primary },
  caption: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textLight,
  },
});
