import { StyleSheet } from "react-native";

export const introstyle = StyleSheet.create({
  headerName: {
    fontWeight: "bold",
    fontSize: 26,
  },
  logoContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",

    marginTop: 8,
  },
  logo: {
    width: 30,
    height: 35,
  },
  introLine: {
    fontSize: 13,
    fontWeight: "semibold",
    marginTop: 10,
  },
  imageContainer: {
    height: "90%",
    marginTop: 40,
  },
  image: {
    width: "100%",
    height: "65%",
    borderRadius: 10,
  },
  slidedetails: {
    marginVertical: 6,
    fontSize: 12,
  },
  box: {
    backgroundColor: "#FAF9F6",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  nutrientsContainer: {
    display: "flex",
    flexDirection: "column",
    width: "70%",
  },
  macroNutrients: {
    fontWeight: "bold",
    fontSize: 15,
  },
});
export const formstyle = StyleSheet.create({
  body: {
    padding: 10,
    backgroundColor: "white",
    width: "90%",
    height: "84%",
    marginInline: 8,
  },
  dataForm: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  DataDetails: {
    borderColor: "#ccc",
    width: "70%",
    borderWidth: 1,
    padding: 10,
    marginVertical: 20,
    borderRadius: 8,
    fontSize: 16,
    textAlign: "center",
  },
  formText: {
    fontSize: 16,
    textAlign: "center",
  },
});
