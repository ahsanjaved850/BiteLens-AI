import { StyleSheet } from "react-native";

export const dataStyles = StyleSheet.create({
  headings: {
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
});
