import { StyleSheet } from "react-native";

export const settingStyles = StyleSheet.create({
  everyitem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    color: "darkgray",
    fontSize: 14,
    fontWeight: "normal",
    marginVertical: 10,
  },
  itemDetails: {
    fontSize: 14,
    fontWeight: "semibold",
    marginVertical: 10,
  },
});
