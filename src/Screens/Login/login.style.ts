import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    width: "100%",
    height: "100%",
  },
  formContainer: {
    display: "flex" as const,
    flexDirection: "column",
    marginTop: 60,
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 16,
  },
  input: {
    borderWidth: 0.7,
    marginBottom: 10,
    padding: 12,
    borderRadius: 20,
  },
  submitButton: {
    borderWidth: 0.5,
    marginBottom: 10,
    padding: 6,
    borderRadius: 20,
    fontWeight: "bold" as const,
    backgroundColor: "#FAF9F6",
    textAlign: "center" as const,
  },
  toggleContainer: {
    display: "flex" as const,
    flexDirection: "row",
    padding: 6,
    alignItems: "center",
  },
  toggleText: {
    marginRight: 3,
    fontSize: 12,
  },
  toggleLink: {
    fontSize: 13,
    fontWeight: "bold",
    textDecorationLine: "underline" as const,
  },
});
