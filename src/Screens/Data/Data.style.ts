import { StyleSheet } from "react-native";

export const dataStyles = StyleSheet.create({
  sectionHeading: {
    fontSize: 14,
    marginVertical: 5,
    fontWeight: "bold",
  },
  cardStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#FAF9F6",
    borderRadius: 10,
  },
  updateButton: {
    backgroundColor: "black",
    padding: 2,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 20,
  },
  update: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "normal",
  },
  section: {
    backgroundColor: "#FAF9F6",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "85%",
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  confirmButton: {
    backgroundColor: "#000000",
    padding: 10,
    borderRadius: 6,
    minWidth: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
