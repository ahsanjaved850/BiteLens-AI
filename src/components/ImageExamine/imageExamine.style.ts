import { Dimensions, StyleSheet } from "react-native";

const { width: SW } = Dimensions.get("window");

const C = {
  bg: "#FFFFFF",
  bgCard: "#FFFAF6",
  bgCardAlt: "#FFF5EC",
  bgGray: "#F5EDE0",

  textDark: "#0F1A22",
  textSec: "#7A8A98",
  textLight: "#B0BECA",

  primary: "#F47B20",
  primaryDark: "#D96A12",
  primaryLight: "#FFF3E8",
  primaryMuted: "#FFE0C2",

  border: "#F0DED0",
  borderLight: "#FAF0E8",

  success: "#2ECC71",
  successLight: "#EDFBF4",
  successBorder: "#B8F0D8",

  error: "#EF4444",
  white: "#FFFFFF",
};

export const imageExamineStyles = StyleSheet.create({
  container: {
    gap: 14,
  },

  // Warm on-brand — replaces the cold blue box
  instructionContainer: {
    backgroundColor: C.bgCardAlt,
    borderRadius: 16,
    padding: 16,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  instructionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.primaryMuted,
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: C.textDark,
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  instructionText: {
    fontSize: 12,
    color: C.textSec,
    lineHeight: 18,
    fontWeight: "500",
  },

  optionsGrid: {
    flexDirection: "row",
    gap: 12,
  },

  // Base card — both options share this
  optionCard: {
    flex: 1,
    backgroundColor: C.bgCardAlt,
    borderRadius: 22,
    padding: 20,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: C.border,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 4,
    gap: 10,
  },

  // Camera card — primary action, slightly warmer tint
  cameraCard: {
    backgroundColor: C.bgCardAlt,
    borderColor: C.border,
    borderWidth: 1.5,
  },

  // Gallery card — secondary action
  galleryCard: {
    backgroundColor: C.bgCardAlt,
  },

  // Press state — physical scale down
  optionCardPressed: {
    transform: [{ scale: 0.96 }],
    shadowOpacity: 0.04,
    elevation: 1,
  },

  // 3D icon tile — lifted square with shadow
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cameraIconContainer: {
    backgroundColor: "#DBEAFE",
  },
  galleryIconContainer: {
    backgroundColor: "#DCFCE7",
  },

  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: C.textDark,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  optionSubtitle: {
    fontSize: 11,
    color: C.textSec,
    textAlign: "center",
    lineHeight: 16,
    fontWeight: "500",
  },

  recommendedBadge: {
    backgroundColor: C.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: "700",
    color: C.white,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: C.bgCard,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  optionButtonPressed: {
    backgroundColor: C.bgCardAlt,
    transform: [{ scale: 0.98 }],
  },
  optionTextContainer: {
    flex: 1,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.bgGray,
    alignItems: "center",
    justifyContent: "center",
  },
  chevronIcon: {
    color: C.textLight,
  },

  // Full-width, tall — feels premium like a story card
  imagePreviewContainer: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.bgCardAlt,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },

  // Status bar at top of image preview
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: C.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
  },
  previewStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.success,
  },
  previewLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: C.textDark,
    flex: 1,
    letterSpacing: -0.2,
  },

  // Full-width image — no small square
  previewImageWrapper: {
    position: "relative",
    width: "100%",
    height: 260,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  // Remove button — orange circle, top-right
  removeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#C05010",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },

  // Processing overlay — warm white with orange spinner
  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 250, 246, 0.88)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  processingIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: C.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: C.primaryMuted,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  processingText: {
    fontSize: 16,
    fontWeight: "800",
    color: C.textDark,
    letterSpacing: -0.3,
    textAlign: "center",
    marginTop: 8,
  },
  processingSubtext: {
    fontSize: 12,
    color: C.textSec,
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
  },

  // Warm orange-tinted — replaces the yellow box
  tipsContainer: {
    backgroundColor: C.primaryLight,
    borderRadius: 16,
    padding: 14,
    marginTop: 4,
    borderWidth: 1,
    borderColor: C.primaryMuted,
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
    gap: 4,
  },
  tipsTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: C.primary,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  tipItem: {
    fontSize: 12,
    color: C.textSec,
    lineHeight: 18,
    fontWeight: "500",
  },

  // Active: orange bg — clearly tappable, on-brand.
  // Disabled (processing): grey bg — signals "not available right now".
  cancelButton: {
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.primary,
    shadowColor: "#C05010",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 0,
  },
  cancelButtonDisabled: {
    backgroundColor: "#D4D8DC", // neutral grey — clearly inactive
    shadowOpacity: 0,
    elevation: 0,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: C.white,
    letterSpacing: 0.3,
  },
  cancelButtonTextDisabled: {
    color: "#9AA0A6", // muted grey text on grey button
  },

  premiumProcessingWrap: {
    width: 128,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  processingPulseRing: {
    position: "absolute",
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: C.primary,
  },
  processingGlowCard: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255, 243, 232, 0.98)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 10,
    borderWidth: 1.5,
    borderColor: C.primaryMuted,
  },
  processingOuterRing: {
    position: "absolute",
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 3,
    borderColor: C.primary,
    borderTopColor: "rgba(244, 123, 32, 0.08)",
    borderRightColor: "rgba(244, 123, 32, 0.28)",
    borderBottomColor: C.primary,
    borderLeftColor: "rgba(244, 123, 32, 0.18)",
  },
  processingCore: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  processingScanLine: {
    position: "absolute",
    width: 62,
    height: 3,
    borderRadius: 2,
    backgroundColor: C.primary,
    opacity: 0.45,
  },
  processingDotsRow: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    gap: 6,
  },
  processingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.primary,
  },
});
