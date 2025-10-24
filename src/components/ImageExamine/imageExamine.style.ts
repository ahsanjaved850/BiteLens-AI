import { StyleSheet } from "react-native";

export const imageExamineStyles = StyleSheet.create({
  container: {
    gap: 12,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 14,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  iconSpacing: {
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  optionSubtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  chevronIcon: {
    fontSize: 24,
    color: "#999",
  },
  imagePreviewContainer: {
    marginTop: 15,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#f0f9ff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d0e8ff",
  },
  previewLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
});
