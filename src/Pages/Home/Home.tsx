import { JSX } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { dataStyles } from "../Data/Data.style";
import { homeStyles } from "./Home.style";

export const Home = (): JSX.Element => {
  return (
    <ScrollView style={homeStyles.body}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={homeStyles.heading}>
        <Image
          source={require("@/assets/images/Logo.png")}
          style={homeStyles.logo}
        />
        <Text style={homeStyles.logoName}>VeganCal</Text>
      </View>
      <View style={homeStyles.dailyDetails}>
        <View style={homeStyles.userProfile}>
          <Text style={homeStyles.impDetails}>Hi Ahsan,</Text>
          <Text>30 May</Text>
        </View>

        <View style={homeStyles.caloriesCard}>
          <Text>Calories</Text>
          <Text>Calories Left</Text>
        </View>
        <View style={homeStyles.macroNutrients}>
          <Text style={homeStyles.nutrientsCard}>Protein</Text>
          <Text style={homeStyles.nutrientsCard}>Carbs</Text>
          <Text style={homeStyles.nutrientsCard}>Fats</Text>
        </View>
      </View>
      <View style={dataStyles.section}>
        <Text style={dataStyles.sectionHeading}>Recently eaten</Text>
        <Text style={homeStyles.notesDetails}>
          Click on + to start tracking todays meal by taking a pictures
        </Text>
      </View>
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity style={homeStyles.button}>
          <Text style={homeStyles.plus}>+</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
