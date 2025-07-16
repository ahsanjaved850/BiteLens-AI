import { homeStyles } from "@/src/Screens/Home/Home.style";
import {
  formstyle,
  introstyle,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React from "react";
import { Image, StatusBar, Text, View } from "react-native";

export const Demo: React.FC = () => {
  return (
    <View style={formstyle.body}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View>
        <Text style={homeStyles.logoName}>Take A Snap</Text>
        <Text style={introstyle.introLine}>
          Snap of your food and we will tell you whats inside.
        </Text>
      </View>
      <View style={formstyle.dataForm}>
        <Image
          source={require("@/assets/images/vegan.jpg")}
          style={{ width: "70%", height: 180 }}
        ></Image>
        <View style={introstyle.nutrientsContainer}>
          <View style={introstyle.box}>
            <Text style={introstyle.macroNutrients}>Calories: 320kcal</Text>
          </View>
          <View style={introstyle.box}>
            <Text style={introstyle.macroNutrients}>Carbs: 54g</Text>
          </View>
          <View style={introstyle.box}>
            <Text style={introstyle.macroNutrients}>Protein: 13g</Text>
          </View>
          <View style={introstyle.box}>
            <Text style={introstyle.macroNutrients}>Fats: 5g</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
