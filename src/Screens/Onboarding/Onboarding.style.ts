import {
  Dimensions,
  StyleSheet
} from "react-native";

const { width, height } = Dimensions.get("window");

// ─── Eato-inspired Color Palette ───────────────────────────────────
export const COLORS = {
  // Primary warm palette
  primary: "#F5A623", // Warm amber/orange (Eato accent)
  primaryDark: "#E8951A",
  primaryLight: "#FFF8EC", // Very light warm cream
  primaryMuted: "#FFE8C2",

  // Secondary
  secondary: "#1B2838", // Dark navy (buttons, text)
  secondaryLight: "#2C3E50",

  // Accent colors
  accent: "#FF6B35", // Bold orange for highlights
  accentGreen: "#4CAF50",
  accentRed: "#FF4757",
  accentBlue: "#2196F3",

  // Background spectrum
  background: "#FFFDF7", // Warm off-white
  backgroundWarm: "#FFF9ED", // Slightly warmer
  backgroundCard: "#FFFFFF",
  backgroundGradientTop: "#FFF4D6", // Yellow gradient top
  backgroundGradientBottom: "#FFFDF7",
  backgroundGray: "#F5F3EE",

  // Text hierarchy
  text: "#1B2838",
  textSecondary: "#5A6B7E",
  textLight: "#9CA8B7",
  textDark: "#0F1923",
  textOnDark: "#FFFFFF",
  textAccent: "#F5A623",
  textGreen: "#2ECC71",

  // UI elements
  border: "#EDE8DF",
  borderLight: "#F5F0E8",
  borderFocused: "#F5A623",
  divider: "#F0EBE3",

  // Status colors
  success: "#2ECC71",
  error: "#FF4757",
  warning: "#F5A623",
  info: "#2196F3",

  // Base
  white: "#FFFFFF",
  black: "#000000",
  overlay: "rgba(27, 40, 56, 0.06)",
  overlayDark: "rgba(27, 40, 56, 0.5)",
};

// ─── Spacing System ────────────────────────────────────────────────
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// ─── Typography System ─────────────────────────────────────────────
export const TYPOGRAPHY = {
  displayLarge: {
    fontSize: 38,
    fontWeight: "800" as const,
    lineHeight: 44,
    letterSpacing: -0.8,
  },
  display: {
    fontSize: 32,
    fontWeight: "800" as const,
    lineHeight: 40,
    letterSpacing: -0.6,
  },
  h1: {
    fontSize: 28,
    fontWeight: "700" as const,
    lineHeight: 36,
    letterSpacing: -0.4,
  },
  h2: {
    fontSize: 24,
    fontWeight: "700" as const,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 17,
    fontWeight: "400" as const,
    lineHeight: 26,
  },
  bodySemibold: {
    fontSize: 16,
    fontWeight: "600" as const,
    lineHeight: 24,
  },
  small: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 13,
    fontWeight: "500" as const,
    lineHeight: 18,
  },
  tiny: {
    fontSize: 11,
    fontWeight: "600" as const,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  pickerLarge: {
    fontSize: 56,
    fontWeight: "700" as const,
    lineHeight: 64,
    letterSpacing: -1,
  },
  pickerMedium: {
    fontSize: 28,
    fontWeight: "500" as const,
    lineHeight: 36,
  },
  statLarge: {
    fontSize: 48,
    fontWeight: "800" as const,
    lineHeight: 56,
    letterSpacing: -1,
  },
};

// ─── Shadow System ─────────────────────────────────────────────────
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
  large: {
    shadowColor: "#1B2838",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  button: {
    shadowColor: "#1B2838",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
};

// ─── Modern Styles (Component Styles) ──────────────────────────────
export const modernStyles = StyleSheet.create({
  // ── Layout ─────────────────────
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Header & Logo ─────────────
  headerContainer: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  logoWrapper: {
    width: 72,
    height: 72,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.medium,
  },
  logoText: {
    fontSize: 38,
  },
  appTitle: {
    ...TYPOGRAPHY.display,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: SPACING.xs,
  },
  headerTitleLarge: {
    ...TYPOGRAPHY.display,
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 26,
    paddingHorizontal: SPACING.md,
  },
  subtitleLight: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: SPACING.lg,
  },
  emojiLarge: {
    fontSize: 72,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  emojiMedium: {
    fontSize: 52,
    textAlign: "center",
  },
  emojiContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: SPACING.lg,
  },
  emoji: {
    fontSize: 44,
  },
  headerName: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    textAlign: "center",
    marginTop: SPACING.sm,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xl,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain" as const,
    marginBottom: SPACING.md,
  },

  // ── Images ─────────────────────
  imageContainer: {
    width: "100%",
    height: height * 0.3,
    borderRadius: 24,
    overflow: "hidden",
    marginVertical: SPACING.lg,
    ...SHADOWS.medium,
  },
  imageLarge: {
    width: "100%",
    height: height * 0.38,
    borderRadius: 24,
    overflow: "hidden",
    marginVertical: SPACING.sm,
    ...SHADOWS.medium,
  },
  imageXlarge: {
    width: "100%",
    height: "90%",
    borderRadius: 24,
    overflow: "hidden",
    marginVertical: SPACING.sm,
    ...SHADOWS.medium,
  },
  imagemedium: {
    width: "100%",
    height: "71.5%",
    borderRadius: 24,
    overflow: "hidden",
    marginVertical: SPACING.sm,
    ...SHADOWS.medium,
  },
  imageFullWidth: {
    width: "100%",
    height: height * 0.4,
    borderRadius: 28,
    overflow: "hidden",
    marginVertical: SPACING.xl,
  },
  heroImage: {
    width: "100%",
    height: height * 0.45,
    borderRadius: 0,
    overflow: "hidden",
    marginVertical: 0,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  imageWithBorder: {
    borderWidth: 3,
    borderColor: COLORS.primaryMuted,
  },

  // ── Feature Tags ───────────────
  featureTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  featureTag: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.primaryMuted,
  },
  featureTagText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textDark,
    fontWeight: "600",
  },
  featureBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    alignSelf: "flex-start",
  },
  featureBadgeText: {
    ...TYPOGRAPHY.small,
    color: COLORS.primary,
    fontWeight: "600",
  },

  // ── Quote Section ──────────────
  quoteCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    padding: SPACING.lg,
    marginTop: SPACING.xl,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  quoteText: {
    ...TYPOGRAPHY.body,
    fontStyle: "italic",
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 26,
  },
  quoteAuthor: {
    ...TYPOGRAPHY.small,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: SPACING.sm,
    fontWeight: "500",
  },

  // ── Selection Options ──────────
  optionsContainer: {
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: SPACING.lg,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.backgroundCard,
    minHeight: 76,
  },
  optionButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    ...SHADOWS.small,
  },
  optionIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  optionIconLarge: {
    fontSize: 40,
    marginRight: SPACING.md,
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: "500",
  },
  optionTextSelected: {
    color: COLORS.textDark,
    fontWeight: "700",
  },
  optionDescription: {
    ...TYPOGRAPHY.small,
    color: COLORS.textLight,
    marginTop: 3,
  },
  optionCheckmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },

  // ── Form ───────────────────────
  formContainer: {
    marginTop: SPACING.xl,
    gap: SPACING.lg,
  },
  formGroup: {
    marginBottom: SPACING.md,
  },
  formLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  formInput: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: SPACING.md,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    backgroundColor: COLORS.backgroundCard,
    minHeight: 56,
  },
  formInputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.backgroundCard,
  },
  formHint: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },

  // ── Info Box ───────────────────
  infoBox: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    padding: SPACING.md,
    marginTop: SPACING.lg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoBoxSuccess: {
    backgroundColor: `${COLORS.success}10`,
    borderLeftColor: COLORS.success,
  },
  infoText: {
    ...TYPOGRAPHY.small,
    color: COLORS.text,
    lineHeight: 20,
    flex: 1,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },

  // ── Progress Indicator ─────────
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING.lg,
    gap: SPACING.xs,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  progressDotActive: {
    width: 28,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },

  // ── Input Section ──────────────
  inputContainer: {
    marginTop: SPACING.xl,
  },
  inputWrapper: {
    position: "relative",
  },
  inputLabel: {
    ...TYPOGRAPHY.small,
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
    fontWeight: "600",
  },
  input: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: SPACING.md,
    ...TYPOGRAPHY.body,
    color: COLORS.textDark,
    backgroundColor: COLORS.backgroundCard,
    minHeight: 56,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.backgroundCard,
  },
  inputIcon: {
    position: "absolute",
    right: SPACING.md,
    top: "50%",
    transform: [{ translateY: -12 }],
  },

  // ── Cards ──────────────────────
  card: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 20,
    padding: SPACING.lg,
    marginTop: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardElevated: {
    ...SHADOWS.medium,
    borderWidth: 0,
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textDark,
    marginBottom: SPACING.md,
  },
  cardSubtitle: {
    ...TYPOGRAPHY.small,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
  },
  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  nutritionRowLast: {
    borderBottomWidth: 0,
  },
  nutritionLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  nutritionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  nutritionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  nutritionValue: {
    ...TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.textDark,
  },

  // ── Decorative Elements ────────
  decorativeCircle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: `${COLORS.primary}10`,
  },
  decorativePattern: {
    position: "absolute",
    opacity: 0.05,
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(245, 166, 35, 0.04)",
  },

  // ── Spacing Utilities ──────────
  spacerSmall: {
    height: SPACING.md,
  },
  spacerMedium: {
    height: SPACING.xl,
  },
  spacerLarge: {
    height: SPACING.xxxl,
  },
});

// ─── Onboarding Loading Styles ─────────────────────────────────────
export const onboardingLoadingStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.lg,
  },
});

// ─── Onboarding Shell Styles ───────────────────────────────────────
export const onboardingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonHidden: {
    opacity: 0,
  },
  backButtonText: {
    fontSize: 22,
    color: COLORS.textDark,
    fontWeight: "600",
  },

  // Progress bar (replaces dots)
  progressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    marginHorizontal: SPACING.md,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },

  // Bottom bar
  bottomBar: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  nextButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.md + 2,
    borderRadius: 50,
    ...SHADOWS.button,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 58,
  },
  button: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 50,
    ...SHADOWS.button,
    minWidth: 140,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 58,
  },
  buttonDisabled: {
    backgroundColor: COLORS.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  doneButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    minWidth: 160,
  },
  buttonText: {
    color: COLORS.textOnDark,
    ...TYPOGRAPHY.bodySemibold,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  buttonTextDisabled: {
    color: COLORS.textLight,
  },

  // Dots (kept for compatibility but progress bar is primary)
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  dotInactive: {
    backgroundColor: COLORS.border,
  },
});

// ─── Scroll Picker Styles (Eato-style) ─────────────────────────────
export const pickerStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: SPACING.xl,
  },
  unitToggle: {
    flexDirection: "row",
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 25,
    padding: 4,
    marginBottom: SPACING.xl,
  },
  unitButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 22,
  },
  unitButtonActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.small,
  },
  unitButtonText: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.textLight,
  },
  unitButtonTextActive: {
    color: COLORS.white,
    fontWeight: "700",
  },
  scrollContainer: {
    height: 220,
    overflow: "hidden",
  },
  scrollContent: {
    alignItems: "center",
  },
  pickerItem: {
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.5,
  },
  pickerItemText: {
    ...TYPOGRAPHY.pickerMedium,
    color: COLORS.textLight,
  },
  pickerItemTextSelected: {
    ...TYPOGRAPHY.pickerLarge,
    color: COLORS.textDark,
  },
  selectionIndicator: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 56,
    marginTop: -28,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: COLORS.primary,
  },
  valueDisplay: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginBottom: SPACING.lg,
  },
  valueText: {
    ...TYPOGRAPHY.statLarge,
    color: COLORS.textDark,
  },
  unitText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  silhouetteContainer: {
    alignItems: "center",
    marginTop: SPACING.lg,
  },

  // Horizontal ruler (for weight)
  rulerContainer: {
    height: 80,
    marginTop: SPACING.md,
  },
  rulerContent: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 80,
    paddingHorizontal: width / 2 - 20,
  },
  rulerMark: {
    width: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  rulerMarkMajor: {
    height: 40,
    backgroundColor: COLORS.textSecondary,
  },
  rulerMarkMinor: {
    height: 20,
  },
  rulerLabel: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    position: "absolute",
    top: 0,
    fontWeight: "600",
  },
  rulerIndicator: {
    position: "absolute",
    top: 0,
    left: "50%",
    width: 3,
    height: 60,
    backgroundColor: COLORS.accent,
    borderRadius: 2,
    marginLeft: -1.5,
  },

  // BMI display
  bmiContainer: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 16,
    padding: SPACING.md,
    marginTop: SPACING.xl,
    marginHorizontal: SPACING.md,
    ...SHADOWS.small,
  },
  bmiRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bmiLabel: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.textDark,
  },
  bmiValue: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  bmiBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: SPACING.sm,
  },
  bmiBadgeText: {
    ...TYPOGRAPHY.tiny,
    fontWeight: "700",
  },
  bmiDescription: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
});

// ─── Health Concerns Styles ────────────────────────────────────────
export const healthStyles = StyleSheet.create({
  container: {
    marginTop: SPACING.lg,
    gap: SPACING.sm + 2,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  optionRowSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  optionEmoji: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  optionLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: "500",
    flex: 1,
  },
  optionLabelSelected: {
    color: COLORS.textDark,
    fontWeight: "600",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },
  behindQuestion: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  behindQuestionEmoji: {
    fontSize: 28,
    marginRight: SPACING.sm,
  },
  behindQuestionText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    flex: 1,
  },
  behindQuestionMore: {
    ...TYPOGRAPHY.small,
    color: COLORS.primary,
    fontWeight: "600",
  },
});

// ─── Comparison Card Styles ────────────────────────────────────────
export const comparisonStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  cardNegative: {
    flex: 1,
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 20,
    padding: SPACING.md,
    alignItems: "center",
  },
  cardPositive: {
    flex: 1,
    backgroundColor: "#FFF3CD",
    borderRadius: 20,
    padding: SPACING.md,
    alignItems: "center",
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: SPACING.sm,
  },
  cardTitle: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  pointRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    alignSelf: "flex-start",
  },
  pointIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  pointText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
  },
  calBadge: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: SPACING.sm,
  },
  calBadgeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    fontWeight: "700",
  },
});

// ─── Stats / Social Proof Styles ───────────────────────────────────
export const statsStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 20,
    padding: SPACING.lg,
    marginTop: SPACING.xl,
    ...SHADOWS.small,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  statRowLast: {
    borderBottomWidth: 0,
  },
  statValue: {
    ...TYPOGRAPHY.displayLarge,
    color: COLORS.success,
    fontWeight: "800",
    minWidth: 80,
  },
  statUnit: {
    ...TYPOGRAPHY.h3,
    color: COLORS.success,
    fontWeight: "700",
  },
  statDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    flex: 1,
    marginLeft: SPACING.md,
    lineHeight: 22,
  },
});

// ─── Nutrition Macro Tracker Styles ────────────────────────────────
export const macroStyles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.accent,
    borderRadius: 24,
    padding: SPACING.lg,
    marginTop: SPACING.xl,
    ...SHADOWS.medium,
  },
  cardInner: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.md,
  },
  macroTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.white,
    marginBottom: SPACING.md,
  },
  macroRow: {
    marginBottom: SPACING.md,
  },
  macroRowHighlighted: {
    backgroundColor: "#FFE0E0",
    borderRadius: 12,
    padding: SPACING.sm,
    marginHorizontal: -SPACING.sm,
  },
  macroLabel: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.textDark,
  },
  macroValue: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.textSecondary,
  },
  macroWarning: {
    color: COLORS.error,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 4,
    marginTop: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
});

// ─── Tailoring / Loading Styles ────────────────────────────────────
export const tailoringStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.display,
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: SPACING.xxl,
  },
  stepRow: {
    marginBottom: SPACING.xl,
  },
  stepLabel: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
  },
  stepLabelDim: {
    color: COLORS.textLight,
  },
  stepBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  stepBarFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  testimonialCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 20,
    padding: SPACING.lg,
    marginTop: SPACING.xxl,
    alignItems: "center",
    ...SHADOWS.small,
  },
  starsRow: {
    flexDirection: "row",
    marginBottom: SPACING.sm,
  },
  starText: {
    fontSize: 20,
    color: COLORS.primary,
  },
  testimonialText: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.textDark,
    textAlign: "center",
    lineHeight: 24,
  },
  testimonialAuthor: {
    ...TYPOGRAPHY.small,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
  },
});