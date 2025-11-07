import { StyleSheet } from "react-native";

export const imageExamineStyles = StyleSheet.create({
  container: {
    gap: 16,
  },

  // Instruction Section
  instructionContainer: {
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  instructionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  instructionText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
  },

  // Option Buttons
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionButtonPressed: {
    backgroundColor: "#F9FAFB",
    transform: [{ scale: 0.98 }],
  },

  // Icon Container
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cameraIconContainer: {
    backgroundColor: "#DBEAFE",
  },
  galleryIconContainer: {
    backgroundColor: "#DCFCE7",
  },

  // Option Text
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  optionSubtitle: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    fontWeight: "500",
  },

  // Chevron
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  chevronIcon: {
    color: "#999",
  },

  // Image Preview
  imagePreviewContainer: {
    marginTop: 8,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginLeft: 8,
  },
  previewImageWrapper: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  previewImage: {
    width: 180,
    height: 180,
    borderRadius: 12,
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  processingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },

  // Tips Section
  tipsContainer: {
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#92400E",
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  tipItem: {
    fontSize: 12,
    color: "#92400E",
    lineHeight: 18,
    marginBottom: 4,
  },
});
