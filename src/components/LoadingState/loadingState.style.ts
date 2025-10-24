import { StyleSheet } from "react-native";

export const loadingstyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  contentWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  progressContainer: {
    marginVertical: 30,
    alignItems: "center",
  },
  message: {
    marginTop: 20,
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
  },
  submessage: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontWeight: "400",
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2ecc71",
    marginTop: 8,
  },
  dots: {
    marginTop: 15,
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
  },
  activeDot: {
    backgroundColor: "#2ecc71",
  },
});
