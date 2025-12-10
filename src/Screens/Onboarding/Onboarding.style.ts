import {
  Dimensions,
  ImageStyle,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";

const { width, height } = Dimensions.get("window");

export const COLORS = {
  primary: "#4CAF50",
  primaryDark: "#45a049",
  primaryLight: "#E8F5E9",
  secondary: "#8BC34A",
  accent: "#FFC107",
  background: "#FFFFFF",
  backgroundLight: "#F8F9FA",
  backgroundGray: "#F5F5F5",
  text: "#2C3E50",
  textLight: "#95A5A6",
  textDark: "#1A1A1A",
  border: "#E8E8E8",
  borderLight: "#F0F0F0",
  success: "#4CAF50",
  error: "#FF6B6B",
  warning: "#FFC107",
  info: "#2196F3",
  white: "#FFFFFF",
  black: "#000000",
  gradient1: "#56AB2F",
  gradient2: "#A8E063",
  overlay: "rgba(0, 0, 0, 0.03)",
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const TYPOGRAPHY = {
  displayLarge: {
    fontSize: 40,
    fontWeight: "800" as const,
    lineHeight: 48,
    letterSpacing: -0.5,
  },
  display: {
    fontSize: 34,
    fontWeight: "800" as const,
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: 28,
    fontWeight: "700" as const,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  h2: { fontSize: 24, fontWeight: "600" as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: "600" as const, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: "400" as const, lineHeight: 24 },
  bodyLarge: { fontSize: 17, fontWeight: "400" as const, lineHeight: 26 },
  small: { fontSize: 14, fontWeight: "400" as const, lineHeight: 20 },
  caption: { fontSize: 13, fontWeight: "400" as const, lineHeight: 18 },
  tiny: { fontSize: 11, fontWeight: "500" as const, lineHeight: 16 },
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
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
};

interface ModernStyles {
  // Layout
  safeArea: ViewStyle;
  screenContainer: ViewStyle;
  contentContainer: ViewStyle;
  centeredContent: ViewStyle;

  // Header & Logo
  headerContainer: ViewStyle;
  logoWrapper: ViewStyle;
  logoText: TextStyle;
  appTitle: TextStyle;
  headerTitle: TextStyle;
  headerTitleLarge: TextStyle;
  subtitle: TextStyle;
  subtitleLight: TextStyle;
  emojiLarge: TextStyle;
  emojiMedium: TextStyle;
  emojiContainer: ViewStyle;
  emoji: TextStyle;
  headerName: TextStyle;
  logoContainer: ViewStyle;
  logo: ImageStyle;

  // Images
  imageContainer: ViewStyle;
  imageLarge: ViewStyle;
  imageXlarge: ViewStyle;
  imagemedium: ViewStyle;
  imageFullWidth: ViewStyle;
  image: ImageStyle;
  imageWithBorder: ViewStyle;
  heroImage: ViewStyle;

  // Feature Tags
  featureTagsContainer: ViewStyle;
  featureTag: ViewStyle;
  featureTagText: TextStyle;
  featureBadge: ViewStyle;
  featureBadgeText: TextStyle;

  // Quote Section
  quoteCard: ViewStyle;
  quoteText: TextStyle;
  quoteAuthor: TextStyle;

  // Input Section
  inputContainer: ViewStyle;
  inputLabel: TextStyle;
  input: TextStyle;
  inputFocused: ViewStyle;
  inputWrapper: ViewStyle;
  inputIcon: ViewStyle;

  // Cards
  card: ViewStyle;
  cardElevated: ViewStyle;
  cardTitle: TextStyle;
  cardSubtitle: TextStyle;
  nutritionRow: ViewStyle;
  nutritionRowLast: ViewStyle;
  nutritionLabel: ViewStyle;
  nutritionDot: ViewStyle;
  nutritionText: TextStyle;
  nutritionValue: TextStyle;

  // Selection Options
  optionsContainer: ViewStyle;
  optionButton: ViewStyle;
  optionButtonSelected: ViewStyle;
  optionIcon: TextStyle;
  optionIconLarge: TextStyle;
  optionContent: ViewStyle;
  optionText: TextStyle;
  optionTextSelected: TextStyle;
  optionDescription: TextStyle;
  optionCheckmark: ViewStyle;
  checkmarkText: TextStyle;

  // Info Box
  infoBox: ViewStyle;
  infoBoxSuccess: ViewStyle;
  infoText: TextStyle;
  infoIcon: TextStyle;

  // Form
  formContainer: ViewStyle;
  formGroup: ViewStyle;
  formInput: TextStyle;
  formInputFocused: ViewStyle;
  formLabel: TextStyle;
  formHint: TextStyle;

  // Progress Indicator
  progressContainer: ViewStyle;
  progressDot: ViewStyle;
  progressDotActive: ViewStyle;

  // Decorative Elements
  decorativeCircle: ViewStyle;
  decorativePattern: ViewStyle;
  gradientOverlay: ViewStyle;

  // Spacing Utilities
  spacerSmall: ViewStyle;
  spacerMedium: ViewStyle;
  spacerLarge: ViewStyle;
}

export const modernStyles = StyleSheet.create<ModernStyles>({
  // Layout
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

  // Header & Logo
  headerContainer: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  logoWrapper: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.medium,
  },
  logoText: {
    fontSize: 42,
  },
  appTitle: {
    ...TYPOGRAPHY.display,
    color: COLORS.primary,
    marginTop: SPACING.xs,
    letterSpacing: -0.5,
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
    color: COLORS.textLight,
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
    fontSize: 80,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  emojiMedium: {
    fontSize: 56,
    textAlign: "center",
  },
  emojiContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: SPACING.lg,
  },
  emoji: {
    fontSize: 48,
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
    resizeMode: "contain",
    marginBottom: SPACING.md,
  },

  // Images
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
    borderWidth: 4,
    borderColor: COLORS.primaryLight,
  },

  // Feature Tags
  featureTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  featureTag: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 24,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureTagText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textDark,
    fontWeight: "500",
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

  // Quote Section
  quoteCard: {
    backgroundColor: COLORS.backgroundLight,
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

  // Selection Options
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
    backgroundColor: COLORS.background,
    minHeight: 80,
  },
  optionButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    ...SHADOWS.small,
  },
  optionIcon: {
    fontSize: 36,
    marginRight: SPACING.md,
  },
  optionIconLarge: {
    fontSize: 44,
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
    fontWeight: "600",
  },
  optionDescription: {
    ...TYPOGRAPHY.small,
    color: COLORS.textLight,
    marginTop: 4,
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
    fontSize: 16,
    fontWeight: "700",
  },

  // Form Container
  formContainer: {
    marginTop: SPACING.xl,
    gap: SPACING.lg,
  },
  formGroup: {
    marginBottom: SPACING.md,
  },
  formLabel: {
    ...TYPOGRAPHY.small,
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  formInput: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: SPACING.md,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    backgroundColor: COLORS.background,
    minHeight: 56,
  },
  formInputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
  },
  formHint: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },

  // Info Box
  infoBox: {
    backgroundColor: `${COLORS.info}08`,
    borderRadius: 16,
    padding: SPACING.md,
    marginTop: SPACING.lg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.info,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoBoxSuccess: {
    backgroundColor: `${COLORS.success}08`,
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

  // Progress Indicator
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

  // Input Section
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
    backgroundColor: COLORS.background,
    minHeight: 56,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
  },
  inputIcon: {
    position: "absolute",
    right: SPACING.md,
    top: "50%",
    transform: [{ translateY: -12 }],
  },

  // Cards
  card: {
    backgroundColor: COLORS.background,
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
    paddingVertical: SPACING.sm,
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

  // Decorative Elements
  decorativeCircle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: `${COLORS.primary}08`,
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
    backgroundColor: "rgba(76, 175, 80, 0.05)",
  },

  // Spacing Utilities
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

export const onboardingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonHidden: {
    opacity: 0,
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.textDark,
    fontWeight: "600",
  },
  bottomBar: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md + 2,
    borderRadius: 16,
    ...SHADOWS.medium,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 16,
    ...SHADOWS.medium,
    minWidth: 140,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  buttonDisabled: {
    backgroundColor: COLORS.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  doneButton: {
    paddingHorizontal: SPACING.xl,
    minWidth: 160,
  },
  buttonText: {
    color: COLORS.white,
    ...TYPOGRAPHY.body,
    fontWeight: "600",
  },
  buttonTextDisabled: {
    color: COLORS.textLight,
  },
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
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  dotInactive: {
    backgroundColor: COLORS.border,
  },
});
